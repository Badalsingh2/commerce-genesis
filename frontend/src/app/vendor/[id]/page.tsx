import VendorDashboard from "@/app/vendor/page";
import { vendors } from "@/data/vendor";
import { notFound } from "next/navigation";

interface VendorPageProps {
  params: { id: string };
}

export default function VendorPage({ params }: VendorPageProps) {
  const vendor = vendors.find((v) => v.id === params.id);

  if (!vendor) {
    return notFound();
  }

  return <VendorDashboard vendor={vendor} />;
}
