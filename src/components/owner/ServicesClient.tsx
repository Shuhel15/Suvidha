"use client";

import { Plus, Scissors, Clock, IndianRupee } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the services offered by your business.
          </p>
        </div>

        <button
          onClick={handleAddService}
          className="inline-flex items-center gap-2 rounded-full bg-[#B11226] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#8F0E1E]"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="flex min-h-87.5 flex-col items-center justify-center rounded-2xl border border-dashed border-[#B11226]/30 bg-[#F5EBD0]/30 px-6 text-center">
          <div className="mb-4 rounded-full bg-[#B11226]/10 p-5">
            <Scissors size={32} className="text-[#B11226]" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No services added yet
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Start by adding the services your business provides.
          </p>

          <button
            onClick={handleAddService}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B11226] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#8F0E1E]"
          >
            <Plus size={18} />
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-900">{service.name}</h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    service.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {service.description && (
                <p className="mt-2 text-sm text-gray-500">
                  {service.description}
                </p>
              )}

              <div className="mt-5 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <IndianRupee size={16} />
                  {service.price}
                </span>

                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {service.duration} min
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddServiceModal
        businessId={businessId}
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
      />
    </div>
  );
}
