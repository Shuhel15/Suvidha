"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
export default function OwnerDashboardComp() {
  const { data: session } = useSession();
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <p className="eye">Role: Business Owner</p>
      <h1>
        Welcome, <span>{session?.user.name}</span>
      </h1>
            <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
      >
        Logout
      </button>
    </section>
  );
}
