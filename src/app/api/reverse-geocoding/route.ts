
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reverseGeocodingSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export async function POST(request: NextRequest) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body" },
        { status: 400 },
      );
    }

    const validation = reverseGeocodingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coordinates",
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { latitude, longitude } = validation.data;

    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      format: "jsonv2",
      addressdetails: "1",
      "accept-language": "en",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          "User-Agent": "Suvidha/1.0 (business location reverse geocoding)",
        },
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Geocoding service is temporarily unavailable",
        },
        { status: 502 },
      );
    }

    const data = await response.json();

    if (!data || !data.display_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Address details not found for this location",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      displayName: data.display_name,
      address: data.address,
      coordinates: {
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve address details",
      },
      { status: 500 },
    );
  }
}
