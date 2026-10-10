import React from "react";
import { PassengerDetailsContent } from "@/features/passengers/components/PassengerDetailsContent";

interface PassengerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "تفاصيل الراكب | لوحة تحكم مسار",
  description: "عرض شامل لبيانات الراكب والنشاط والحجوزات وسجل الحساب على منصة مسار.",
};

export default async function PassengerDetailsPage({ params }: PassengerDetailsPageProps) {
  const { id } = await params;
  return <PassengerDetailsContent id={id} />;
}
