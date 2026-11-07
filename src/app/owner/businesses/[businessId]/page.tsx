import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getBusinessDetails } from "@/services/business.service";
import BusinessDetails from "@/components/owner/BusinessDetails";
import toast from "react-hot-toast";

type Props = {
  params: Promise<{
    businessId: string;
  }>;
};

async function BusinessDetailsData({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.accountType !== "BUSINESS_OWNER") {
    toast.error("You are not authorized to access this page.");
    redirect("/");
  }

  const { businessId } = await params;

  const business = await getBusinessDetails(
    businessId,
    session.user.id
  );

  if (!business) {
    notFound();
  }

  return <BusinessDetails business={business} />;
}

export default function BusinessDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <BusinessDetailsData params={params} />
    </Suspense>
  );
}