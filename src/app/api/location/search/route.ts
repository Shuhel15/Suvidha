import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")?.trim();

    if (!query || query.length < 3 || query.length > 120) {
      return NextResponse.json(
        { success: false, message: "Enter a valid location." },
        { status: 400 },
      );
    }

    const params = new URLSearchParams({
      q: query,
      format: "jsonv2",
      addressdetails: "1",
      limit: "5",
      countrycodes: "in",
      email: "hello@suvidha.in",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "User-Agent": "Suvidha/1.0 (hello@suvidha.in)",
          "Accept-Language": "en",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error("Location service is unavailable.");
    }

    const results = await response.json();

    const suggestions = results.map(
      (place: {
        place_id: number;
        display_name: string;
        lat: string;
        lon: string;
      }) => ({
        placeId: place.place_id,
        displayName: place.display_name,
        latitude: Number(place.lat),
        longitude: Number(place.lon),
      }),
    );

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Location search error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to search locations. Please try again.",
      },
      { status: 500 },
    );
  }
}