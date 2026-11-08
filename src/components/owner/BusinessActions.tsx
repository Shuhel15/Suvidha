"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Loader2, Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  businessId: string;
};

export default function BusinessActions({ businessId }: Props) {
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log("DELETE HANDLER CALLED");
    try {
      setLoading(true);
      const response = await fetch(`/api/owner/businesses/${businessId}`, {
        method: "DELETE",
      });

      console.log("Response status:", response.status);

      const data = await response.json();

      console.log("Response data:", data);

      if (!data.success) {
        toast.error(data.message || "Failed to delete business");
        return;
      }

      toast.success("Business deleted successfully!");
      setShowDeleteModal(false);
      router.refresh();
    } catch {
      toast.error("Oops! Somthing went wrong.");
    } finally {
      setLoading(false);
    }
  };

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

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="flex whitespace-nowrap items-center gap-2 rounded-xl border border-red-200 p-2 font-semibold text-red-600 hover:bg-red-50 hover:-translate-y-1 duration-200 shadow-inner shadow-black/10"
        >
          <Trash2
            size={18}
            className="transition-transform group-hover:-translate-y-0.5 duration-200"
          />
          Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="text-red-600" size={25} />
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Delete Business?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Are you sure you want to permanently delete this business? All
                associated branch locations will also be deleted. This action
                cannot be undone.
              </p>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:-translate-y-0.5 duration-200 shadow-inner shadow-black/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#B11226] px-5 py-3 font-semibold text-white hover:bg-[#8f0e1e] disabled:opacity-60 hover:-translate-y-0.5 duration-200 shadow-inner shadow-black/10"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
