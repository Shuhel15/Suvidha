
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

type Props = {
  businessId: string;
  serviceId: string;
};

export default function BookServiceButton({
  businessId,
  serviceId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<{
    tokenNumber: number;
    id: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/customer/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          serviceId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to book this service.",
        );
      }

      setBooking(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (booking) {
    return (
      <div
        role="status"
        className="mt-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={19} />
          </span>
          <div>
            <p className="font-bold text-emerald-900">You&apos;re booked!</p>
            <p className="mt-1 text-sm text-emerald-800/80">
              Your queue token is{" "}
              <span className="font-extrabold">#{booking.tokenNumber}</span>
            </p>
          </div>
        </div>
        <Link
          href="/customer/dashboard"
          className="group mt-4 inline-flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-bold text-[#8f0e1e] transition hover:border-[#B11226]/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2"
        >
          Track your place in the queue
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleBooking}
        disabled={loading}
        aria-busy={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#B11226] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(177,18,38,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8f0e1e] hover:shadow-[0_12px_24px_rgba(177,18,38,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
      >
        {loading ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Booking your place...
          </>
        ) : (
          <>
            Book this service
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium leading-5 text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
