"use client";

import { useState } from "react";
import BusinessCard from "@/components/business/BusinessCard";
import BusinessFilters from "@/components/business/BusinessFilters";

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

  return (
    <div className="space-y-8">
      <BusinessFilters
        onLocationDetectedAction={(coordinates: {
          latitude: number;
          longitude: number;
        }) => {
          console.log("Parent received coordinates:", coordinates);
          alert(JSON.stringify(coordinates));
        }}
      />
      <section>
        {businesses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-black/50">
            No businesses found.
          </p>
        )}
      </section>
    </div>
  );
}
