import { NextResponse, NextRequest } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { createBusinessSchema } from "@/validations/business.validation";

type Props = {
  params: Promise<{
    businessId: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    //Check business owner authentication
    const { session, response } = await requireRole("BUSINESS_OWNER");

    if (response) return response;

    //Check business id
    const { businessId } = await params;

    const body = await request.json();

    const validation = createBusinessSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, description, category, phone, location, hours } =
      validation.data;

    const updatedBusiness = await prisma.$transaction(
      async (tx) => {
        //Check ownership and get first location
        const existingBusiness = await tx.business.findFirst({
          where: {
            id: businessId,
            ownerId: session!.user.id,
          },
          include: {
            locations: {
              orderBy: {
                createdAt: "asc",
              },
              take: 1,
            },
          },
        });

        if (!existingBusiness) return null;

        //Update business info.
        await tx.business.update({
          where: {
            id: businessId,
          },
          data: {
            name,
            description: description || null,
            category,
            phone,
          },
        });

        //Update first branch location
        const firstLocation = existingBusiness.locations[0];

        if (firstLocation) {
          await tx.businessLocation.update({
            where: {
              id: firstLocation.id,
            },
            data: {
              branchName: location.branchName || null,
              addressLine: location.addressLine,
              area: location.area || null,
              city: location.city,
              state: location.state,
              postalCode: location.postalCode,
              phone: location.phone || null,
            },
          });
        }
        // Update business opening hours
        for (const hour of hours) {
          await tx.businessHours.upsert({
            where: {
              businessId_dayOfWeek: {
                businessId,
                dayOfWeek: hour.dayOfWeek,
              },
            },
            update: {
              openTime: hour.openTime,
              closeTime: hour.closeTime,
              isClosed: hour.isClosed,
            },
            create: {
              businessId,
              dayOfWeek: hour.dayOfWeek,
              openTime: hour.openTime,
              closeTime: hour.closeTime,
              isClosed: hour.isClosed,
            },
          });
        }
        return true;
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );

    if (!updatedBusiness) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Business updated successfully.",
    });
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
