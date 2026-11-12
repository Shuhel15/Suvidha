import ServicesComp from "@/components/owner/services/Services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:"Our Services",
  description:
    "Services offered by Suvidha. Explore our range of trusted local services, book appointments, and manage your service requests efficiently.",

    alternates: {
      canonical: "/services",
    },
  robots:{
    index: true,
    follow: true,
  }
}

export default async function services() {

  return (
    <>
    <ServicesComp/>
    </>
  
)
}
