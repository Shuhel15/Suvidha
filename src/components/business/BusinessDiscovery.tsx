"use client";

import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import BusinessCard from "@/components/business/BusinessCard";
import BusinessFilters from "@/components/business/BusinessFilters";
import toast from "react-hot-toast";
import { calculateDistance } from "@/lib/distance";

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
    latitude: number | null;
    longitude: number | null;
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

//Sorting types
type SortOption = "nearest" | "price-low" | "price-high" | "name";

type CustomerLocation = {
  latitude: number;
  longitude: number;
  source: "GPS" | "MANUAL";
};

export default function BusinessDiscovery({
  initialBusinesses,
}: BusinessDiscoveryProps) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("nearest");
  const [customerLocation, setCustomerLocation] =
    useState<CustomerLocation | null>(null);

  async function handleLocationDetected(coordinates: {
    latitude: number;
    longitude: number;
  }) {
    try {
      setLoading(true);
      setCustomerLocation({
        ...coordinates,
        source: "GPS",
      });

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

  function handleManualLocationSelected(coordinates: {
  latitude: number;
  longitude: number;
}) {
  setCustomerLocation({
    ...coordinates,
    source: "MANUAL",
  });
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

  function handleClearFilters() {
    setBusinesses(initialBusinesses);
  }

  const businessesWithDistance = businesses.map((business) => {
    const businessLocation = business.locations[0];

    let distance: number | null = null;

    if (
      customerLocation &&
      typeof businessLocation?.latitude === "number" &&
      typeof businessLocation?.longitude === "number"
    ) {
      distance = calculateDistance(
        customerLocation.latitude,
        customerLocation.longitude,
        businessLocation.latitude,
        businessLocation.longitude,
      );
    }

    return {
      ...business,
      distance,
    };
  });

  //Sorting Businesses
  const sortedBusinesses = [...businessesWithDistance].sort((a, b) => {
    if (sortBy === "price-low") {
      const priceA = Math.min(...a.services.map((service) => service.price));
      const priceB = Math.min(...b.services.map((service) => service.price));

      return priceA - priceB;
    }

    if (sortBy === "price-high") {
      const priceA = Math.min(...a.services.map((service) => service.price));
      const priceB = Math.min(...b.services.map((service) => service.price));

      return priceB - priceA;
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    // Nearest First: GPS API se aane wala existing order preserve karo.
    return 0;
  });

  return (
    <div className="space-y-8">
      <BusinessFilters
        onLocationDetectedAction={handleLocationDetected}
        onManualSearchAction={handleManualSearch}
        onClearFiltersAction={handleClearFilters}
        onManualLocationSelectedAction={handleManualLocationSelected}
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
              Finding businesses...
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
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-lg font-bold text-black/80">
            Explore Businesses
          </h2>

          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-businesses"
              className="whitespace-nowrap text-sm font-medium text-black/55"
            >
              Sort by:
            </label>

            <select
              id="sort-businesses"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black/75 outline-none focus:border-[#B11226]"
            >
              <option value="nearest">Nearest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>
        {businesses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="group mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5EBD0] shadow-md shadow-black/10">
              <Search
                size={28}
                className="text-[#B11226] transition-transform group-hover:rotate-90 duration-300"
              />
            </div>

            <h3 className="text-lg font-bold text-black/75">
              No businesses found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-black/50">
              We couldn&apos;t find any businesses matching your search. Try
              changing your filters or searching in another location.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
