
import { auth } from "@/auth";
import { NextResponse } from "next/server";

type AccountRole = "CUSTOMER" | "BUSINESS_OWNER";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please log in first.",
        },
        { status: 401 }
      ),
    };
  }

  return {
    session,
    response: null,
  };
}

export async function requireRole(role: AccountRole) {
  const { session, response } = await requireAuth();

  if (response) {
    return { session: null, response };
  }

  if (session?.user?.accountType !== role) {
    return {
      session: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Forbidden. You don't have permission.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    session,
    response: null,
  };
}
