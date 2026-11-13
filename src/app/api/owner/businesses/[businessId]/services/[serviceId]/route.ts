import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import {
  updateServiceStatusSchema,
  createServiceSchema,
} from "@/validations/service.validation";

type Props = {
  params: Promise<{
    businessId: string;
    serviceId: string;
  }>;
};
// Edit services

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { session, response } = await requireRole("BUSINESS_OWNER");

    if (response) return response;

    const { businessId, serviceId } = await params;
    const body = await request.json();

    let updateData;

    // Status-only update
    if (
      typeof body === "object" &&
      body !== null &&
      !Array.isArray(body) &&
      Object.keys(body).length === 1 &&
      "isActive" in body
    ) {
      const validation = updateServiceStatusSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid service status",
          },
          { status: 400 },
        );
      }

      updateData = validation.data;
    } else {
      // Full service update
      const validation = createServiceSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            errors: validation.error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 400 },
        );
      }

      updateData = validation.data;
    }

    const result = await prisma.service.updateMany({
      where: {
        id: serviceId,
        businessId,
        business: {
          ownerId: session!.user.id,
        },
      },
      data: updateData,
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 },
      );
    }

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service updated successfully",
        service,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating service:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

//Delete Services
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { session, response } = await requireRole("BUSINESS_OWNER");

    if (response) return response;

    const { businessId, serviceId } = await params;

    const result = await prisma.service.deleteMany({
      where: {
        id: serviceId,
        businessId,
        business: {
          ownerId: session!.user.id,
        },
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting service:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
