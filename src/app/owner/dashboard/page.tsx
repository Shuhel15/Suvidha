import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getOwnerBusinesses } from "@/services/business.service";
import OwnerDashboardComp from "@/components/owner/Dashboard";

async function MyBusinessesData() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.accountType !== "BUSINESS_OWNER") {
    redirect("/");
  }

  const businesses = await getOwnerBusinesses(session.user.id);

  return <OwnerDashboardComp businesses={businesses} />;
}

export default function MyBusinessesPage() {
  return (
    <Suspense fallback={null}>
      <MyBusinessesData />
    </Suspense>
  );
}
