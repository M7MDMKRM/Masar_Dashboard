import { Metadata } from "next";
import { BookingDetailsContent } from "@/features/bookings/components/BookingDetailsContent";

export const metadata: Metadata = {
  title: "تفاصيل الحجز | مسار",
  description: "عرض جميع بيانات الحجز والراكب والرحلة المرتبطة به وإدارة حالة الحجز.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <BookingDetailsContent id={id} />;
}
