"use client";

import { useState } from "react";
import BusinessCard from "@/components/business/BusinessCard";
import BusinessFilters from "@/components/business/BusinessFilters";
import toast from "react-hot-toast";

type Business = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  locations: {
    addressLine: string;
    area: string | null;
    city: string;
    state: string;
  }[];
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
};

type BusinessDiscoveryProps = {
  initialBusinesses: Business[];
};

export default function BusinessDiscovery({
  initialBusinesses,
}: BusinessDiscoveryProps) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [loading, setLoading] = useState(false);

  async function handleLocationDetected(coordinates: {
    latitude: number;
    longitude: number;
  }) {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        latitude: String(coordinates.latitude),
        longitude: String(coordinates.longitude),
        radiusKm: "5",
      });

      const response = await fetch(
        `/api/customer/businesses?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch nearby businesses.");
      }

      setBusinesses(data.businesses);

      toast.success(`${data.businesses.length} nearby businesses found.`);
    } catch (error) {
      console.error("Nearby businesses error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <BusinessFilters onLocationDetectedAction={handleLocationDetected} />

      {loading && (
        <div
          className="flex flex-col items-center gap-3"
          aria-busy="true"
          aria-live="polite"
        >
          <div
            className="relative flex h-20 w-20 items-center justify-center"
            role="status"
            aria-label="Searching nearby businesses"
          >
            <span className="absolute h-16 w-16 animate-ping rounded-full border border-[#B11226]/30" />
            <span className="absolute h-12 w-12 animate-spin rounded-full border-2 border-[#EDE0BE] border-t-[#B11226] shadow-inner shadow-black/10" />
            <span className="relative h-4 w-4 rounded-full bg-[#B11226] shadow-[0_0_0_5px_#B1122633,0_3px_8px_#B1122666]" />
          </div>
          <p className="text-center font-semibold text-sm text-black/50 animate-pulse mt-5">
            Finding businesses near you...
          </p>
        </div>
      )}

      <section>
        {businesses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-black/50">
            No businesses found within 5 km.
          </p>
        )}
      </section>
    </div>
  );
}
