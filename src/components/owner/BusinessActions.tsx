"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import DeleteBusinessButton from "./DeleteBusinessButton";

type Props = {
  businessId: string;
};

export default function BusinessActions({ businessId }: Props) {
  return (
    <section>
      <div className="flex w-full flex-wrap justify-between items-center gap-2">
        <Link
          href={`/owner/businesses/${businessId}/services`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#B11226]/25 bg-white/70 px-3 py-2 text-sm font-semibold whitespace-nowrap text-[#B11226] shadow-inner shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8f0e1e] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2"
        >
          <Eye size={18} />
          View Services
        </Link>
        {/* <Link
          href={`/owner/businesses/${businessId}/services`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#B11226]/25 bg-white/70 px-3 py-2 text-sm font-semibold whitespace-nowrap text-[#B11226] shadow-inner shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8f0e1e] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2"
        >
          <Plus
            size={17}
            className="transition-transform group-hover:rotate-180 duration-600"
          />

          
          Add Services
        </Link> */}
        <Link
          href={`/owner/businesses/${businessId}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#B11226] px-3 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-inner shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8f0e1e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226] focus-visible:ring-offset-2"
        >
          <Pencil
            size={18}
            className="transition-transform group-hover:-translate-x-0.5 duration-200"
          />
          Edit
        </Link>

        <DeleteBusinessButton businessId={businessId} />
      </div>
    </section>
  );
}
