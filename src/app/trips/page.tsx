import { Metadata } from "next";
import { TripsContent } from "@/features/trips/components/TripsContent";

export const metadata: Metadata = {
  title: "الرحلات | مسار",
  description: "متابعة جميع الرحلات المنشورة وحالاتها الحالية في منصة مسار.",
};

export default function TripsPage() {
  return <TripsContent />;
}
