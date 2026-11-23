import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPublicBusinessDetails } from "@/services/business.service";
import BusinessDetails from "@/components/business/BusinessDetails";

type BusinessDetailsPageProps = {
  params: Promise<{
    businessId: string;
  }>;
};

async function BusinessDetailsContent({ params }: BusinessDetailsPageProps) {
  const { businessId } = await params;

  const business = await getPublicBusinessDetails(businessId);

  if (!business) {
    notFound();
  }

  return <BusinessDetails business={business} />;
}

export default function BusinessDetailsPage({
  params,
}: BusinessDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pb-20 pt-28 sm:pt-32">
          <div className="mx-auto max-w-6xl animate-pulse">
            <div className="h-10 w-44 rounded-full bg-black/8" />

            <div className="mt-6 overflow-hidden rounded-4xl border border-black/[0.07] bg-white/70 shadow-[0_18px_55px_rgba(84,46,16,0.06)]">
              <div className="grid lg:grid-cols-[1fr_340px]">
                <div className="p-6 sm:p-9 lg:p-11">
                  <div className="h-7 w-28 rounded-full bg-[#B11226]/10" />
                  <div className="mt-6 h-12 w-4/5 max-w-md rounded-xl bg-black/8" />
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-full max-w-xl rounded-full bg-black/6" />
                    <div className="h-4 w-3/4 max-w-lg rounded-full bg-black/6" />
                  </div>
                  <div className="mt-7 flex items-start gap-3 border-t border-black/[0.07] pt-6">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#F5EBD0]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 rounded-full bg-black/6" />
                      <div className="h-4 w-full max-w-sm rounded-full bg-black/8" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/[0.07] bg-[#B11226]/90 p-6 lg:border-l lg:border-t-0 lg:p-8">
                  <div className="h-11 w-11 rounded-2xl bg-white/15" />
                  <div className="mt-5 h-3 w-24 rounded-full bg-white/20" />
                  <div className="mt-3 h-7 w-40 rounded-lg bg-white/20" />
                  <div className="mt-6 h-12 w-full rounded-xl bg-white/25" />
                </div>
              </div>
            </div>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div>
                <div className="mb-5">
                  <div className="h-3 w-28 rounded-full bg-[#B11226]/15" />
                  <div className="mt-3 h-8 w-48 rounded-lg bg-black/8" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[0, 1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-black/[0.07] bg-white/70 p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="h-9 w-9 rounded-xl bg-[#F5EBD0]" />
                        <div className="h-6 w-16 rounded-lg bg-[#B11226]/10" />
                      </div>
                      <div className="mt-5 h-5 w-2/3 rounded-lg bg-black/8" />
                      <div className="mt-4 border-t border-black/6 pt-4">
                        <div className="h-4 w-28 rounded-full bg-black/6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-4xl border border-black/[0.07] bg-white/70 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#F5EBD0]" />
                  <div className="space-y-2">
                    <div className="h-5 w-32 rounded-lg bg-black/8" />
                    <div className="h-3 w-24 rounded-full bg-black/5" />
                  </div>
                </div>
                <div className="mt-5 divide-y divide-black/6">
                  {[0, 1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between py-3.5"
                    >
                      <div className="h-4 w-20 rounded-full bg-black/[0.07]" />
                      <div className="h-4 w-28 rounded-full bg-black/6" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <BusinessDetailsContent params={params} />
    </Suspense>
  );
}
