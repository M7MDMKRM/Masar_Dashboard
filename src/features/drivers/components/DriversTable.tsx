"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Search, Star } from "lucide-react";
import Link from "next/link";
import { DriverRowItem, DriversPaginationMeta } from "../types/drivers-types";
import { useDriversStore } from "../store/use-drivers-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/shared/PaginationControls";

interface DriversTableProps {
  drivers: DriverRowItem[];
  pagination: DriversPaginationMeta;
}

const statusOptions = [
  { label: "حالة الحساب", value: "all" },
  { label: "نشط", value: "active" },
  { label: "موقوف مؤقتاً", value: "suspended_temp" },
  { label: "موقوف", value: "suspended" },
];

const dateOptions = [
  { label: "تاريخ التسجيل", value: "all" },
  { label: "أي وقت", value: "anytime" },
  { label: "اليوم", value: "today" },
  { label: "هذا الأسبوع", value: "this_week" },
  { label: "هذا الشهر", value: "this_month" },
  { label: "هذا العام", value: "this_year" },
];

export function DriversTable({ drivers, pagination }: DriversTableProps) {
  const {
    accountStatusFilter,
    setAccountStatusFilter,
    registrationDateFilter,
    setRegistrationDateFilter,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
  } = useDriversStore();

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

  const currentMeta = {
    ...pagination,
    currentPage,
  };

  const selectedStatusLabel =
    statusOptions.find((o) => o.value === accountStatusFilter)?.label || "حالة الحساب";
  const selectedDateLabel =
    dateOptions.find((o) => o.value === registrationDateFilter)?.label || "تاريخ التسجيل";

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col gap-5">
      {/* Top Controls Row: Search Input on Left, Custom Dropdowns on Right */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input Box */}
        <div className="w-full sm:w-96 relative order-2 sm:order-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث بالاسم أو رقم الهاتف..."
            className="w-full bg-white border border-gray-200/80 rounded-2xl pr-4 pl-10 py-2.5 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F5D4C]/20 focus:border-[#0F5D4C] transition-all text-right shadow-2xs"
          />
          <Search className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Custom Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
          {/* Account Status Custom Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setDateDropdownOpen(false);
              }}
              className="flex items-center justify-between gap-3 bg-[#EFEFEF] hover:bg-gray-200 text-gray-900 text-xs font-bold px-4 py-2.5 rounded-t-xl rounded-b-none min-w-[140px] transition-all cursor-pointer border-b border-gray-300/80"
            >
              <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} />
              <span>{selectedStatusLabel}</span>
            </button>

            {statusDropdownOpen && (
              <div className="absolute right-0 top-full w-full bg-[#EFEFEF] shadow-lg z-50 rounded-b-xl overflow-hidden flex flex-col border border-t-0 border-gray-200">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setAccountStatusFilter(option.value);
                      setStatusDropdownOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 text-xs font-bold transition-colors border-b border-gray-200/60 last:border-none hover:bg-gray-200/70 ${
                      accountStatusFilter === option.value
                        ? "text-[#0F5D4C] bg-gray-200/50"
                        : "text-gray-800"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Registration Date Custom Dropdown (Exact Pixel-Perfect Match with User Image) */}
          <div className="relative" ref={dateRef}>
            <button
              type="button"
              onClick={() => {
                setDateDropdownOpen(!dateDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              className="flex items-center justify-between gap-3 bg-[#EFEFEF] hover:bg-gray-200 text-gray-900 text-xs font-bold px-4 py-2.5 rounded-t-xl rounded-b-none min-w-[140px] transition-all cursor-pointer border-b border-gray-300/80"
            >
              <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${dateDropdownOpen ? "rotate-180" : ""}`} />
              <span>{selectedDateLabel}</span>
            </button>

            {dateDropdownOpen && (
              <div className="absolute right-0 top-full w-full bg-[#EFEFEF] shadow-lg z-50 rounded-b-xl overflow-hidden flex flex-col border border-t-0 border-gray-200">
                {dateOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setRegistrationDateFilter(option.value);
                      setDateDropdownOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 text-xs font-bold transition-colors border-b border-gray-200/60 last:border-none hover:bg-gray-200/70 ${
                      registrationDateFilter === option.value
                        ? "text-[#0F5D4C] bg-gray-200/50"
                        : "text-gray-800"
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

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
              <th className="pb-3 px-3">السائق</th>
              <th className="pb-3 px-3">رقم الهاتف</th>
              <th className="pb-3 px-3">تاريخ التسجيل</th>
              <th className="pb-3 px-3">التقييم</th>
              <th className="pb-3 px-3">الرحلات المكتملة</th>
              <th className="pb-3 px-3">الباقة</th>
              <th className="pb-3 px-3">حالة الحساب</th>
              <th className="pb-3 px-3 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
            {drivers.map((driver, index) => {
              const isActive = driver.status === "active";
              const isTempSuspended = driver.status === "suspended_temp";
              const badgeVariant = isActive
                ? "success"
                : isTempSuspended
                ? "warning"
                : "destructive";

              const isEvenRow = index % 2 === 1;

              return (
                <tr
                  key={driver.id}
                  className={`${
                    isEvenRow ? "bg-table-row-alt" : "bg-white"
                  } hover:!bg-[#E8F5E9]/60 transition-colors`}
                >
                  <td className="py-4 px-3 font-bold text-gray-900">
                    {driver.name}
                  </td>

                  <td className="py-4 px-3 text-gray-600 font-mono text-xs" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {driver.phone}
                  </td>

                  <td className="py-4 px-3 text-gray-500 font-medium" style={{ unicodeBidi: "isolate" }}>
                    {driver.registrationDate}
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1 font-bold text-gray-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                        {driver.rating}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-3 text-gray-800 font-semibold" style={{ unicodeBidi: "isolate" }}>
                    {driver.completedTrips}
                  </td>

                  <td className="py-4 px-3 text-gray-600 font-medium">
                    {driver.plan}
                  </td>

                  <td className="py-4 px-3">
                    <Badge variant={badgeVariant}>
                      {driver.statusText}
                    </Badge>
                  </td>

                  <td className="py-4 px-3 text-center">
                    <Button variant="actionOutline" size="default" asChild>
                      <Link href={`/drivers/${driver.id}`}>
                        عرض التفاصيل
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PaginationControls meta={currentMeta} onPageChange={setCurrentPage} />
    </div>
  );
}