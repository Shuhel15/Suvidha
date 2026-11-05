import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { createBusinessSchema } from "@/validations/business.validation";

export async function POST(request: NextRequest) {
  try {
    //Check owner autharization
    const { session, response } = await requireRole("BUSINESS_OWNER");

    if (response) return response;

    const body = await request.json();

    const validation = createBusinessSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { location, ...businessData } = validation.data;

    //Create business and its first location
    const business = await prisma.business.create({
      data: {
        ...businessData,
        ownerId: session.user.id,
        locations: {
          create: {
            ...location,
          },
        },
      },

      include: {
        locations: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Business created successfully",
        business,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating business:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
