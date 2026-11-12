"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import { X, IndianRupee, Clock, Scissors, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
};

type Props = {
  businessId: string;
  service: Service;
  isOpen: boolean;
  onCloseAction: () => void;
};

export default function EditServiceModal({
  businessId,
  service,
  isOpen,
  onCloseAction,
}: Props) {
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description ?? "");
  const [price, setPrice] = useState(String(service.price));
  const [duration, setDuration] = useState(String(service.duration));
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    duration: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      price: "",
      duration: "",
    };

    if (!name.trim()) {
      newErrors.name = "Service name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!price || Number(price) <= 0) {
      newErrors.price = "Enter a valid price";
    }

    if (
      !duration ||
      !Number.isInteger(Number(duration)) ||
      Number(duration) <= 0
    ) {
      newErrors.duration = "Enter a valid duration";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    const serviceData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      duration: Number(duration),
    };

    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/owner/businesses/${businessId}/services/${service.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to update service");
        console.error(data);
        return;
      }

      toast.success("Service updated successfully!");

      onCloseAction();
      router.refresh();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Something went wrong");
    } finally {
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-service-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-black/5 bg-[#fffdf8] p-6 shadow-[0_24px_80px_rgba(43,23,18,0.25)] sm:p-8"
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

        <div className="mb-7 border-b border-black/5 pb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EBD0] text-[#B11226] shadow-inner shadow-black/10">
            <Scissors size={21} />
          </div>
          <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
            <Sparkles size={12} />
            Refine your menu
          </div>
          <h2 id="edit-service-title" className="text-2xl font-black tracking-tight text-gray-900">
            Edit Service
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Update the details of your service.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Haircut"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B11226] focus:ring-4 focus:ring-[#B11226]/10"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service..."
              className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B11226] focus:ring-4 focus:ring-[#B11226]/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Price (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="200"
                  className="w-full rounded-xl border border-black/10 bg-white py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B11226] focus:ring-4 focus:ring-[#B11226]/10"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Duration (Minutes)
              </label>
              <div className="relative">
                <Clock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  className="w-full rounded-xl border border-black/10 bg-white py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#B11226] focus:ring-4 focus:ring-[#B11226]/10"
                />
                {errors.duration && (
                  <p className="mt-1 text-xs text-red-600">{errors.duration}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#B11226] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#B11226]/15 transition hover:-translate-y-0.5 hover:bg-[#8F0E1E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
