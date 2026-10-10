"use client";

import React from "react";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { StatCard } from "@/components/shared/StatCardsGrid";
import { FeaturedTripCard } from "./FeaturedTripCard";
import { ActiveTripsTable } from "./ActiveTripsTable";
import { VerificationRequestsCard } from "./VerificationRequestsCard";
import { PopularRoutesCard } from "./PopularRoutesCard";
import { RecentComplaintsCard } from "./RecentComplaintsCard";
import { DownloadReportButton } from "./DownloadReportButton";
import { Loader2 } from "lucide-react";

export function DashboardContent() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E7562]" />
        <span className="text-body font-semibold">جاري تحميل بيانات لوحة التحكم...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-body font-medium">
        حدث خطأ أثناء تحميل البيانات. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  const stats = data.stats;

  return (
    <div className="flex flex-col gap-5">
      {/* Action Header bar: Page title & Download Report button */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading">
            الرئيسية
          </h2>
          <p className="text-body text-gray-500">
            نظرة عامة على نشاط منصة مسار وأهم العمليات التي تحتاج إلى المتابعة.
          </p>
        </div>
        <DownloadReportButton />
      </div>

      {/* Grid Layout matching exact 2-row arrangement with Dark Green Card on Bottom-Left */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Top Row: 4 Stat Cards */}
        {stats.slice(0, 4).map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}

        {/* Bottom Row: 3 Stat Cards + 1 Dark Green Featured Trip Card */}
        {stats.slice(4, 7).map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
        <FeaturedTripCard summary={data.featuredTrip} />
      </div>

      {/* Active Trips Table */}
      <ActiveTripsTable
        trips={data.activeTrips}
        pagination={data.activeTripsPagination}
      />

      {/* Middle Row: Verification Requests (Right in RTL) + Popular Routes (Left in RTL) */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        <VerificationRequestsCard
          requests={data.verificationRequests}
          pagination={data.verificationPagination}
        />
        <PopularRoutesCard routes={data.popularRoutes} />
      </div>

      {/* Bottom Row: Recent Complaints Table */}
      <RecentComplaintsCard
        complaints={data.recentComplaints}
        pagination={data.complaintsPagination}
      />
    </div>
  );
}
