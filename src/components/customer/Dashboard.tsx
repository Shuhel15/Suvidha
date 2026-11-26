"use client";

import { useSession, signOut } from "next-auth/react";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Clock3,
  LogOut,
  MapPin,
  Scissors,
  Stethoscope,
  Timer,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type QueueToken = {
  id: string;
  tokenNumber: number;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "SKIPPED";
  queuePosition?: number | "Serving";
  peopleAhead?: number;
  estimatedWaitMinutes?: number;
  createdAt: string;
  session: {
    date: string;
    business: {
      id: string;
      name: string;
      category: string;
      locations: {
        area: string | null;
        city: string;
        addressLine: string;
      }[];
    };
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
};

type QueueResponse = {
  activeTokens: QueueToken[];
  pastTokens: QueueToken[];
};

const categories = [
  { id: "ALL", label: "All Bookings", icon: CalendarCheck },
  { id: "SALON", label: "Salon", icon: Scissors },
  { id: "CLINIC", label: "Clinic", icon: Stethoscope },
  { id: "REPAIR", label: "Repair", icon: Wrench },
];

const statusStyles: Record<QueueToken["status"], string> = {
  WAITING: "border-amber-200 bg-amber-50 text-amber-800",
  IN_PROGRESS: "border-sky-200 bg-sky-50 text-sky-800",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-800",
  SKIPPED: "border-stone-200 bg-stone-100 text-stone-700",
};

export default function CustomerDashboardComp() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeTokens, setActiveTokens] = useState<QueueToken[]>([]);
  const [pastTokens, setPastTokens] = useState<QueueToken[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<QueueToken | null>(
    null,
  );
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    let ignore = false;
    let isFetching = false;

    async function loadBookings(initialLoad = false) {
      if (isFetching) return;

      isFetching = true;

      try {
        const response = await fetch("/api/customer/queue/status", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch bookings.");
        }

        const data: QueueResponse = result.data;

        if (!ignore) {
          setActiveTokens(data.activeTokens);
          setPastTokens(data.pastTokens);
          setBookingError("");

          setSelectedBooking((current) => {
            if (!current) return null;

            const latestBooking = [
              ...data.activeTokens,
              ...data.pastTokens,
            ].find((booking) => booking.id === current.id);

            return latestBooking ?? current;
          });
        }
      } catch (error) {
        if (!ignore) {
          setBookingError(
            error instanceof Error ? error.message : "Unable to load bookings.",
          );
        }
      } finally {
        isFetching = false;

        if (!ignore && initialLoad) {
          setBookingsLoading(false);
        }
      }
    }

    // Initial API call
    loadBookings(true);

    // Refresh every 5 seconds
    const intervalId = window.setInterval(() => {
      loadBookings();
    }, 5000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const allBookings = [...activeTokens, ...pastTokens];

  const filteredBookings =
    selectedCategory === "ALL"
      ? allBookings
      : allBookings.filter(
          (booking) => booking.session.business.category === selectedCategory,
        );

  const handleCancelBooking = async () => {
    if (!selectedBooking || cancelling) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setCancelError("");

      const response = await fetch(
        `/api/customer/queue/${selectedBooking.id}`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to cancel booking.");
      }

      const cancelledBooking = {
        ...selectedBooking,
        status: "CANCELLED" as const,
      };

      setActiveTokens((previous) =>
        previous.filter((token) => token.id !== selectedBooking.id),
      );

      setPastTokens((previous) => [cancelledBooking, ...previous]);

      setSelectedBooking(cancelledBooking);
    } catch (error) {
      setCancelError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setCancelling(false);
    }
  };
  return (
    <>
      <section className="relative isolate min-h-screen mt-25 ">

        <div className="mx-auto max-w-7xl space-y-10">
          <header className="relative overflow-hidden rounded-4xl border border-[#B11226]/10 bg-white/85 p-6 shadow-[0_20px_55px_rgba(84,46,16,0.08)] sm:p-9">
            <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border-30 border-white/35" />
            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#B11226] shadow-sm">
                  <CalendarCheck size={14} />
                  Your Suvidha
                </p>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-[#3d2824] sm:text-4xl">
                  Welcome back,{" "}
                  <span className="text-[#B11226]">
                    {session?.user?.name || "there"}
                  </span>
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-black/55 sm:text-base">
                  Your appointments, queue updates, and service details—all in
                  one place.
                </p>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#B11226]/15 bg-white/75 px-4 py-3 text-sm font-bold text-[#8f0e1e] shadow-sm hover:border-[#B11226]/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2 active:scale-95 hover:scale-103 duration-200 transition-all"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          </header>

          <div>
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#B11226]">
                Stay in the loop
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-[#3d2824]">
                Your bookings
              </h2>
              <p className="mt-1 text-sm text-black/50">
                Choose a category to find the booking you&apos;re looking for.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                const count =
                  category.id === "ALL"
                    ? allBookings.length
                    : allBookings.filter(
                        (booking) =>
                          booking.session.business.category === category.id,
                      ).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    aria-pressed={isSelected}
                    className={`group rounded-2xl border p-5 text-left shadow-[0_8px_24px_rgba(84,46,16,0.05)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-[#B11226] bg-[#B11226] text-white shadow-[0_14px_30px_rgba(177,18,38,0.18)]"
                        : "border-black/[0.07] bg-white/85 text-gray-900 hover:border-[#B11226]/30 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-white/15 text-white"
                            : "bg-[#F5EBD0]/70 text-[#B11226]"
                        }`}
                      >
                        <Icon size={20} />
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-extrabold tabular-nums ${
                          isSelected
                            ? "bg-white/15 text-white"
                            : "bg-[#F5EBD0]/70 text-[#8f0e1e]"
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                    <h3 className="mt-4 font-bold">{category.label}</h3>
                    <p
                      className={`mt-1 text-xs ${
                        isSelected ? "text-white/75" : "text-gray-500"
                      }`}
                    >
                      {count === 1 ? "1 booking" : `${count} bookings`}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#3d2824]">
                    {
                      categories.find(
                        (category) => category.id === selectedCategory,
                      )?.label
                    }
                  </h2>
                  <p className="mt-1 text-sm text-black/45">
                    {filteredBookings.length === 1
                      ? "1 booking"
                      : `${filteredBookings.length} bookings`}
                  </p>
                </div>
                {!bookingsLoading && !bookingError && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                    </span>
                    Updates every 5 seconds
                  </span>
                )}
              </div>

              {bookingsLoading ? (
                <div
                  className="mt-5 grid gap-4 md:grid-cols-2"
                  aria-label="Loading bookings"
                  role="status"
                >
                  {[0, 1].map((item) => (
                    <div
                      key={item}
                      className="h-52 animate-pulse rounded-2xl border border-black/6 bg-white/70"
                    />
                  ))}
                  <span className="sr-only">Loading your bookings...</span>
                </div>
              ) : bookingError ? (
                <div
                  role="alert"
                  className="mt-5 rounded-2xl border border-red-200 bg-red-50/80 p-5 text-sm font-medium text-red-700"
                >
                  {bookingError}
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="mt-5 rounded-3xl border-2 border-dashed border-[#B11226]/20 bg-white/85 px-6 py-12 text-center shadow-sm">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5EBD0] text-[#B11226]">
                    <CalendarCheck size={26} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[#3d2824]">
                    No bookings found
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    You don&apos;t have any bookings in this category yet.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => {
                        if (booking.session.business.category === "SALON") {
                          setSelectedBooking(booking);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (
                          booking.session.business.category === "SALON" &&
                          (event.key === "Enter" || event.key === " ")
                        ) {
                          event.preventDefault();
                          setSelectedBooking(booking);
                        }
                      }}
                      role={
                        booking.session.business.category === "SALON"
                          ? "button"
                          : undefined
                      }
                      tabIndex={
                        booking.session.business.category === "SALON" ? 0 : -1
                      }
                      aria-label={
                        booking.session.business.category === "SALON"
                          ? `View queue details for ${booking.session.business.name}`
                          : undefined
                      }
                      className={`group rounded-2xl border border-black/[0.07] bg-white/90 p-5 shadow-[0_10px_30px_rgba(84,46,16,0.05)] transition duration-200 hover:border-[#B11226]/20 hover:shadow-[0_16px_38px_rgba(84,46,16,0.1)] ${
                        booking.session.business.category === "SALON"
                          ? "cursor-pointer hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="inline-flex rounded-full bg-[#F5EBD0]/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8f0e1e]">
                            {booking.session.business.category}
                          </span>
                          <h3 className="mt-2 truncate text-lg font-black text-[#3d2824]">
                            {booking.session.business.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {booking.service.name}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-extrabold ${
                            statusStyles[booking.status]
                          }`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F5EBD0]/45 px-4 py-3">
                        <span className="text-xs font-semibold text-black/50">
                          Queue token
                        </span>
                        <span className="font-black tabular-nums text-[#B11226]">
                          #{booking.tokenNumber}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-xs text-gray-600">
                        <p className="flex min-w-0 items-center gap-2">
                          <Clock3 size={15} className="shrink-0 text-[#B11226]" />
                          <span className="truncate">
                            {booking.service.duration} min
                          </span>
                        </p>
                        <p className="flex min-w-0 items-center gap-2">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-[#B11226]"
                          />
                          <span className="truncate">
                            {new Date(booking.session.date).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                        </p>
                        <p className="col-span-2 flex min-w-0 items-center gap-2">
                          <MapPin size={15} className="shrink-0 text-[#B11226]" />
                          <span className="truncate">
                            {booking.session.business.locations[0]?.area
                              ? `${booking.session.business.locations[0].area}, `
                              : ""}
                            {booking.session.business.locations[0]?.city ||
                              booking.session.business.locations[0]?.addressLine}
                          </span>
                        </p>
                      </div>

                      {booking.session.business.category === "SALON" && (
                        <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-black/6 pt-3 text-xs font-bold text-[#B11226]">
                          View live queue
                          <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Details Modal */}
      {selectedBooking &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onClick={() => setSelectedBooking(null)}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-[#211614]/55 p-3 backdrop-blur-md sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-dialog-title"
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-white/60 bg-linear-to-br from-[#fffdf8] to-[#F5EBD0] p-5 shadow-[0_30px_90px_rgba(27,16,13,0.3)] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#B11226]">
                    Your appointment
                  </p>

                  <h2
                    id="booking-dialog-title"
                    className="mt-2 text-2xl font-black tracking-tight text-[#3d2824] sm:text-3xl"
                  >
                    {selectedBooking.session.business.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {selectedBooking.service.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/6 bg-white/80 text-gray-600 shadow-sm transition hover:border-[#B11226]/20 hover:bg-[#B11226] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2"
                  aria-label="Close modal"
                >
                  <X
                    size={18}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-black/5 bg-white/85 p-5 shadow-[0_10px_30px_rgba(84,46,16,0.05)] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B11226] text-lg font-black tabular-nums text-white shadow-[0_8px_18px_rgba(177,18,38,0.2)]">
                      #{selectedBooking.tokenNumber}
                    </span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">
                        Queue token
                      </p>
                      <p className="mt-0.5 font-bold text-[#3d2824]">
                        {selectedBooking.service.name}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-[11px] font-extrabold ${
                      statusStyles[selectedBooking.status]
                    }`}
                  >
                    {selectedBooking.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F5EBD0]/45 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-black/45">
                      <Clock3 size={14} className="text-[#B11226]" />
                      Duration
                    </p>
                    <p className="mt-1.5 font-bold text-[#3d2824]">
                      {selectedBooking.service.duration} minutes
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F5EBD0]/45 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-black/45">
                      <CalendarDays size={14} className="text-[#B11226]" />
                      Booking date
                    </p>
                    <p className="mt-1.5 font-bold text-[#3d2824]">
                      {new Date(
                        selectedBooking.session.date,
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-xl bg-[#F5EBD0]/45 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-black/45">
                      <MapPin size={14} className="text-[#B11226]" />
                      Location
                    </p>
                    <p className="mt-1.5 font-bold text-[#3d2824]">
                      {[
                        selectedBooking.session.business.locations[0]?.area,
                        selectedBooking.session.business.locations[0]?.city,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                        selectedBooking.session.business.locations[0]
                          ?.addressLine ||
                        "Location not provided"}
                    </p>
                  </div>
                </div>

                {selectedBooking.status === "WAITING" && (
                  <div className="mt-5 rounded-2xl border border-[#d9c596]/65 bg-linear-to-br from-[#fffaf0] to-[#F5EBD0]/60 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#B11226] shadow-sm">
                        <Timer size={19} />
                      </span>
                      <div>
                        <h3 className="font-black text-[#3d2824]">
                          Your place in line
                        </h3>
                        <p className="mt-0.5 text-xs text-black/50">
                          Queue position{" "}
                          <span className="font-bold text-[#8f0e1e]">
                            #{selectedBooking.queuePosition}
                          </span>
                        </p>
                      </div>
                    </div>

                    {cancelError && (
                      <p
                        role="alert"
                        className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                      >
                        {cancelError}
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/80 bg-white/75 p-3.5">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-black/45">
                          <Users size={14} className="text-[#B11226]" />
                          People ahead
                        </p>
                        <p className="mt-2 text-2xl font-black tabular-nums text-[#3d2824]">
                          {selectedBooking.peopleAhead ?? 0}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/80 bg-white/75 p-3.5">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-black/45">
                          <Clock3 size={14} className="text-[#B11226]" />
                          Est. wait
                        </p>
                        <p className="mt-2 text-2xl font-black tabular-nums text-[#B11226]">
                          {selectedBooking.estimatedWaitMinutes ?? 0}
                          <span className="ml-1 text-sm font-bold">min</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      className="mt-4 w-full rounded-xl border border-rose-200 bg-white/75 px-4 py-3 text-sm font-bold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancelling ? "Cancelling booking..." : "Cancel booking"}
                    </button>
                  </div>
                )}

                {selectedBooking.status === "IN_PROGRESS" && (
                  <div
                    role="status"
                    className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-5"
                  >
                    <p className="font-bold text-sky-900">
                      Your service is in progress
                    </p>
                    <p className="mt-1 text-sm leading-6 text-sky-800">
                      The business is currently serving you.
                    </p>
                  </div>
                )}

                {selectedBooking.status === "COMPLETED" && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <h3 className="font-bold text-emerald-900">
                      Service Completed Successfully!
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      Your booking has been completed. Thank you for choosing
                      this business.
                    </p>
                  </div>
                )}

                {selectedBooking.status === "CANCELLED" && (
                  <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5">
                    <h3 className="font-bold text-rose-900">
                      Booking cancelled
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-rose-800">
                      This booking has been cancelled.
                    </p>
                  </div>
                )}

                {selectedBooking.status === "SKIPPED" && (
                  <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-100 p-5">
                    <h3 className="font-bold text-stone-800">Token skipped</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600">
                      Your token was skipped by the business.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
