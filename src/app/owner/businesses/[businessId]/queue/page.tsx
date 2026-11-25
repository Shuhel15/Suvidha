import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getBusinessDetails } from "@/services/business.service";
import Spinner from "@/components/layout/Spineer";
import QueueManagement from "@/components/owner/QueueManagement";
import Link from "next/link";
import { Store } from "lucide-react";

type Props = {
  params: Promise<{
    businessId: string;
  }>;
};

async function QueuePageData({ params }: Props) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.accountType !== "BUSINESS_OWNER") redirect("/");
  const { businessId } = await params;
  const business = await getBusinessDetails(businessId, session.user.id);
  if (!business) notFound();
  if (business.category !== "SALON") notFound();

  return (
    <main className="mt-25 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-black/5 bg-white/50 p-5 shadow-[0_20px_60px_rgba(80,45,20,0.07)] backdrop-blur-sm sm:p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B11226]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B11226] shadow-inner shadow-black/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B11226]" />
            Live salon operations
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#B11226] [text-shadow:0_2px_4px_rgba(177,18,38,0.08),0_6px_18px_rgba(177,18,38,0.1)] sm:text-5xl">
            Customer <span className="text-gray-900">queue</span>
          </h1>
          <p className="mt-4 max-w-2xl font-custom text-base font-semibold leading-7 text-black/50 sm:text-lg">
            Keep appointments moving at{" "}
            <span className="text-[#B11226]">{business.name}</span>. View
            today&apos;s customers and update each visit as it happens.
          </p>
        </header>
        {business.services.length > 0 ? (
          <QueueManagement businessId={business.id} />
        ) : (
          <section className="mt-8 rounded-3xl border border-dashed border-[#B11226]/25 bg-white/70 px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5EBD0] text-[#B11226]">
              <Store size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              No services listed yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Add services to your salon before managing customer queues. Your
              customers will be able to book queue tokens once services are
              available.
            </p>

            <Link
              href={`/owner/businesses/${business.id}/services`}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#B11226] px-6 py-3 font-semibold text-white shadow-lg shadow-[#B11226]/15 transition hover:-translate-y-0.5 hover:bg-[#8f0e1e]"
            >
              Add Services
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

export default function QueuePage({ params }: Props) {
  return (
    <Suspense fallback={<Spinner />}>
      <QueuePageData params={params} />
    </Suspense>
  );
}
