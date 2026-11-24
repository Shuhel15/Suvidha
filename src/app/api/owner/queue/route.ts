import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateQueueTokenSchema = z.object({
  tokenId: z.string().min(1, "Token ID is required"),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "SKIPPED", "CANCELLED"]),
});

export async function GET(request: Request) {
  try {
    // 1. Check business owner authentication
    const { session, response } = await requireRole("BUSINESS_OWNER");

    if (response) return response;

    // 2. Get businessId from query parameters
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { success: false, message: "Business ID is required." },
        { status: 400 },
      );
    }

    // 3. Verify business belongs to logged-in owner
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: session.user.id,
        category: "SALON",
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          message: "Salon not found or you don't have permission.",
        },
        { status: 404 },
      );
    }

    // 4. Get today's date in India
    const indiaDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const queueDate = new Date(`${indiaDate}T00:00:00.000Z`);

    // 5. Fetch today's queue session
    const queueSession = await prisma.queueSession.findUnique({
      where: {
        businessId_date: {
          businessId,
          date: queueDate,
        },
      },
      include: {
        tokens: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                duration: true,
              },
            },
          },
          orderBy: {
            tokenNumber: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        business,
        queueSession,
        tokens: queueSession?.tokens ?? [],
      },
    });
  } catch (error) {
    console.error("Owner queue GET API error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}

//Patch for updating token status
export async function PATCH(request: Request) {
  try {
    const { session, response } = await requireRole("BUSINESS_OWNER");
    if (response) return response;

    const body = await request.json();
    const validation = updateQueueTokenSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data.",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { tokenId, status } = validation.data;

    //Finding token belonging to owners business
    const token = await prisma.queueToken.findUnique({
      where: {
        id: tokenId,
        session: {
          business: {
            ownerId: session.user.id,
            category: "SALON",
          },
        },
      },
    });

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token not found or access denied.",
        },
        { status: 404 },
      );
    }

    //check allowed status transitions
    const allowedTransitions: Record<string, string[]> = {
      WAITING: ["IN_PROGRESS", "SKIPPED", "CANCELLED"],
      IN_PROGRESS: ["COMPLETED", "SKIPPED", "CANCELLED"],
    };

    if (!allowedTransitions[token.status]?.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot change customer status from ${token.status} to ${status}.`,
        },
        { status: 400 },
      );
    }

    //Update token status
    const result = await prisma.queueToken.updateMany({
      where: {
        id: tokenId,
        status: token.status,
        session: {
          business: {
            ownerId: session.user.id,
            category: "SALON",
          },
        },
      },
      data: {
        status,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer status has changed. Please refresh the queue.",
        },
        { status: 409 },
      );
    }

    //Fetch updated token
    const updatedToken = await prisma.queueToken.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Customer status updated successfully.",
      data: updatedToken,
    });
  } catch (error) {
    console.error("Owner queue PATCH API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
