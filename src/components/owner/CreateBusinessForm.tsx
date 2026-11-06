"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  MapPin,
} from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-[#d9cdb5] bg-[#fffdf8] px-4 py-3.5 text-sm text-[#201b17] shadow-[0_1px_2px_rgba(54,38,20,0.04)] outline-none transition placeholder:text-[#9b9185] hover:border-[#b8a78d] focus:border-[#B11226] focus:ring-4 focus:ring-[#B11226]/10";

const labelClass =
  "mb-2 block text-[13px] font-semibold tracking-wide text-[#332a23]";

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
    <section className="relative min-h-screen overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="relative mx-auto max-w-5xl">
        <header className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B11226]/15  px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] shadow-inner shadow-black/10 text-[#B11226]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B11226]" />
              Business registration
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-[-0.04em] text-[#201b17] sm:text-5xl">
              Give your business a place to be discovered.
            </h1>
            <p className="p-text mt-3">
              Set up your profile and first location. Customers will use these
              details to find and connect with you.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#d9cdb5] bg-[#fffaf0]/75 p-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B11226] text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#332a23]">Almost there</p>
              <p className="text-xs text-[#806f5d]">
                2 quick steps to get started
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[1.75rem] border border-[#d9cdb5] bg-[#fffaf0]/90 p-6 shadow-[0_18px_50px_rgba(91,61,24,0.07)] sm:p-8">
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
          </section>

          <section className="rounded-[1.75rem] border border-[#d9cdb5] bg-[#fffaf0]/90 p-6 shadow-[0_18px_50px_rgba(91,61,24,0.07)] sm:p-8">
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
          </section>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#d9cdb5] bg-[#eadfbe]/60 p-4 sm:flex-row sm:p-5">
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
        </div>
      </form>
    </section>
  );
}
