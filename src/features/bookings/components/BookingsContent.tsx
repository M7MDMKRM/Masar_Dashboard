"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useBookingsData } from "../hooks/use-bookings-data";
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

const dateFilterOptions = [
  { label: "هذا الشهر", value: "this_month" },
  { label: "اليوم", value: "today" },
  { label: "هذا الأسبوع", value: "this_week" },
  { label: "هذا العام", value: "this_year" },
  { label: "الكل", value: "all" },
];

export function BookingsContent() {
  const { data, isLoading, error } = useBookingsData();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("this_month");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDateLabel =
    dateFilterOptions.find((o) => o.value === selectedDate)?.label || "هذا الشهر";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#146C5B]" />
        <span className="text-sm font-semibold">جاري تحميل بيانات الحجوزات...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium">
        حدث خطأ أثناء تحميل بيانات الحجوزات. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  // Filter bookings based on search query and active tab
  const filteredBookings = data.bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.passengerName.includes(searchQuery) ||
      booking.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.route.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* 1. Header (Title & Subtitle on Right) */}
      <div className="flex flex-col text-right">
        <h1 className="text-2xl font-black text-gray-900 leading-tight">
          الحجوزات
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          متابعة حجوزات الركاب وحالاتها.
        </p>
      </div>

      {/* 2. Top 5 Stat Cards Grid (Right to Left: إجمالي الحجوزات -> القادمة -> قيد التنفيذ -> المكتملة -> الملغاة) */}
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

      {/* 3. Search Bar, Filter Tabs & Date Dropdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Right in RTL: Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الحجز أو اسم الراكب..."
            className="w-full bg-white border border-gray-200 text-xs font-medium rounded-xl py-2.5 pr-9 pl-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#146C5B] transition-colors text-right"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Left in RTL: Filter Tabs & Date Dropdown (Without stray sticker) */}
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

          {/* Date Dropdown */}
          <div className="relative" ref={dateRef}>
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              <span>{selectedDateLabel}</span>
            </button>

            {dateDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                {dateFilterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedDate(opt.value);
                      setDateDropdownOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedDate === opt.value
                        ? "bg-[#E2F1ED] text-[#146C5B] font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-[11px] font-bold">
                <th className="py-3.5 px-4 text-right">رقم الحجز</th>
                <th className="py-3.5 px-4 text-right">الراكب</th>
                <th className="py-3.5 px-4 text-right">المسار</th>
                <th className="py-3.5 px-4 text-right">تاريخ الحجز</th>
                <th className="py-3.5 px-4 text-center">رقم الرحلة</th>
                <th className="py-3.5 px-4 text-center">المقاعد</th>
                <th className="py-3.5 px-4 text-center">سعر المقعد</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-800">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-semibold">
                    لا توجد حجوزات مطابقة لمعايير البحث.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* رقم الحجز */}
                      <td className="py-4 px-4 text-right font-bold text-gray-800">
                        {booking.bookingNumber}
                      </td>

                      {/* الراكب */}
                      <td className="py-4 px-4 text-right font-bold text-gray-900">
                        {booking.passengerName}
                      </td>

                      {/* المسار */}
                      <td className="py-4 px-4 text-right font-bold text-gray-900">
                        {booking.route}
                      </td>

                      {/* تاريخ الحجز */}
                      <td className="py-4 px-4 text-right text-gray-700 font-medium">
                        {booking.bookingDate}
                      </td>

                      {/* رقم الرحلة */}
                      <td className="py-4 px-4 text-center font-bold text-gray-800">
                        {booking.tripNumber}
                      </td>

                      {/* المقاعد */}
                      <td className="py-4 px-4 text-center font-bold text-gray-800" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                        {booking.seatsRatio}
                      </td>

                      {/* سعر المقعد */}
                      <td className="py-4 px-4 text-center font-bold text-gray-900">
                        {booking.seatPrice}
                      </td>

                      {/* الحالة */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            booking.status === "in_progress"
                              ? "bg-[#FDEBD0] text-[#D67E10]"
                              : booking.status === "upcoming"
                              ? "bg-[#EBF5FB] text-[#2980B9]"
                              : booking.status === "completed"
                              ? "bg-[#E2F1ED] text-[#146C5B]"
                              : "bg-[#FADBD8] text-[#D9383A]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              booking.status === "in_progress"
                                ? "bg-[#D67E10]"
                                : booking.status === "upcoming"
                                ? "bg-[#2980B9]"
                                : booking.status === "completed"
                                ? "bg-[#146C5B]"
                                : "bg-[#D9383A]"
                            }`}
                          />
                          {booking.statusText}
                        </span>
                      </td>

                      {/* إجراء */}
                      <td className="py-4 px-4 text-center">
                        <Link href={`/bookings/${booking.id}`}>
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
              pageSize: 5,
            }}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
