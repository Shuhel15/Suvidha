import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { queueTokenSchema } from "@/validations/queue.validation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";


export async function POST(request: Request) {
  try {
    const { session, response } = await requireRole("CUSTOMER");

    if (response) return response;

    const body = await request.json();
    const validation = queueTokenSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { businessId, serviceId } = validation.data;

    // Verify business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        category: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, message: "Business not found." },
        { status: 404 },
      );
    }

    if (business.category !== "SALON") {
      return NextResponse.json(
        {
          success: false,
          message: "Queue tokens are only available for salons.",
        },
        { status: 400 },
      );
    }

    // Verify service belongs to this business and is active
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        duration: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found or unavailable.",
        },
        { status: 404 },
      );
    }

    // Get current date and time in India
    const now = new Date();

    const indiaDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const indiaTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(now);

    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
    }).format(now);

    const dayMap: Record<string, number> = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7,
    };

    const dayOfWeek = dayMap[weekday];

    // Get today's business hours
    const businessHours = await prisma.businessHours.findUnique({
      where: {
        businessId_dayOfWeek: {
          businessId,
          dayOfWeek,
        },
      },
    });

    if (
      !businessHours ||
      businessHours.isClosed ||
      !businessHours.openTime ||
      !businessHours.closeTime
    ) {
      return NextResponse.json(
        { success: false, message: "Salon is closed today." },
        { status: 400 },
      );
    }

    // Check whether salon is currently open
    if (
      indiaTime < businessHours.openTime ||
      indiaTime >= businessHours.closeTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Salon is currently closed. Please visit during opening hours.",
        },
        { status: 400 },
      );
    }

    // Create queue session and token in one transaction
    const queueDate = new Date(`${indiaDate}T00:00:00.000Z`);

    const token = await prisma.$transaction(async (tx) => {
      // Get or create today's queue session
      const queueSession = await tx.queueSession.upsert({
        where: {
          businessId_date: {
            businessId,
            date: queueDate,
          },
        },
        update: {},
        create: {
          businessId,
          date: queueDate,
        },
      });

      // Generate next token number atomically
      const updatedSession = await tx.queueSession.update({
        where: {
          id: queueSession.id,
        },
        data: {
          lastTokenNumber: {
            increment: 1,
          },
        },
        select: {
          lastTokenNumber: true,
        },
      });

      // Save customer token
      return tx.queueToken.create({
        data: {
          tokenNumber: updatedSession.lastTokenNumber,
          sessionId: queueSession.id,
          customerId: session.user.id,
          serviceId,
        },
        select: {
          id: true,
          tokenNumber: true,
          status: true,
          createdAt: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your service booked successfully.",
        data: token,
      },
      { status: 201 },
    );

  } catch (error) {

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You already booked a service for this salon today.",
        },
        { status: 409 },
      );
    }


    console.error("Queue API error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}

