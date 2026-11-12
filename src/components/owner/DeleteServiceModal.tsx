
"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import { AlertTriangle, X, Trash2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
};

type Props = {
  businessId: string;
  service: Service;
  isOpen: boolean;
  onCloseAction: () => void;
};

export default function DeleteServiceModal({
  businessId,
  service,
  isOpen,
  onCloseAction,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleDelete = async()=>{
    try{
      setIsLoading(true);
      const response = await fetch(`/api/owner/businesses/${businessId}/services/${service.id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json();

      if(!response.ok){
        toast.error(data.message|| "Unable to delete service. Please try again later.");
        console.error(data);
        return;
      }

      toast.success(data.message || "Service deleted successfully.");
      onCloseAction();
      router.refresh();

    }catch(error){
      console.error("Error deleting service:", error);
      toast.error("An error occurred while deleting the service. Please try again later.");
    
  }finally{
    setIsLoading(false);
  }
  };

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-[#2b1712]/55 px-4 py-6 backdrop-blur-sm"
      onClick={onCloseAction}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-service-title"
        className="relative w-full max-w-md rounded-3xl border border-black/5 bg-[#fffdf8] p-6 shadow-[0_24px_80px_rgba(43,23,18,0.25)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCloseAction}
          className="absolute right-5 top-5 rounded-full p-2 text-gray-500 transition hover:bg-[#F5EBD0] hover:text-[#B11226]"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9E4DF] text-[#B11226] shadow-inner shadow-black/10">
          <AlertTriangle size={28} />
        </div>

        <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
          <Sparkles size={12} />
          Menu housekeeping
        </div>
        <h2 id="delete-service-title" className="text-2xl font-black tracking-tight text-gray-900">
          Delete Service?
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#B11226]">
            {service.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={onCloseAction}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#B11226]/25 hover:bg-[#FDF8EF] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleDelete}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#B11226] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B11226]/15 transition hover:-translate-y-0.5 hover:bg-[#8F0E1E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
