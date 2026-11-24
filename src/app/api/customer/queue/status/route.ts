
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { session, response } = await requireRole("CUSTOMER");

    if (response) return response;

    const tokens = await prisma.queueToken.findMany({
      where: {
        customerId: session.user.id,
      },
      include: {
        session: {
          include: {
            business: {
              select: {
                id: true,
                name: true,
                category: true,
                locations: {
                  take: 1,
                  select: {
                    area: true,
                    city: true,
                    addressLine: true,
                  },
                },
              },
            },
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
        createdAt: "desc",
      },
    });


    const activeTokens = tokens.filter(
      (token) =>
        token.status === "WAITING" ||
        token.status === "IN_PROGRESS",
    );

    const pastTokens = tokens.filter(
      (token) =>
        token.status === "COMPLETED" ||
        token.status === "CANCELLED" ||
        token.status === "SKIPPED",
    );

    // Fetch all active tokens from the relevant queue sessions
    const sessionIds = [
      ...new Set(activeTokens.map((token) => token.sessionId)),
    ];

    const queueTokens = sessionIds.length
      ? await prisma.queueToken.findMany({
          where: {
            sessionId: { in: sessionIds },
            status: {
              in: ["WAITING", "IN_PROGRESS"],
            },
          },
          include: {
            service: {
              select: {
                duration: true,
              },
            },
          },
          orderBy: {
            tokenNumber: "asc",
          },
        })
      : [];

    // Calculate position and estimated waiting time
    const enrichedActiveTokens = activeTokens.map((token) => {
      if (token.status === "IN_PROGRESS") {
        return {
          ...token,
          queuePosition: "Serving",
          peopleAhead: 0,
          estimatedWaitMinutes: 0,
        };
      }

      const tokensAhead = queueTokens.filter(
        (queueToken) =>
          queueToken.sessionId === token.sessionId &&
          queueToken.tokenNumber < token.tokenNumber,
      );

      const estimatedWaitMinutes = tokensAhead.reduce(
        (total, queueToken) => total + queueToken.service.duration,
        0,
      );

      return {
        ...token,
        queuePosition: tokensAhead.length + 1,
        peopleAhead: tokensAhead.length,
        estimatedWaitMinutes,
      };
    });


    return NextResponse.json({
      success: true,
      data: {
        activeTokens: enrichedActiveTokens,
        pastTokens,
      },
    });
  } catch (error) {
    console.error("Queue status API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
