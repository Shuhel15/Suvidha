import { getPublicBusinesses } from "@/services/business.service";
import { BuildingComplex, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import Spinner from "@/components/layout/Spineer";
import BusinessDiscovery from "@/components/business/BusinessDiscovery";
export const metadata: Metadata = {
  title: "Businesses",
  description: "Businesses in your area.",
};

async function BusinessesContent() {
  await connection();

  const businesses = await getPublicBusinesses();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-4xl border border-[#B11226]/10 bg-[#EDE0BE]/75 px-6 py-10 shadow-[0_24px_70px_rgba(84,46,16,0.1)] sm:px-9 sm:py-12 lg:px-12 lg:py-16">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border-38 border-[#B11226]/6" />
        <div className="pointer-events-none absolute -bottom-40 left-0 h-80 w-80 rounded-full border-38 border-[#B11226]/5" />

        <div className="relative max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#B11226]/10 bg-white/45 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black/55 shadow-inner shadow-black/5">
            <Sparkles size={15} className="text-[#B11226]" />
            Local businesses, made discoverable
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-black/80 sm:text-6xl">
            Find a place that{" "}
            <span className="text-[#B11226]">fits your day.</span>
          </h1>

          <p className="mt-5 max-w-2xl font-custom text-base leading-7 text-black/55 sm:text-lg">
            Explore trusted local businesses and the services they offer, all in
            one convenient place.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[#B11226]/10 bg-white/55 px-4 py-3 shadow-inner shadow-black/5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B11226] text-white">
              <BuildingComplex size={18} />
            </span>

            <p className="text-sm font-bold text-black/55">
              {businesses.length === 0
                ? "No businesses found."
                : `${businesses.length} ${
                    businesses.length === 1 ? "business" : "businesses"
                  } found.`}
            </p>
          </div>
        </div>

          <div className="relative mt-8 flex items-center gap-3 border-t border-[#B11226]/10 pt-5">
            <span className="h-2 w-2 rounded-full bg-[#B11226] shadow-[0_0_0_4px_#B112261A]" />
            <p className="font-custom text-sm text-black/50">
              Click any business card to book your service or appointment.
            </p>
          </div>
        </section>
        <BusinessDiscovery initialBusinesses={businesses} />
    </div>
  );
}

export default function BusinessesPage() {
  return (
    <main className="min-h-screen  pb-24 pt-28 ">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<Spinner />}>
          <BusinessesContent />
        </Suspense>
      </div>
    </main>
  );
}
