import { Clock3, MapPin, Tag } from "lucide-react";

type BusinessCardProps = {
  business: {
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
};

export default function BusinessCard({ business }: BusinessCardProps) {
  const location = business.locations[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/[0.07] bg-white/45 p-5 shadow-[0_12px_35px_rgba(84,46,16,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B11226]/20 hover:shadow-[0_18px_40px_rgba(177,18,38,0.1)] sm:p-6">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[3rem] bg-[#B11226]/5 transition-colors duration-300 group-hover:bg-[#B11226]/9" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-black leading-tight text-black/75">
            {business.name}
          </h2>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5EBD0] text-[#B11226]">
            <Tag size={16} />
          </span>
        </div>

        <p className="mt-2 inline-flex rounded-full bg-[#B11226]/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#B11226]">
          {business.category}
        </p>

        {business.description && (
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-black/50">
            {business.description}
          </p>
        )}

        {location && (
          <p className="mt-5 flex items-start gap-2 border-t border-black/[0.07] pt-4 text-xs leading-5 text-black/50">
            <MapPin className="mt-0.5 shrink-0 text-[#B11226]" size={15} />
            <span>
              {[
                location.addressLine,
                location.area,
                location.city,
                location.state,
              ]
                .filter(Boolean)
                .join(", ")}
            </span>
          </p>
        )}

        <div className="mt-5 border-t border-black/[0.07] pt-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/40">
            Services
          </h3>

          {business.services.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {business.services.map((service) => (
                <li
                  key={service.id}
                  className="flex flex-col items-start gap-2 rounded-2xl border border-[#B11226]/[0.07] bg-[#EDE0BE]/30 px-3.5 py-3 text-sm text-black/60 transition-all duration-300 hover:border-[#B11226]/15 hover:bg-[#EDE0BE]/55 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-bold text-black/65">{service.name}</span>
                  <span className="flex flex-wrap items-center gap-1.5 text-xs text-black/40 sm:justify-end">
                    <span className="flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-200/50 px-2 py-1 font-semibold">
                      <Clock3 size={13} className="text-[#B11226]" />
                      {service.duration} min
                    </span>
                    <span className="rounded-full border border-emerald-300/70 bg-emerald-200/50 px-2 py-1 font-semibold text-emerald-700">
                      ₹{service.price}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-black/45">No active services.</p>
          )}
        </div>
      </div>
    </article>
  );
}
