import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getBusinessDetails } from "@/services/business.service";
import EditBusinessForm from "@/components/owner/EditBusinessForm";

type Props = {
  params: Promise<{
    businessId: string;
  }>;
};

async function EditBusinessData({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.accountType !== "BUSINESS_OWNER") {
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

  return <EditBusinessForm business={business} />;
}

export default function EditBusinessPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <EditBusinessData params={params} />
    </Suspense>
  );
}