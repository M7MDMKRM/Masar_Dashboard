import { DriverDetailsContent } from "@/features/drivers/components/DriverDetailsContent";

export const metadata = {
  title: "تفاصيل السائق | مسار للرحلات والنقل",
  description: "عرض تفاصيل حساب السائق وحالة التوثيق في لوحة تحكم مسار",
};

interface DriverDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DriverDetailsPage({ params }: DriverDetailsPageProps) {
  const { id } = await params;
  return <DriverDetailsContent id={id} />;
}
