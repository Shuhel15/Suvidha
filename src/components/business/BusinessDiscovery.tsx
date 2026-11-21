"use client";

import { SearchX, Sparkles } from "lucide-react";
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

type ManualBusinessFilters = {
  search?: string;
  category?: string;
  city?: string;
  area?: string;
  postalCode?: string;
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

  async function handleManualSearch(filters: ManualBusinessFilters) {
  try {
    setLoading(true);

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value?.trim()) {
        params.set(key, value.trim());
      }
    });

    const response = await fetch(
      `/api/customer/businesses?${params.toString()}`,
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to search businesses.");
    }

    setBusinesses(data.businesses);
  } catch (error) {
    console.error("Manual search error:", error);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="space-y-8">
      <BusinessFilters 
      onLocationDetectedAction={handleLocationDetected}
      onManualSearchAction={handleManualSearch}
       />

      {loading && (
        <div
          className="rounded-3xl border border-[#B11226]/10 bg-[#EDE0BE]/35 px-6 py-10"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative flex h-16 w-16 items-center justify-center"
              role="status"
              aria-label="Searching nearby businesses"
            >
              <span className="absolute h-16 w-16 animate-ping rounded-full border border-[#B11226]/25" />
              <span className="absolute h-11 w-11 animate-spin rounded-full border-2 border-white border-t-[#B11226] shadow-inner shadow-black/10" />
              <span className="relative h-3.5 w-3.5 rounded-full bg-[#B11226] shadow-[0_0_0_5px_#B1122633,0_3px_8px_#B1122666]" />
            </div>
            <p className="animate-pulse text-center text-sm font-semibold text-black/50">
              Finding businesses near you...
            </p>
          </div>
        </div>
      )}

      <section aria-labelledby="business-results-title" className="space-y-5">
        <div className="flex flex-col gap-3 border-b border-black/[0.07] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
              <Sparkles size={14} />
              Explore local services
            </p>
            <h2
              id="business-results-title"
              className="mt-2 text-2xl font-black tracking-tight text-black/75 sm:text-3xl"
            >
              Businesses worth discovering
            </h2>
          </div>
          <p className="text-sm font-semibold text-black/40">
            {businesses.length} {businesses.length === 1 ? "result" : "results"}
          </p>
        </div>

        {businesses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#B11226]/20 bg-[#EDE0BE]/25 px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5EBD0] text-[#B11226] shadow-inner shadow-black/10">
              <SearchX size={25} />
            </span>
            <h3 className="mt-5 text-lg font-black text-black/70">
              No businesses found nearby
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-black/45">
              Try detecting your location again or check back soon for new
              local services.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
