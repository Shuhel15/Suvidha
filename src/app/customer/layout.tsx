import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "Customer Dashboard",
};

// Authentication check
async function CustomerAuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.accountType !== "CUSTOMER") {
    redirect("/");
  }

  return <>{children}</>;
}

// Layout
export default function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <CustomerAuthGuard>{children}</CustomerAuthGuard>
    </Suspense>
  );
}