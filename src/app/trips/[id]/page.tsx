import { Metadata } from "next";
import { TripDetailsContent } from "@/features/trips/components/TripDetailsContent";

export const metadata: Metadata = {
  title: "تفاصيل الرحلة | مسار",
  description: "عرض ومتابعة جميع تفاصيل الرحلة وحالتها والحجوزات المرتبطة بها.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TripDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <TripDetailsContent id={id} />;
}
