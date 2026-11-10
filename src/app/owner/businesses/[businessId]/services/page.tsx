
import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getBusinessDetails } from "@/services/business.service";
import Spinner from "@/components/layout/Spineer";
import { getBusinessServices } from "@/services/service.service";
import ServicesClient from "@/components/owner/ServicesClient";
type Props = {
  params: Promise<{
    businessId: string;
  }>;
};

async function ServicesPageData({ params }: Props) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (session.user.accountType !== "BUSINESS_OWNER") {
    redirect("/");
  }

  const { businessId } = await params;

  const business = await getBusinessDetails(
    businessId,
    session.user.id
  );

const services = await getBusinessServices(
  businessId,
  session.user.id
);

  if (!business) notFound();

return (
  <div className="mt-25">
    <ServicesClient
      businessId={businessId}
      services={services}
    />
  </div>
);
}

export default function ServicesPage({ params }: Props) {
  return (
    <Suspense fallback={<Spinner/>}>
      <ServicesPageData params={params} />
    </Suspense>
  );
}
