
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

    const latitudeParam = searchParams.get("latitude");
    const longitudeParam = searchParams.get("longitude");
    const radiusParam = searchParams.get("radiusKm");

    const latitude =
      latitudeParam !== null ? Number(latitudeParam) : undefined;

    const longitude =
      longitudeParam !== null ? Number(longitudeParam) : undefined;

    const radiusKm =
      radiusParam !== null ? Number(radiusParam) : undefined;

    // Validate coordinates and radius
    if (
      (latitudeParam !== null && (
        !Number.isFinite(latitude) ||
        latitude! < -90 ||
        latitude! > 90
      )) ||
      (longitudeParam !== null && (
        !Number.isFinite(longitude) ||
        longitude! < -180 ||
        longitude! > 180
      )) ||
      (latitudeParam !== null) !== (longitudeParam !== null) ||
      (radiusParam !== null && (
        !Number.isFinite(radiusKm) ||
        radiusKm! <= 0 ||
        radiusKm! > 100
      ))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid location coordinates or radius.",
        },
        { status: 400 },
      );
    }

    const businesses = await getPublicBusinesses({
      category,
      city,
      area,
      postalCode,
      search,
      latitude,
      longitude,
      radiusKm,
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
