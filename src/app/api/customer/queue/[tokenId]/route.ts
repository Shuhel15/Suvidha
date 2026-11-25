
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    tokenId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    // 1. Verify customer authentication
    const { session, response } = await requireRole("CUSTOMER");

    if (response) return response;

    // 2. Get token ID from URL
    const { tokenId } = await params;

    if (!tokenId) {
      return NextResponse.json(
        { success: false, message: "Token ID is required." },
        { status: 400 },
      );
    }

    // 3. Verify token belongs to logged-in customer
    const token = await prisma.queueToken.findFirst({
      where: {
        id: tokenId,
        customerId: session.user.id,
      },
    });

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found or access denied.",
        },
        { status: 404 },
      );
    }

    // 4. Only WAITING tokens can be cancelled
    if (token.status !== "WAITING") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot cancel a service with ${token.status} status.`,
        },
        { status: 409 },
      );
    }

    // 5. Update token status safely
    const result = await prisma.queueToken.updateMany({
      where: {
        id: tokenId,
        customerId: session.user.id,
        status: "WAITING",
      },
      data: {
        status: "CANCELLED",
      },
    });

    // Handle simultaneous status changes
    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Service status has changed. Please refresh your queue.",
        },
        { status: 409 },
      );
    }

    // 6. Fetch updated token
    const updatedToken = await prisma.queueToken.findUnique({
      where: {
        id: tokenId,
      },
      select: {
        id: true,
        tokenNumber: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Service cancelled successfully.",
      data: updatedToken,
    });
  } catch (error) {
    console.error("Customer queue cancellation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
