import { NextResponse } from "next/server";
import { getPublicBusinesses } from "@/services/business.service";

export async function GET() {
  try {
    const businesses = await getPublicBusinesses();

    return NextResponse.json(
      {
        success: true,
        businesses,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching public businesses:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch public businesses",
      },
      { status: 500 },
    );
  }
}
