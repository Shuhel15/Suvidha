
import { NextRequest, NextResponse } from "next/server";
import { getPublicBusinesses } from "@/services/business.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const area = searchParams.get("area") || undefined;
    const postalCode = searchParams.get("postalCode") || undefined;
    const search = searchParams.get("search") || undefined;

    const businesses = await getPublicBusinesses({
      category,
      city,
      area,
      postalCode,
      search,
    });

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
