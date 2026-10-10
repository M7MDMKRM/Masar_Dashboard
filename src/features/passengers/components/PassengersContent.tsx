"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { usePassengersData } from "../hooks/use-passengers-data";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/shared/PaginationControls";

const statusFilterOptions = [
  { label: "حالة الحساب", value: "all" },
  { label: "نشط", value: "active" },
  { label: "لديهم مخالفات", value: "violations" },
  { label: "موقوف مؤقتاً", value: "suspended_temp" },
  { label: "موقوف", value: "suspended" },
];

const dateFilterOptions = [
  { label: "تاريخ التسجيل", value: "all" },
  { label: "اليوم", value: "today" },
  { label: "هذا الأسبوع", value: "this_week" },
  { label: "هذا الشهر", value: "this_month" },
  { label: "هذا العام", value: "this_year" },
];

export function PassengersContent() {
  const { data, isLoading, error } = usePassengersData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedStatusLabel =
    statusFilterOptions.find((o) => o.value === selectedStatus)?.label || "حالة الحساب";
  const selectedDateLabel =
    dateFilterOptions.find((o) => o.value === selectedDate)?.label || "تاريخ التسجيل";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F5D4C]" />
        <span className="text-body font-semibold">جاري تحميل بيانات الركاب...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-body font-medium">
        حدث خطأ أثناء تحميل بيانات الركاب. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Row (Title & Subtitle on Right, Download Report on Left) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right in RTL: Title & Subtitle */}
        <div className="flex flex-col text-right">
          <h1 className="text-heading text-2xl font-black text-gray-900 leading-tight">
            الركاب
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            إدارة حسابات الركاب ومتابعة الحجوزات وحالة الحساب والنشاط.
          </p>
        </div>

        {/* Left in RTL: Download Report Button (Outline) */}
        <div className="flex items-center">
          <Button
            variant="actionOutline"
            size="default"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl gap-2 px-4 py-2 text-xs font-bold"
          >
            <span>تحميل التقرير</span>
            <Download className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* 2. Top 5 Stat Cards Grid (Right to Left: إجمالي الركاب -> نشط -> لديهم مخالفات -> موقوف مؤقتاً -> موقوف) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.stats.map((stat) => {
          const isIncrease = stat.changeType === "increase";
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-xs transition-shadow"
            >
              {/* Top Row: Title on Right, Percentage Badge on Left */}
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-900">{stat.title}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                    isIncrease
                      ? "text-[#146C5B] bg-[#E2F1ED]"
                      : "text-[#D9383A] bg-[#FADBD8]"
                  }`}
                  dir="ltr"
                >
                  <span>{isIncrease ? `+${stat.changePercentage}%` : `-${stat.changePercentage}%`}</span>
                  <span>{isIncrease ? "↗" : "↘"}</span>
                </span>
              </div>

              {/* Middle Row: Large Stat Value */}
              <div
                className="text-2xl font-black text-gray-900 font-mono text-start my-2"
                dir="ltr"
                style={{ unicodeBidi: "isolate" }}
              >
                {stat.value}
              </div>

              {/* Bottom Row: Description */}
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed text-right line-clamp-2">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Right in RTL: Search Input */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="ابحث باسم الراكب أو رقم الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-right px-4 py-2.5 pr-10 rounded-2xl border border-gray-200 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#146C5B] focus:ring-1 focus:ring-[#146C5B] bg-[#F8F9FA]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Left in RTL: Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center justify-between gap-2.5 bg-[#F8F9FA] border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-2xl min-w-[130px] transition-all cursor-pointer"
            >
              <span>{selectedStatusLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  statusDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {statusDropdownOpen && (
              <div className="absolute right-0 left-0 top-full mt-1 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden flex flex-col">
                {statusFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(option.value);
                      setStatusDropdownOpen(false);
                    }}
                    className={`w-full text-right px-4 py-2 text-xs font-bold transition-colors hover:bg-gray-50 ${
                      selectedStatus === option.value
                        ? "text-[#146C5B] bg-[#E2F1ED]/50"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Dropdown */}
          <div className="relative" ref={dateRef}>
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center justify-between gap-2.5 bg-[#F8F9FA] border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-2xl min-w-[130px] transition-all cursor-pointer"
            >
              <span>{selectedDateLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  dateDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dateDropdownOpen && (
              <div className="absolute right-0 left-0 top-full mt-1 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden flex flex-col">
                {dateFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedDate(option.value);
                      setDateDropdownOpen(false);
                    }}
                    className={`w-full text-right px-4 py-2 text-xs font-bold transition-colors hover:bg-gray-50 ${
                      selectedDate === option.value
                        ? "text-[#146C5B] bg-[#E2F1ED]/50"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Passengers Table */}
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#F8F9FA] text-gray-500 text-xs font-bold">
                <th className="py-3.5 px-4 rounded-r-xl">الراكب</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4">تاريخ التسجيل</th>
                <th className="py-3.5 px-4 text-center">الحجوزات المكتملة</th>
                <th className="py-3.5 px-4 text-center">الحجوزات الملغاة</th>
                <th className="py-3.5 px-4 text-center">الشكاوى ضده</th>
                <th className="py-3.5 px-4 text-center">حالة الحساب</th>
                <th className="py-3.5 px-4 text-center rounded-l-xl">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {data.passengers
                .filter((passenger) => {
                  const matchesSearch =
                    passenger.name.includes(searchQuery) ||
                    passenger.phone.includes(searchQuery);
                  const matchesStatus =
                    selectedStatus === "all"
                      ? true
                      : passenger.status === selectedStatus;
                  return matchesSearch && matchesStatus;
                })
                .map((passenger, index) => {
                  const isEven = index % 2 === 1;
                  return (
                    <tr
                      key={passenger.id}
                      className={`${
                        isEven ? "bg-table-row-alt" : "bg-white"
                      } hover:!bg-[#E8F5E9]/60 transition-colors`}
                    >
                      {/* اسم الراكب */}
                      <td className="py-4 px-4 font-bold text-gray-900">
                        {passenger.name}
                      </td>

                      {/* رقم الهاتف */}
                      <td
                        className="py-4 px-4 font-mono font-semibold text-gray-700"
                        dir="ltr"
                        style={{ unicodeBidi: "isolate" }}
                      >
                        {passenger.phone}
                      </td>

                      {/* تاريخ التسجيل */}
                      <td className="py-4 px-4 text-gray-500 font-medium">
                        {passenger.registrationDate}
                      </td>

                      {/* الحجوزات المكتملة */}
                      <td
                        className="py-4 px-4 text-center font-mono font-bold text-gray-800"
                        dir="ltr"
                        style={{ unicodeBidi: "isolate" }}
                      >
                        {passenger.completedBookings}
                      </td>

                      {/* الحجوزات الملغاة */}
                      <td
                        className="py-4 px-4 text-center font-mono font-bold text-gray-800"
                        dir="ltr"
                        style={{ unicodeBidi: "isolate" }}
                      >
                        {passenger.cancelledBookings}
                      </td>

                      {/* الشكاوى ضده */}
                      <td
                        className="py-4 px-4 text-center font-mono font-bold text-gray-800"
                        dir="ltr"
                        style={{ unicodeBidi: "isolate" }}
                      >
                        {passenger.complaintsCount}
                      </td>

                      {/* حالة الحساب */}
                      <td className="py-4 px-4 text-center">
                        {passenger.status === "active" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-[11px] font-bold bg-[#E2F1ED] text-[#146C5B]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#146C5B]" />
                            <span>{passenger.statusText}</span>
                          </span>
                        )}
                        {passenger.status === "suspended_temp" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-[11px] font-bold bg-[#FDEBD0] text-[#D67E10]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D67E10]" />
                            <span>{passenger.statusText}</span>
                          </span>
                        )}
                        {passenger.status === "suspended" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-[11px] font-bold bg-[#FADBD8] text-[#D9383A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                            <span>{passenger.statusText}</span>
                          </span>
                        )}
                      </td>

                      {/* إجراء (زر عرض التفاصيل) */}
                      <td className="py-4 px-4 text-center">
                        <Link href={`/passengers/${passenger.id}`}>
                          <Button
                            variant="actionOutline"
                            size="sm"
                            className="h-7 px-3.5 cursor-pointer"
                          >
                            عرض التفاصيل
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Controls */}
        <div className="p-4 border-t border-gray-100">
          <PaginationControls meta={data.pagination} />
        </div>
      </div>
    </div>
  );
}
