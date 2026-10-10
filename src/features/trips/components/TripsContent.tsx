"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { useTripsData } from "../hooks/use-trips-data";
import { PaginationControls } from "@/components/shared/PaginationControls";

type FilterTab = "all" | "in_progress" | "upcoming" | "completed" | "cancelled";

interface FilterOption {
  id: FilterTab;
  label: string;
}

const filterOptions: FilterOption[] = [
  { id: "all", label: "الكل" },
  { id: "in_progress", label: "قيد التنفيذ" },
  { id: "upcoming", label: "قادمة" },
  { id: "completed", label: "المكتملة" },
  { id: "cancelled", label: "الملغاة" },
];

export function TripsContent() {
  const { data, isLoading, error } = useTripsData();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#146C5B]" />
        <span className="text-sm font-semibold">جاري تحميل بيانات الرحلات...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium">
        حدث خطأ أثناء تحميل بيانات الرحلات. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  // Filter trips based on search query and active tab
  const filteredTrips = data.trips.filter((trip) => {
    const matchesSearch =
      trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.includes(searchQuery) ||
      trip.route.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    return trip.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header (Title & Subtitle on Right) */}
      <div className="flex flex-col text-right">
        <h1 className="text-2xl font-black text-gray-900 leading-tight">
          الرحلات
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          متابعة جميع الرحلات المنشورة وحالاتها الحالية.
        </p>
      </div>

      {/* 2. Top 5 Stat Cards Grid (Right to Left: إجمالي الرحلات -> القادمة -> قيد التنفيذ -> المكتملة -> الملغاة) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[135px] hover:shadow-xs transition-shadow"
          >
            {/* Top Row: Title on Right, Percentage Badge on Left */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-gray-800">{stat.title}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.badgeColorClass}`}
              >
                {stat.percentageBadge}
              </span>
            </div>

            {/* Middle: Big Value */}
            <div className="text-2xl font-black text-gray-900 tracking-tight my-1 text-right">
              {stat.value}
            </div>

            {/* Bottom: Description */}
            <div className="text-[11px] text-gray-400 font-medium text-right leading-tight">
              {stat.description}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search Bar & Filter Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Right in RTL: Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الرحلة أو اسم السائق..."
            className="w-full bg-white border border-gray-200 text-xs font-medium rounded-xl py-2.5 pr-9 pl-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#146C5B] transition-colors text-right"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Left in RTL: Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {filterOptions.map((opt) => {
            const isActive = activeTab === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveTab(opt.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#146C5B] text-white shadow-xs"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Trips Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-[11px] font-bold">
                <th className="py-3.5 px-4 text-right">رقم الرحلة</th>
                <th className="py-3.5 px-4 text-right">السائق</th>
                <th className="py-3.5 px-4 text-right">المسار</th>
                <th className="py-3.5 px-4 text-right">التاريخ المطلوب</th>
                <th className="py-3.5 px-4 text-center">نوع الرحلة</th>
                <th className="py-3.5 px-4 text-center">المقاعد</th>
                <th className="py-3.5 px-4 text-center">سعر المقعد</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-800">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-semibold">
                    لا توجد رحلات مطابقة لمعايير البحث.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* رقم الرحلة */}
                      <td className="py-4 px-4 text-right font-bold text-gray-800">
                        {trip.tripNumber}
                      </td>

                      {/* السائق */}
                      <td className="py-4 px-4 text-right font-bold text-gray-900">
                        {trip.driverName}
                      </td>

                      {/* المسار */}
                      <td className="py-4 px-4 text-right font-bold text-gray-900">
                        {trip.route}
                      </td>

                      {/* التاريخ المطلوب */}
                      <td className="py-4 px-4 text-right text-gray-700 font-medium">
                        {trip.requestedDate}
                      </td>

                      {/* نوع الرحلة */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-xl text-[11px] font-bold ${
                            trip.tripType === "recurring"
                              ? "bg-[#FDEBD0] text-[#D67E10]"
                              : "bg-[#EBF5FB] text-[#2980B9]"
                          }`}
                        >
                          {trip.tripType === "recurring" ? "متكررة" : "فردية"}
                        </span>
                      </td>

                      {/* المقاعد */}
                      <td className="py-4 px-4 text-center font-bold text-gray-800" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                        {trip.seatsRatio}
                      </td>

                      {/* سعر المقعد */}
                      <td className="py-4 px-4 text-center font-bold text-gray-900">
                        {trip.seatPrice}
                      </td>

                      {/* الحالة */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            trip.status === "in_progress"
                              ? "bg-[#FDEBD0] text-[#D67E10]"
                              : trip.status === "upcoming"
                              ? "bg-[#EBF5FB] text-[#2980B9]"
                              : trip.status === "completed"
                              ? "bg-[#E2F1ED] text-[#146C5B]"
                              : "bg-[#FADBD8] text-[#D9383A]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              trip.status === "in_progress"
                                ? "bg-[#D67E10]"
                                : trip.status === "upcoming"
                                ? "bg-[#2980B9]"
                                : trip.status === "completed"
                                ? "bg-[#146C5B]"
                                : "bg-[#D9383A]"
                            }`}
                          />
                          {trip.statusText}
                        </span>
                      </td>

                      {/* إجراء */}
                      <td className="py-4 px-4 text-center">
                        <Link href={`/trips/${trip.id}`}>
                          <button className="border border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED]/50 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                            عرض التفاصيل
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination */}
        <div className="p-4 border-t border-gray-100">
          <PaginationControls
            meta={{
              currentPage: currentPage,
              totalPages: 50,
              totalResults: 1284,
              pageSize: 8,
            }}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
