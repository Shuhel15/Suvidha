"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
export default function DashboardPage() {
  return(
<main className="flex min-h-screen flex-col items-center justify-center gap-4">
<button
  onClick={() => signOut({ callbackUrl: "/" })}
  className="flex items-center gap-2 rounded-lg bg-[#B11226] px-3 py-2 font-semibold text-white transition-all hover:bg-[#eddcae] hover:text-[#B11226]"
>
  <LogOut className="h-4 w-4" />
  Logout
</button>
</main>
  )
}