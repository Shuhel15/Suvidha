"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import { X, IndianRupee, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  businessId: string;
  isOpen: boolean;
  onCloseAction: () => void;
};

export default function AddServiceModal({
  businessId,
  isOpen,
  onCloseAction,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    duration: "",
  });
  const router = useRouter();

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

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
        `/api/owner/businesses/${businessId}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      toast.success("Service created successfully!");

      setErrors({ name: "", price: "", duration: "" });
      setName("");
      setDescription("");
      setPrice("");
      setDuration("");

      onCloseAction();
      router.refresh();
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onCloseAction}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCloseAction}
          className="absolute right-5 top-5 rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="mb-7">
          <h2 className="text-2xl font-semibold text-gray-900">
            Add New Service
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Add a service that your business provides.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Haircut"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B11226]"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B11226]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-3 text-sm outline-none transition focus:border-[#B11226]"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-3 text-sm outline-none transition focus:border-[#B11226]"
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
            className="w-full rounded-full bg-[#B11226] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#8F0E1E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating..." : "Create Service"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
