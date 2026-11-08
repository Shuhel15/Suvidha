import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";


type Props = {
  params: Promise<{
    businessId: string;
  }>;
};

export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { session, response } = await requireRole("BUSINESS_OWNER");

    if (response) return response;

    const { businessId } = await params;

    const result = await prisma.business.deleteMany({
      where: {
        id: businessId,
        ownerId: session!.user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting business:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
