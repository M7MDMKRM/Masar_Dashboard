import React from "react";
import { PassengersContent } from "@/features/passengers/components/PassengersContent";

export const metadata = {
  title: "الركاب | لوحة تحكم مسار",
  description: "إدارة حسابات الركاب ومتابعة الحجوزات وحالة الحساب والنشاط.",
};

export default function PassengersPage() {
  return <PassengersContent />;
}
