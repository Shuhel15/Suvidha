"use client";

import {
  Plus,
  Scissors,
  Clock,
  IndianRupee,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import AddServiceModal from "@/components/owner/AddServiceModel";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
};

type Props = {
  businessId: string;
  services: Service[];
};

export default function ServicesClient({ businessId, services }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddService = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5EBD0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-black/5 bg-white/55 p-6 shadow-[0_20px_60px_rgba(80,45,20,0.06)] backdrop-blur-sm sm:p-8 md:flex-row md:items-end">
        <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B11226]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226] shadow-inner shadow-black/10">
              <Sparkles size={13} />
              Your offerings
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#B11226] sm:text-4xl">
              Services
            </h1>
            <p className="font-custom font-semibold mt-2 max-w-xl text-sm leading-6 text-black/55 sm:text-base">
              Shape the experience your customers discover. Keep your menu
              clear, current, and easy to book.
            </p>
        </div>

        <button
          onClick={handleAddService}
            className="text-nowrap group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#B11226] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B11226]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8F0E1E]"
        >
            <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
          Add Service
        </button>
      </div>

      {services.length === 0 ? (
          <div className="flex min-h-100 flex-col items-center justify-center rounded-3xl border border-dashed border-[#B11226]/25 bg-white/45 px-6 text-center shadow-[0_12px_35px_rgba(80,45,20,0.04)]">
          <div className="mb-5 rounded-2xl bg-[#B11226]/10 p-5 text-[#B11226] shadow-inner shadow-black/10">
            <Scissors size={32} className="text-[#B11226]" />
          </div>

            <h2 className="text-xl font-bold text-gray-900">
            No services added yet
          </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Add your first service to give customers a clear reason to choose
            your business.
          </p>

            <button
            onClick={handleAddService}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#B11226] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B11226]/15 transition hover:-translate-y-0.5 hover:bg-[#8F0E1E]"
          >
            <Plus size={18} />
            Add Your First Service
          </button>
        </div>
      ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_35px_rgba(80,45,20,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[#B11226]/25 hover:shadow-[0_18px_40px_rgba(80,45,20,0.1)]"
            >
                <div className="absolute inset-x-0 top-0 h-1 bg-[#B11226] opacity-80" />
              <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-[#F5EBD0] p-2.5 text-[#B11226] shadow-inner shadow-black/10">
                      <Scissors size={18} />
                    </div>
                    <h2 className="truncate font-bold text-gray-900">{service.name}</h2>
                  </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    service.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-500/50 border"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {service.description ? (
                <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                  {service.description}
                </p>
              ) : (
                  <p className="mt-4 min-h-10 text-sm italic leading-5 text-gray-400">
                    No description added
                  </p>
              )}

                <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                  <IndianRupee size={16} />
                  {service.price}
                </span>

                  <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {service.duration} min
                </span>
                  <ArrowUpRight size={17} className="text-[#B11226] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      <AddServiceModal
        businessId={businessId}
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
      />
    </div>
  );
}
