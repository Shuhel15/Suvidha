"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  Loader2,
  MapPin,
} from "lucide-react";
import { staggerContainer, springItem } from "../layout/animation";
import { motion, type Variants } from "framer-motion";

const fieldClass =
  "w-full rounded-xl border border-[#d9cdb5] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#201b17] shadow-[0_1px_2px_rgba(54,38,20,0.04)] outline-none transition placeholder:text-[#9b9185] hover:border-[#b8a78d] focus:border-[#B11226] focus:ring-4 focus:ring-[#B11226]/10";

const labelClass =
  "mb-2 block text-[13px] font-semibold tracking-wide text-[#332a23]";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function CreateBusinessForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    phone: "",
    location: {
      branchName: "",
      addressLine: "",
      area: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
    },
    hours: weekDays.map((_, index) => ({
      dayOfWeek: index + 1,
      openTime: "10:00",
      closeTime: "19:00",
      isClosed: false,
    })),
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      const response = await fetch("/api/owner/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors?.length) {
          toast.error(result.errors[0].message);
        } else {
          toast.error(result.error || "Something went wrong");
        }

        return;
      }

      toast.success("Business created successfully");
      router.push("/owner/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("An error occurred while creating your business");
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
      className="relative min-h-screen overflow-hidden  pb-20 pt-28  lg:px-8"
    >
      <form onSubmit={handleSubmit} className="relative mx-auto max-w-5xl">
        <header className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.div
              variants={springItem as Variants}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B11226]/15  px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] shadow-inner shadow-black/10 text-[#B11226]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B11226] animate-pulse" />
              Business registration
            </motion.div>

            <motion.h1
              variants={springItem as Variants}
              className="max-w-2xl text-4xl font-black tracking-[-0.04em] text-[#201b17] sm:text-5xl"
            >
              Give your business a place to be{" "}
              <span className="text-[#B11226]">discovered.</span>
            </motion.h1>
            <motion.p
              variants={springItem as Variants}
              className="p-text font-semibold mt-3 text-start"
            >
              Set up your profile and first location. Customers will use these
              details to find and connect with you.
            </motion.p>
          </div>

          <motion.div
            variants={springItem as Variants}
            className="flex items-center gap-3 rounded-2xl border border-[#d9cdb5] bg-[#fffaf0]/75 p-3 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B11226] text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#332a23]">Almost there</p>
              <p className="text-xs text-[#806f5d]">
                2 quick steps to get started
              </p>
            </div>
          </motion.div>
        </header>

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
                  Tell customers what makes you different.
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
                  placeholder="e.g. Royal Hair Salon"
                  className={fieldClass}
                  required
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
                >
                  <option value="">Select category</option>
                  <option value="SALON">Salon / Barbershop</option>
                  <option value="CLINIC">Clinic / Doctor</option>
                  <option value="REPAIR">Repair Shop</option>
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
                  placeholder="Enter business phone number"
                  className={fieldClass}
                  required
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
                  value={formData.description}
                  onChange={handleBusinessChange}
                  placeholder="Tell customers about your business..."
                  rows={4}
                  className={`${fieldClass} resize-none`}
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
                  First location
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#806f5d]">
                  Make it easy for customers to reach you.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass} htmlFor="branch-name">
                  Branch name{" "}
                  <span className="font-normal text-[#9b9185]">(optional)</span>
                </label>
                <input
                  id="branch-name"
                  name="branchName"
                  value={formData.location.branchName}
                  onChange={handleLocationChange}
                  placeholder="e.g. Main Branch"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="address-line">
                  Complete address <span className="text-[#B11226]">*</span>
                </label>
                <input
                  id="address-line"
                  name="addressLine"
                  value={formData.location.addressLine}
                  onChange={handleLocationChange}
                  placeholder="House no., street, landmark..."
                  className={fieldClass}
                  required
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="area">
                    Area{" "}
                    <span className="font-normal text-[#9b9185]">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="area"
                    name="area"
                    value={formData.location.area}
                    onChange={handleLocationChange}
                    placeholder="Enter area"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="city">
                    City <span className="text-[#B11226]">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                    placeholder="Enter city"
                    className={fieldClass}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="state">
                    State <span className="text-[#B11226]">*</span>
                  </label>
                  <input
                    id="state"
                    name="state"
                    value={formData.location.state}
                    onChange={handleLocationChange}
                    placeholder="Enter state"
                    className={fieldClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="postal-code">
                    Postal code <span className="text-[#B11226]">*</span>
                  </label>
                  <input
                    id="postal-code"
                    name="postalCode"
                    value={formData.location.postalCode}
                    onChange={handleLocationChange}
                    placeholder="Enter PIN code"
                    className={fieldClass}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="branch-phone">
                  Branch phone{" "}
                  <span className="font-normal text-[#9b9185]">(optional)</span>
                </label>
                <input
                  id="branch-phone"
                  type="tel"
                  name="phone"
                  value={formData.location.phone}
                  onChange={handleLocationChange}
                  placeholder="Enter branch contact number"
                  className={fieldClass}
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
                  { label: "Opens", field: "openTime" as const, value: hour.openTime },
                  { label: "Closes", field: "closeTime" as const, value: hour.closeTime },
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

                <label className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border border-[#d9cdb5] bg-[#fffaf0] px-3 text-sm font-bold text-[#332a23] transition hover:border-[#B11226]/30 has-checked:border-[#B11226]/30 has-checked:bg-[#B11226]/5 has-checked:text-[#B11226]">
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

        <motion.div
          variants={springItem as Variants}
          className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#d9cdb5] bg-[#eadfbe]/60 p-4 sm:flex-row sm:p-5"
        >
          <p className="text-center text-xs leading-5 text-[#806f5d] sm:text-left">
            You can add more branches and update these details later.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#B11226] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(177,18,38,0.2)] transition hover:-translate-y-0.5 hover:bg-[#8f0e1e] hover:shadow-[0_12px_24px_rgba(177,18,38,0.25)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Registering...
              </>
            ) : (
              <>
                Register business{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.section>
  );
}
