"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Building2, Clock3, Copy, MapPin, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { staggerContainer, springItem } from "../layout/animation";
import { motion, type Variants } from "framer-motion";

type Props = {
  business: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    phone: string;
    locations: {
      id: string;
      branchName: string | null;
      addressLine: string;
      area: string | null;
      city: string;
      state: string;
      postalCode: string;
      phone: string | null;
    }[];
    hours: {
      id: string;
      dayOfWeek: number;
      openTime: string | null;
      closeTime: string | null;
      isClosed: boolean;
    }[];
  };
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const fieldClass =
  "w-full rounded-xl border border-[#d9cdb5] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#201b17] shadow-[0_1px_2px_rgba(54,38,20,0.04)] outline-none transition placeholder:text-[#9b9185] hover:border-[#b8a78d] focus:border-[#B11226] focus:ring-4 focus:ring-[#B11226]/10";

const labelClass =
  "mb-2 block text-[13px] font-semibold tracking-wide text-[#332a23]";

export default function EditBusinessForm({ business }: Props) {
  const [formData, setFormData] = useState({
    name: business.name,
    description: business.description || "",
    category: business.category,
    phone: business.phone,
    location: {
      branchName: business.locations[0]?.branchName || "",
      addressLine: business.locations[0]?.addressLine || "",
      area: business.locations[0]?.area || "",
      city: business.locations[0]?.city || "",
      state: business.locations[0]?.state || "",
      postalCode: business.locations[0]?.postalCode || "",
      phone: business.locations[0]?.phone || "",
    },
    hours: weekDays.map((_, index) => {
      const existingHour = business.hours.find(
        (hour) => hour.dayOfWeek === index + 1,
      );

      return {
        dayOfWeek: index + 1,
        openTime: existingHour?.openTime ?? "10:00",
        closeTime: existingHour?.closeTime ?? "19:00",
        isClosed: existingHour?.isClosed ?? false,
      };
    }),
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleBusinessChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleHoursChange = (
    dayOfWeek: number,
    field: "openTime" | "closeTime" | "isClosed",
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      hours: prev.hours.map((hour) =>
        hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour,
      ),
    }));
  };

  const handleApplyToWeekdays = () => {
    setFormData((prev) => {
      const monday = prev.hours.find((hour) => hour.dayOfWeek === 1);

      if (!monday) return prev;

      return {
        ...prev,
        hours: prev.hours.map((hour) =>
          hour.dayOfWeek !== 1
            ? {
                ...hour,
                openTime: monday.openTime,
                closeTime: monday.closeTime,
                isClosed: monday.isClosed,
              }
            : hour,
        ),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/owner/businesses/${business.id}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to update business");
        return;
      }

      toast.success("Business updated successfully!");
      router.push(`/owner/businesses/${business.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Something went wrong while updating your business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={staggerContainer}
      className="relative mt-30"
    >
      <form
        onSubmit={handleSubmit}
        aria-busy={loading}
        className="relative mx-auto max-w-5xl"
      >
        <Link
          href={`/owner/businesses/${business.id}`}
          className="group mb-7 inline-flex items-center gap-2 text-sm font-semibold text-black/50 transition hover:text-[#B11226]"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to business
        </Link>

        <motion.header
          variants={staggerContainer}
          className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <motion.div variants={springItem as Variants}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B11226]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226] shadow-inner shadow-black/10">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B11226] animate-pulse" />
              Business settings
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-[-0.04em] text-[#201b17] sm:text-5xl">
              Refine your business{" "}
              <span className="text-[#B11226]">presence.</span>
            </h1>
            <p className="p-text mt-3 font-semibold text-start">
              Keep your profile and location details accurate for every customer
              who discovers you.
            </p>
          </motion.div>

          <motion.div
            variants={springItem as Variants}
            className="hidden shrink-0 items-center gap-3 rounded-2xl border border-[#d9cdb5] bg-[#fffaf0]/75 p-3 shadow-sm sm:flex"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B11226] text-white">
              <Save className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#332a23]">Edit mode</p>
              <p className="text-xs text-[#806f5d]">
                Update two quick sections
              </p>
            </div>
          </motion.div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.section
            variants={springItem as Variants}
            className="rounded-[1.75rem] border border-[#d9cdb5] bg-[#fffaf0]/90 p-6 shadow-[0_18px_50px_rgba(91,61,24,0.07)] sm:p-8"
          >
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B11226]/10 text-[#B11226]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
                  Step 01
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-[#201b17]">
                  Business details
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#806f5d]">
                  Make your first impression count.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass} htmlFor="business-name">
                  Business name <span className="text-[#B11226]">*</span>
                </label>
                <input
                  id="business-name"
                  name="name"
                  value={formData.name}
                  onChange={handleBusinessChange}
                  className={fieldClass}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="business-category">
                  Business category <span className="text-[#B11226]">*</span>
                </label>
                <select
                  id="business-category"
                  name="category"
                  value={formData.category}
                  onChange={handleBusinessChange}
                  className={fieldClass}
                  required
                  disabled={loading}
                >
                  <option value="SALON">Salon / Barbershop</option>
                  <option value="CLINIC">Clinic / Doctor</option>
                  <option value="REPAIR">Mobile Repair</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="business-phone">
                  Business phone <span className="text-[#B11226]">*</span>
                </label>
                <input
                  id="business-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleBusinessChange}
                  className={fieldClass}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="business-description">
                  Description{" "}
                  <span className="font-normal text-[#9b9185]">(optional)</span>
                </label>
                <textarea
                  id="business-description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleBusinessChange}
                  className={`${fieldClass} resize-none`}
                  disabled={loading}
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={springItem as Variants}
            className="rounded-[1.75rem] border border-[#d9cdb5] bg-[#fffaf0]/90 p-6 shadow-[0_18px_50px_rgba(91,61,24,0.07)] sm:p-8"
          >
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B11226]/10 text-[#B11226]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
                  Step 02
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-[#201b17]">
                  Primary location
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#806f5d]">
                  Help customers find your main branch.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                { name: "branchName", label: "Branch name", id: "branch-name" },
                {
                  name: "addressLine",
                  label: "Complete address",
                  id: "address-line",
                  required: true,
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className={labelClass} htmlFor={field.id}>
                    {field.label}{" "}
                    {field.required && (
                      <span className="text-[#B11226]">*</span>
                    )}
                  </label>
                  <input
                    id={field.id}
                    name={field.name}
                    value={
                      formData.location[
                        field.name as keyof typeof formData.location
                      ]
                    }
                    onChange={handleLocationChange}
                    className={fieldClass}
                    required={field.required}
                    disabled={loading}
                  />
                </div>
              ))}

              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { name: "area", label: "Area" },
                  { name: "city", label: "City" },
                  { name: "state", label: "State" },
                  { name: "postalCode", label: "Postal code" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className={labelClass} htmlFor={field.name}>
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={
                        formData.location[
                          field.name as keyof typeof formData.location
                        ]
                      }
                      onChange={handleLocationChange}
                      className={fieldClass}
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className={labelClass} htmlFor="branch-phone">
                  Branch phone
                </label>
                <input
                  id="branch-phone"
                  type="tel"
                  name="phone"
                  value={formData.location.phone}
                  onChange={handleLocationChange}
                  className={fieldClass}
                  disabled={loading}
                />
              </div>
            </div>
          </motion.section>
        </div>

        {/* Opening Hours */}
        <motion.section
          variants={springItem as Variants}
          className="mt-6 rounded-[1.75rem] border border-[#d9cdb5] bg-[#fffaf0]/90 p-6 shadow-[0_18px_50px_rgba(91,61,24,0.07)] sm:p-8"
        >
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B11226]/10 text-[#B11226]">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226]">
                  Step 03
                </p>
                <h2 className="mt-1 text-xl font-black text-[#201b17]">
                  Opening hours
                </h2>
                <p className="mt-1 max-w-lg text-sm leading-6 text-[#806f5d]">
                  Tell customers when they can visit or contact you.
                </p>
              </div>
            </div>
            <span className="w-fit rounded-full border border-[#d9cdb5] bg-white/70 px-3 py-1.5 text-xs font-bold text-[#806f5d]">
              7 days
            </span>
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#d9cdb5] bg-[#eadfbe]/45 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#332a23]">Same schedule every day?</p>
              <p className="mt-0.5 text-xs text-[#806f5d]">
                Copy Monday&apos;s timing to the rest of the week.
              </p>
            </div>
            <button
              type="button"
              onClick={handleApplyToWeekdays}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B11226]/20 bg-[#fffaf0] px-4 py-2.5 text-sm font-bold text-[#B11226] transition hover:-translate-y-0.5 hover:border-[#B11226]/40 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              Copy Monday
            </button>
          </div>

          <div className="space-y-3">
            {formData.hours.map((hour) => (
              <div
                key={hour.dayOfWeek}
                className={`grid gap-4 rounded-2xl border p-4 transition sm:grid-cols-[minmax(7rem,0.8fr)_1fr_1fr_auto] sm:items-end ${
                  hour.isClosed
                    ? "border-[#d9cdb5] bg-[#eadfbe]/25"
                    : "border-[#d9cdb5] bg-white/60 hover:border-[#B11226]/25 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 sm:self-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B11226]/10 text-xs font-black text-[#B11226]">
                    {String(hour.dayOfWeek).padStart(2, "0")}
                  </span>
                  <p className="font-bold text-[#332a23]">
                    {weekDays[hour.dayOfWeek - 1]}
                  </p>
                </div>

                {[
                  { label: "Opens", field: "openTime" as const, value: hour.openTime ?? "" },
                  { label: "Closes", field: "closeTime" as const, value: hour.closeTime ?? "" },
                ].map(({ label, field, value }) => (
                  <label key={field} className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#806f5d]">
                      {label}
                    </span>
                    <input
                      type="time"
                      value={value}
                      disabled={hour.isClosed || loading}
                      onChange={(e) =>
                        handleHoursChange(hour.dayOfWeek, field, e.target.value)
                      }
                      className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-[#eadfbe]/40 disabled:text-[#9b9185]`}
                    />
                  </label>
                ))}

                <label className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border border-[#d9cdb5] bg-[#fffaf0] px-3 text-sm font-bold text-[#332a23] transition hover:border-[#B11226]/30 has-[:checked]:border-[#B11226]/30 has-[:checked]:bg-[#B11226]/5 has-[:checked]:text-[#B11226]">
                  <input
                    type="checkbox"
                    checked={hour.isClosed}
                    disabled={loading}
                    onChange={(e) =>
                      handleHoursChange(hour.dayOfWeek, "isClosed", e.target.checked)
                    }
                    className="h-4 w-4 accent-[#B11226]"
                  />
                  Closed
                </label>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.footer
          variants={springItem as Variants}
          className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold hover:-translate-y-0.5 duration-200 bg-[#F5EBD0] hover:bg-[#E8D9B5] text-sm text-[#201b17] shadow-lg shadow-gray-300/15 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#B11226] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B11226]/15 transition hover:-translate-y-0.5 hover:bg-[#8f0e1e] disabled:cursor-not-allowed disabled:opacity-60 "
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Save size={17} />
                Save changes
              </>
            )}
          </button>
        </motion.footer>
      </form>
    </motion.section>
  );
}
