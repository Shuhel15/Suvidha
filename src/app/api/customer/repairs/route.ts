
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { createRepairJobSchema } from "@/validations/repair.validation";

export async function POST(request: Request) {
  try {
    const { session, response } = await requireRole("CUSTOMER");

    if (response) return response;

    const body = await request.json();
    const validation = createRepairJobSchema.safeParse(body);

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

    const { businessId, serviceId, itemName, issue, estimatedCost } =
      validation.data;

    // Verify repair business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        category: "REPAIR",
      },
      select: {
        id: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, message: "Repair business not found." },
        { status: 404 },
      );
    }

    // Verify service if provided
    if (serviceId) {
      const service = await prisma.service.findFirst({
        where: {
          id: serviceId,
          businessId,
          isActive: true,
        },
        select: {
          id: true,
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
    }

    // Generate job number and create job atomically
    const repairJob = await prisma.$transaction(async (tx) => {
      const counter = await tx.repairJobCounter.upsert({
        where: {
          businessId,
        },
        update: {
          lastJobNumber: {
            increment: 1,
          },
        },
        create: {
          businessId,
          lastJobNumber: 1,
        },
        select: {
          lastJobNumber: true,
        },
      });

      return tx.repairJob.create({
        data: {
          jobNumber: counter.lastJobNumber,
          itemName,
          issue,
          estimatedCost,
          customerId: session.user.id,
          businessId,
          serviceId,
        },
        select: {
          id: true,
          jobNumber: true,
          itemName: true,
          issue: true,
          status: true,
          estimatedCost: true,
          createdAt: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Repair job created successfully.",
        data: repairJob,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Repair API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
