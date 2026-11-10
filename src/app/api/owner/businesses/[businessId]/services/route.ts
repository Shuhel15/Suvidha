
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { createServiceSchema } from "@/validations/service.validation";

type Props = {
  params: Promise<{
    businessId: string;
  }>;
};

export async function POST(
  request: NextRequest,
  { params }: Props
) {
  try {
    // Check owner authorization
    const { session, response } = await requireRole("BUSINESS_OWNER");

    if (response) return response;

    // Get business ID from URL
    const { businessId } = await params;

    // Validate request body
    const body = await request.json();

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
        { status: 400 }
      );
    }

    // Check business ownership
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: session!.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    // Create service
    const service = await prisma.service.create({
      data: {
        ...validation.data,
        businessId: business.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully",
        service,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
