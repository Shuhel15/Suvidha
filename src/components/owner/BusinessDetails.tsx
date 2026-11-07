import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  FileText,
  MapPin,
  Pencil,
  Phone,
  Tag,
  Trash2,
} from "lucide-react";

type Props = {
  business: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    phone: string;
    locations: {
      id: string;
      branchName: string | null;
      addressLine: string;
      area: string | null;
      city: string;
      state: string;
      postalCode: string;
      phone: string | null;
    }[];
  };
};

const details = [
  { label: "Business name", key: "name", icon: Building2 },
  { label: "Category", key: "category", icon: Tag },
  { label: "Contact number", key: "phone", icon: Phone },
] as const;

export default function BusinessDetails({ business }: Props) {
  return (
    <section className="mt-25">

      <div className=" mx-auto max-w-7xl space-y-6">
        <Link
          href="/owner/dashboard"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-black/50 transition hover:text-[#B11226]"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to dashboard
        </Link>

        <header className="flex flex-col gap-7 rounded-3xl border border-black/5 bg-white/50 p-5 shadow-[0_20px_60px_rgba(80,45,20,0.07)] backdrop-blur-sm sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#B11226]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B11226]" />
              Business management
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-[#B11226] [text-shadow:0_2px_4px_rgba(177,18,38,0.08),0_6px_18px_rgba(177,18,38,0.1)] sm:text-5xl">
              {business.name}
            </h1>
            <p className="font-custom mt-3 max-w-2xl text-base leading-7 text-black/60 sm:text-lg">
              Keep your business profile and locations clear, current, and
              ready for customers.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <Link 
            href={`/owner/businesses/${business.id}/edit`}
            className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#B11226]/25 bg-white/70 px-5 py-3 font-semibold text-[#B11226] transition hover:-translate-y-0.5 hover:border-[#B11226] hover:bg-white lg:flex-none">
              <Pencil size={17} className="transition-transform group-hover:-translate-x-0.5 duration-200" />
              Edit business
            </Link>
            <button className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B11226] px-5 py-3 font-semibold text-white shadow-lg shadow-[#B11226]/15 transition hover:-translate-y-0.5 hover:bg-[#8f0e1e] lg:flex-none">
              <Trash2 size={17} className="transition-transform group-hover:-translate-y-0.5 duration-200" />
              Delete
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(80,45,20,0.06)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-[#F5EBD0] p-3.5 text-[#B11226] shadow-inner shadow-black/10">
                <Building2 size={23} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
                  Overview
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Business information
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {details.map(({ label, key, icon: Icon }) => (
                <div
                  key={key}
                  className="rounded-2xl border border-black/5 bg-[#F5EBD0]/45 p-4"
                >
                  <Icon size={17} className="text-[#B11226]" />
                  <p className="mt-4 text-xs font-medium text-black/45">
                    {label}
                  </p>
                  <p className="mt-1 wrap-break-word font-bold text-gray-900">
                    {business[key]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#B11226]/10 bg-[#B11226] p-6 text-white shadow-[0_12px_35px_rgba(177,18,38,0.16)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/15 p-3.5">
                <FileText size={23} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
                  About your business
                </p>
                <h2 className="mt-1 text-2xl font-bold">Your story</h2>
              </div>
            </div>
            <p className="mt-8 text-sm leading-7 text-white/80">
              {business.description ||
                "Add a short description to help customers understand what makes your business special."}
            </p>
          </section>
        </div>

        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(80,45,20,0.06)] sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-[#F5EBD0] p-3.5 text-[#B11226] shadow-inner shadow-black/10">
                <MapPin size={23} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
                  Your presence
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Business locations
                </h2>
              </div>
            </div>
            <span className="w-fit rounded-full bg-[#B11226]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B11226]">
              {business.locations.length}{" "}
              {business.locations.length === 1 ? "branch" : "branches"}
            </span>
          </div>

          {business.locations.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {business.locations.map((location, index) => (
                <article
                  key={location.id}
                  className="group rounded-2xl border border-black/8 bg-[#F5EBD0]/35 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#B11226]/25 hover:bg-[#F5EBD0]/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B11226] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-gray-900">
                        {location.branchName || "Main branch"}
                      </h3>
                    </div>
                    <MapPin
                      size={18}
                      className="text-[#B11226] transition group-hover:scale-110"
                    />
                  </div>

                  <div className="mt-5 space-y-2 text-sm leading-6 text-gray-600">
                    <p>{location.addressLine}</p>
                    <p>
                      {[location.area, location.city, location.state]
                        .filter(Boolean)
                        .join(", ")}
                      <span className="font-medium text-gray-700">
                        {" "}
                        · {location.postalCode}
                      </span>
                    </p>
                    {location.phone && (
                      <p className="flex items-center gap-2 border-t border-black/5 pt-3 text-gray-700">
                        <Phone size={15} className="text-[#B11226]" />
                        {location.phone}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#B11226]/25 bg-[#F5EBD0]/35 p-8 text-center">
              <MapPin size={26} className="mx-auto text-[#B11226]" />
              <p className="mt-3 font-semibold text-gray-900">
                No locations added yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Add a branch so customers know where to find you.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
