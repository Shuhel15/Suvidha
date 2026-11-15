import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const geocodingSchema = z.object({
  address: z.string().trim().min(5, "Valid address is required").max(300),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = geocodingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid address",
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const { address } = validation.data;

    const addressParts = address
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    // PIN code aur India ko parsing ke liye remove karo
    const locationParts = addressParts
      .filter((part) => !/^[1-9]\d{5}$/.test(part) && !/^india$/i.test(part))
      .slice(1);

    // Search queries: full address → area → city
    const queries = [
      {
        query: address,
        level: "full_address",
      },
      {
        query: `${locationParts.join(", ")}, India`,
        level: "area",
      },
      {
        query: `${locationParts.slice(-2).join(", ")}, India`,
        level: "city",
      },
    ].filter(
      (item, index, self) =>
        item.query.length >= 5 &&
        self.findIndex((q) => q.query === item.query) === index,
    );

    let results: Array<{
      lat: string;
      lon: string;
      display_name: string;
    }> = [];

    let matchedLevel = "";

    for (let index = 0; index < queries.length; index++) {
      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }

      const params = new URLSearchParams({
        q: queries[index].query,
        format: "jsonv2",
        limit: "1",
        countrycodes: "in",
        addressdetails: "1",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: {
            "User-Agent": "Suvidha/1.0 (business location geocoding)",
            "Accept-Language": "en",
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

      if (Array.isArray(data) && data.length > 0) {
        results = data;
        matchedLevel = queries[index].level;
        break;
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Location not found. Please select it manually on the map.",
        },
        { status: 404 },
      );
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coordinates received",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      coordinates: {
        latitude,
        longitude,
      },
      displayName: results[0].display_name,
      matchedLevel,
      requiresConfirmation: true,
    });
  } catch (error) {
    console.error("Geocoding error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process geocoding request",
      },
      { status: 500 },
    );
  }
}
