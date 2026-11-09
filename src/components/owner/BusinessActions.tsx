"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import DeleteBusinessButton from "./DeleteBusinessButton";

type Props = {
  businessId: string;
};

export default function BusinessActions({ businessId }: Props) {
  return (
    <section>
      <div className="flex flex-row gap-3 justify-between items-center">
        <Link
          href={`/owner/businesses/${businessId}/edit`}
          className="flex items-center gap-2 rounded-xl bg-[#B11226] whitespace-nowrap font-semibold text-white hover:bg-[#8f0e1e] hover:-translate-y-1 duration-200 py-2 px-3 shadow-inner shadow-black/10"
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
