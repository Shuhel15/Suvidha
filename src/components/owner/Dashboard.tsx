"use client";

import Link from "next/link";
import {
  Plus,
  Scissors,
  Stethoscope,
  Wrench,
  Store,
  MapPin,
  LogOut,
  BriefcaseBusiness,
  ArrowUpRight,
  Phone,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { staggerContainer, springItem } from "../layout/animation";
import { motion, type Variants } from "framer-motion";
import BusinessActions from "./BusinessActions";

type Business = {
  id: string;
  name: string;
  category: string;
  phone: string;
  locations: {
    city: string;
    state: string;
  }[];
};

type Props = {
  businesses: Business[];
};

const categoryIcons = {
  SALON: Scissors,
  CLINIC: Stethoscope,
  REPAIR: Wrench,
};

const categoryColors = {
  SALON: "bg-pink-100 text-pink-700",
  CLINIC: "bg-blue-100 text-blue-700",
  REPAIR: "bg-amber-100 text-amber-700",
};

export default function OwnerDashboardComp({ businesses }: Props) {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);

    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={staggerContainer}
      className="relative min-h-screen overflow-hidden bg-[#F5EBD0]  py-10  mt-20"
    >
      <div className="relative mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          variants={springItem as Variants}
          className="flex flex-col justify-between gap-7 rounded-3xl border border-black/5 bg-white/45 p-5 shadow-[0_20px_60px_rgba(80,45,20,0.06)] backdrop-blur-sm sm:p-8 lg:flex-row lg:items-end"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B11226]/15  px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] shadow-inner shadow-black/10 text-[#B11226]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B11226] animate-pulse" />
              Business Management
            </div>

            <h1 className="h2-text text-start [text-shadow:0_2px_4px_rgba(0,0,0,0.08),0_6px_18px_rgba(0,0,0,0.12)]">
              My <span className="text-black">Businesses</span>
            </h1>

            <p className="p-text mt-3 max-w-xl text-start font-semibold">
              Manage all your registered businesses in one place.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <Link
              href="/owner/businesses/new"
              className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B11226] px-5 py-3 font-semibold text-white shadow-lg shadow-[#B11226]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8f0e1e] lg:flex-none"
            >
              <Plus
                size={18}
                className="transition-transform duration-300 group-hover:rotate-180"
              />
              Add Business
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#B11226]/20 bg-white/70 px-5 py-3 font-semibold text-[#B11226] transition duration-200 hover:-translate-y-0.5 hover:border-[#B11226] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 lg:flex-none"
            >
              {loading ? "Logging out..." : "Logout"}
              <LogOut
                size={18}
                className="transition-transform group-hover:translate-x-1 duration-300"
              />
            </button>
          </div>
        </motion.div>

        {/* Business Count */}
        <motion.div
          variants={springItem as Variants}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="group rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_35px_rgba(80,45,20,0.06)] transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total businesses
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-gray-900">
                  {businesses.length}
                </p>
              </div>
              <div className="rounded-xl bg-[#F5EBD0] p-3 text-[#B11226] shadow-inner shadow-black/10">
                <BriefcaseBusiness size={22} />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-gray-400">
              Registered on Suvidha
            </p>
          </div>

          <motion.div
            variants={springItem as Variants}
            className="rounded-2xl border border-[#B11226]/10 bg-[#B11226] p-5 text-white shadow-[0_12px_35px_rgba(177,18,38,0.16)]"
          >
            <p className="text-sm font-medium text-white/70">Your workspace</p>
            <p className="mt-2 text-xl font-bold">Grow your local presence</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/75">
              Keep your business information up to date so customers can find
              and trust your services.
            </p>
          </motion.div>
        </motion.div>

        {/* Business List */}
        {businesses.length > 0 ? (
          <motion.div
            variants={springItem as Variants}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {businesses.map((business) => {
              const Icon =
                categoryIcons[
                  business.category as keyof typeof categoryIcons
                ] ?? Store;

              const iconColor =
                categoryColors[
                  business.category as keyof typeof categoryColors
                ] ?? "bg-[#F5EBD0] text-[#B11226]";

              const location = business.locations[0];

              return (
                <div
                  key={business.id}
                  className="group rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(80,45,20,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[#B11226]/30 hover:shadow-[0_18px_40px_rgba(80,45,20,0.1)]"
                >
                  {/* Business Details Link */}
                  <Link
                    href={`/owner/businesses/${business.id}`}
                    className="group block"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`rounded-2xl p-3.5 shadow-inner shadow-black/10 ${iconColor}`}
                      >
                        <Icon size={24} />
                      </div>

                      <span className="rounded-full bg-gray-50 p-2 text-gray-400 shadow-inner transition group-hover:bg-[#B11226]/10 group-hover:text-[#B11226]">
                        <ArrowUpRight
                          size={18}
                          className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>

                    <h2 className="mt-6 truncate text-xl font-bold text-gray-900">
                      {business.name}
                    </h2>

                    <span className="mt-2 inline-flex rounded-full bg-[#B11226]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#B11226] shadow-inner shadow-black/10">
                      {business.category}
                    </span>

                    <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="shrink-0 text-[#B11226] transition-transform group-hover:-translate-y-0.5 duration-200" />

                      {location
                        ? `${location.city}, ${location.state}`
                        : "Location not added"}
                    </div>

                    <p className="mt-2 flex items-center gap-2  border-t border-black/5 pt-3 text-sm text-gray-500">
                    <Phone size={16} className="shrink-0 text-[#B11226] transition-transform group-hover:-translate-x-0.5 duration-200" />
                      {business.phone}
                    </p>
                  </Link>

                  {/* Edit and Delete Actions */}
                  <div className="mt-5 border-t border-black/5 pt-4">
                    <BusinessActions businessId={business.id} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#B11226]/25 bg-white/70 p-12 text-center shadow-[0_12px_35px_rgba(80,45,20,0.04)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5EBD0] text-[#B11226] shadow-inner shadow-black/10">
              <Store size={30} />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No businesses yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Register your first business to get started.
            </p>

            <Link
              href="/owner/businesses/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#B11226] px-5 py-3 font-semibold text-white shadow-lg shadow-[#B11226]/15 transition hover:-translate-y-0.5 hover:bg-[#8f0e1e]"
            >
              <Plus size={18} />
              Add your first business
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
}
