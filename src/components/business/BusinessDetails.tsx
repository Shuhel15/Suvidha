import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock3,
  Tag,
  CalendarDays,
  BadgeCheck,
  Building2,
  ArrowRight,
} from "lucide-react";
import { getPublicBusinessDetails } from "@/services/business.service";
import BookServiceButton from "@/components/business/BookServiceButton";

type BusinessDetailsProps = {
  business: NonNullable<Awaited<ReturnType<typeof getPublicBusinessDetails>>>;
};

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function formatTime(time: string | null) {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default function BusinessDetails({ business }: BusinessDetailsProps) {
  const location = business.locations[0];
  const fullAddress = location
    ? [
        location.addressLine,
        location.area,
        location.city,
        location.state,
        location.postalCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <main className="min-h-screen pb-20 mt-25">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/businesses"
          className="group mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black/55 transition  hover:text-[#B11226]"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to businesses
        </Link>

        <section className="relative overflow-hidden rounded-4xl border border-black/[0.07] bg-white/70 shadow-[0_18px_55px_rgba(84,46,16,0.08)] backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-[8rem] bg-[#B11226]/6" />
          <div className="relative grid lg:grid-cols-[1fr_340px]">
            <div className="p-6 sm:p-9 lg:p-11">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#B11226]/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#B11226]">
                  <Tag size={14} />
                  {business.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <BadgeCheck size={16} />
                  Verified business
                </span>
              </div>

              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-black/80 sm:text-5xl">
                {business.name}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-black/55 sm:text-base">
                {business.description ||
                  "Discover quality local service and support at this trusted business."}
              </p>

              {location && (
                <div className="mt-7 flex items-start gap-3 border-t border-black/[0.07] pt-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EBD0] text-[#B11226]">
                    <MapPin size={19} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                      Location
                    </p>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-black/60">
                      {fullAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <aside className="flex flex-col justify-end border-t border-black/[0.07] bg-[#B11226] p-6 text-white lg:border-l lg:border-t-0 lg:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
                <Building2 size={21} />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                Get in touch
              </p>
              <p className="mt-2 text-xl font-black">{business.phone}</p>
              <a
                href={`tel:${business.phone}`}
                className="mt-6 group flex items-center justify-between rounded-xl bg-white px-4 py-3.5 text-sm font-black text-[#B11226] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#F5EBD0]"
              >
                Call business
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              {location?.latitude != null && location?.longitude != null && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 text-center text-xs font-bold text-white/70 underline decoration-white/30 underline-offset-4 transition hover:text-white"
                >
                  View on map
                </a>
              )}
            </aside>
          </div>
        </section>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B11226]">
                  What we offer
                </p>
                <h2 className="mt-2 text-2xl font-black text-black/75 sm:text-3xl">
                  Available services
                </h2>
              </div>
              <span className="hidden rounded-full border border-black/[0.07] bg-white/50 px-3 py-1.5 text-xs font-bold text-black/45 sm:block">
                {business.services.length}{" "}
                {business.services.length === 1 ? "service" : "services"}
              </span>
            </div>

            {business.services.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {business.services.map((service, index) => (
                  <article
                    key={service.id}
                    className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white/70 p-5 shadow-[0_10px_30px_rgba(84,46,16,0.05)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#B11226]/20 hover:shadow-[0_16px_35px_rgba(177,18,38,0.09)]"
                  >
                    <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-[3rem] bg-[#B11226]/5 transition group-hover:bg-[#B11226]/10" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5EBD0] text-xs font-black text-[#B11226]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <span className="text-lg font-black text-[#B11226]">
                        ₹{service.price}
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-black text-black/75">
                      {service.name}
                    </h3>
                    <div className="mt-4 flex items-center gap-1.5 border-t border-black/6 pt-4 text-xs font-bold text-black/45">
                      <Clock3 size={14} className="text-[#B11226]" />
                      {service.duration} minutes
                    </div>
                    {business.category === "SALON" && (
                      <BookServiceButton
                        businessId={business.id}
                        serviceId={service.id}
                      />
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-8 text-center text-sm text-black/45">
                No active services are available at the moment.
              </div>
            )}
          </section>

          <aside className="rounded-4xl border border-black/[0.07] bg-white/70 p-5 shadow-[0_14px_40px_rgba(84,46,16,0.06)] backdrop-blur-sm sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EBD0] text-[#B11226]">
                <CalendarDays size={21} />
              </span>
              <div>
                <h2 className="text-lg font-black text-black/75">
                  Opening hours
                </h2>
                <p className="mt-0.5 text-xs text-black/40">Weekly schedule</p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-black/6">
              {dayNames.map((day, index) => {
                const hours = business.hours.find(
                  (item) => item.dayOfWeek === index + 1,
                );

                return (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-3 py-3.5"
                  >
                    <span className="text-xs font-bold text-black/60 sm:text-sm">
                      {day}
                    </span>
                    {hours ? (
                      hours.isClosed ? (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black text-red-600">
                          Closed
                        </span>
                      ) : (
                        <span className="text-right text-xs font-bold text-black/50 sm:text-sm">
                          {formatTime(hours.openTime)} –{" "}
                          {formatTime(hours.closeTime)}
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-black/35">
                        Not available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
