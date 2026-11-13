"use client";

import {
  Plus,
  Scissors,
  Clock,
  IndianRupee,
  Sparkles,
  SquarePen,
  Trash,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import AddServiceModal from "@/components/owner/AddServiceModal";
import EditServiceModal from "@/components/owner/EditServiceModal";
import DeleteServiceModal from "@/components/owner/DeleteServiceModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const activeServices = services.filter((service) => service.isActive).length;

  //Add service modal open
  const handleAddService = () => {
    setIsModalOpen(true);
  };

  //Edit service modal open
  const handleEditService = (service: Service) => {
    setSelectedService(service);
  };

  //Delete service modal open
  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
  };

  //Toggle service status
  const handleToggleStatus = async (service: Service) => {
    setUpdatingServiceId(service.id);

    try {
      const response = await fetch(
        `/api/owner/businesses/${businessId}/services/${service.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !service.isActive,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to update service status");
        return;
      }

      toast.success(
        `Service ${!service.isActive ? "activated" : "deactivated"} successfully!`,
      );

      router.refresh();
    } catch (error) {
      console.error("Error updating service status:", error);
      toast.error("Something went wrong");
    } finally {
      setUpdatingServiceId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-7 px-3 sm:px-0">
        <div className="overflow-hidden rounded-4xl border border-black/5 bg-white/60 shadow-[0_20px_60px_rgba(80,45,20,0.06)] backdrop-blur-sm">
          <div className="flex flex-col justify-between gap-6 p-5 sm:gap-7 sm:p-8 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#B11226]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#B11226] shadow-inner shadow-black/10 sm:tracking-[0.2em]">
                <Sparkles size={13} />
                Your offerings
              </div>
              <h1 className="text-3xl font-black tracking-[-0.04em] text-[#B11226] sm:text-5xl">
                Services
              </h1>
              <p className="font-custom mt-3 max-w-xl text-sm font-semibold leading-6 text-black/55 sm:text-base">
                Shape the experience customers discover. Keep your menu clear,
                current, and easy to book.
              </p>
              <div className="mt-5 max-w-2xl rounded-2xl border border-[#B11226]/10 bg-[#F5EBD0]/45 p-3.5 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
                  Manage your services
                </p>
                <ol className="mt-3 grid gap-x-6 gap-y-2 text-sm font-medium text-black/60 sm:grid-cols-2">
                  <li className="flex min-w-0 items-start gap-2">
                    <span className="font-bold text-[#B11226]">1.</span>
                    <span className="min-w-0 wrap-break-word">Edit services</span>
                  </li>
                  <li className="flex min-w-0 items-start gap-2">
                    <span className="font-bold text-[#B11226]">2.</span>
                    <span className="min-w-0 wrap-break-word">Add services</span>
                  </li>
                  <li className="flex min-w-0 items-start gap-2">
                    <span className="font-bold text-[#B11226]">3.</span>
                    <span className="min-w-0 wrap-break-word">Delete services</span>
                  </li>
                  <li className="flex min-w-0 items-start gap-2">
                    <span className="font-bold text-[#B11226]">4.</span>
                    <span className="min-w-0 wrap-break-word">
                      Make services hidden/visible for customers
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            <button
              onClick={handleAddService}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#B11226] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B11226]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8F0E1E] sm:w-auto lg:shrink-0"
            >
              <Plus
                size={18}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              Add Service
            </button>
          </div>

          <div className="grid grid-cols-2 border-t border-black/5 bg-[#F5EBD0]/35 sm:grid-cols-3">
            <div className="px-4 py-4 sm:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                Total services
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight text-gray-900">
                {services.length}
              </p>
            </div>
            <div className="border-l border-black/5 px-4 py-4 sm:border-l sm:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                Visible to customers
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-2xl font-black tracking-tight text-emerald-700">
                <CheckCircle2 size={20} />
                {activeServices}
              </p>
            </div>
            <div className="col-span-2 border-t border-black/5 px-4 py-4 sm:col-span-1 sm:border-l sm:border-t-0 sm:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                Menu tip
              </p>
              <p className="mt-1 text-sm font-semibold text-[#B11226]">
                Clear names convert better
              </p>
            </div>
          </div>
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
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-[0_12px_35px_rgba(80,45,20,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[#B11226]/25 hover:shadow-[0_18px_40px_rgba(80,45,20,0.1)] sm:p-6"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#B11226] via-[#D49A3A] to-[#B11226]/20" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="shrink-0 rounded-2xl bg-[#F5EBD0] p-3 text-[#B11226] shadow-inner shadow-black/10 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
                      <Scissors size={19} />
                    </div>
                    <h2 className="truncate text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                      {service.name}
                    </h2>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    service.isActive
                      ? "border-emerald-500/25 bg-emerald-50 text-emerald-700 animate-pulse"
                      : "border-gray-300/60 bg-gray-100 text-gray-500"
                  }`}>
                    {service.isActive ? "Live" : "Hidden"}
                  </span>
                </div>

                {service.description ? (
                  <p className="mt-5 line-clamp-2 min-h-10 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>
                ) : (
                  <p className="mt-5 min-h-10 text-sm italic leading-6 text-gray-400">
                    No description added
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-black/5 pt-4 text-sm">
                  <span className="flex justify-center items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-700 ">
                    <IndianRupee size={16} />
                    <span>{service.price}</span>
                  </span>
                  <span className="flex justify-center items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-2 font-bold text-orange-600">
                    <Clock size={16} />
                    {service.duration} min
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleEditService(service)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#B11226]/25 px-3 py-2 text-sm font-semibold text-[#B11226] transition hover:border-[#B11226] hover:bg-[#B11226] hover:text-white active:scale-95"
                  >
                    <SquarePen size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={updatingServiceId !== null}
                    onClick={() => handleToggleStatus(service)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      service.isActive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-emerald-700 hover:bg-emerald-50 "
                    }`}
                  >
                    {updatingServiceId === service.id
                      ? "Updating..."
                      : service.isActive
                        ? "Hide service"
                        : "Make visible"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteService(service)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
                    aria-label={`Delete ${service.name}`}
                  >
                    <Trash size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Add Service Modal */}
      <AddServiceModal
        businessId={businessId}
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
      />
      {/* Edit Service Modal */}
      {selectedService && (
        <EditServiceModal
          businessId={businessId}
          service={selectedService}
          isOpen={!!selectedService}
          onCloseAction={() => setSelectedService(null)}
        />
      )}

      {/* Delete Service Modal */}
      {serviceToDelete && (
        <DeleteServiceModal
          businessId={businessId}
          service={serviceToDelete}
          isOpen={!!serviceToDelete}
          onCloseAction={() => setServiceToDelete(null)}
        />
      )}
    </div>
  );
}
