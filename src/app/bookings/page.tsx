import { Metadata } from "next";
import { BookingsContent } from "@/features/bookings/components/BookingsContent";

export const metadata: Metadata = {
  title: "الحجوزات | مسار",
  description: "متابعة حجوزات الركاب وحالاتها على منصة مسار.",
};

export default function BookingsPage() {
  return <BookingsContent />;
}
