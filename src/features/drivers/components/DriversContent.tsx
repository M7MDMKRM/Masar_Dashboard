"use client";

import React from "react";
import { useDriversData } from "../hooks/use-drivers-data";
import { StatCardsGrid } from "@/components/shared/StatCardsGrid";
import { DriversTable } from "./DriversTable";
import { DownloadReportButton } from "@/features/dashboard/components/DownloadReportButton";
import { Loader2 } from "lucide-react";

export function DriversContent() {
  const { data, isLoading, error } = useDriversData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#196A58]" />
        <span className="text-body font-semibold">جاري تحميل بيانات السائقين...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-body font-medium">
        حدث خطأ أثناء تحميل بيانات السائقين. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Header bar */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading">
            السائقون
          </h2>
          <p className="text-body text-gray-500">
            إدارة حسابات السائقين ومتابعة حالات التوثيق والنشاط.
          </p>
        </div>
        <DownloadReportButton />
      </div>

      {/* Driver Stat Cards (5 Cards Grid) */}
      <StatCardsGrid stats={data.stats} columns={5} />

      {/* Main Drivers Table & Controls */}
      <DriversTable drivers={data.drivers} pagination={data.pagination} />
    </div>
  );
}
