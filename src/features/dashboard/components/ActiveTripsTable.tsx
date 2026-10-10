"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ActiveTrip, PaginationMeta } from "../types/dashboard-types";
import { useDashboardStore } from "../store/use-dashboard-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/shared/PaginationControls";

interface ActiveTripsTableProps {
  trips: ActiveTrip[];
  pagination: PaginationMeta;
}

const timeOptions = [
  { label: "اليوم", value: "today" },
  { label: "أي وقت", value: "anytime" },
  { label: "هذا الأسبوع", value: "this_week" },
  { label: "هذا الشهر", value: "this_month" },
  { label: "هذا العام", value: "this_year" },
];

export function ActiveTripsTable({ trips, pagination }: ActiveTripsTableProps) {
  const { timeFilter, setTimeFilter } = useDashboardStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = timeOptions.find((o) => o.value === timeFilter)?.label || "اليوم";

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col gap-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-gray-900">الرحلات النشطة الآن</h3>

        {/* Custom Filter Dropdown: Arrow Icon on Right, Title on Left (Matching RTL Standard) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-3 bg-[#EFEFEF] hover:bg-gray-200 text-gray-900 text-xs font-bold px-4 py-2 rounded-t-xl rounded-b-none min-w-[130px] transition-all cursor-pointer border-b border-gray-300/80"
          >
            {/* 1. السطر الأول في الكود -> يظهر باليمين في العربي (السهم) */}
            <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            {/* 2. السطر الثاني في الكود -> يظهر باليسار في العربي (العنوان) */}
            <span>{selectedLabel}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full w-full bg-[#EFEFEF] shadow-lg z-50 rounded-b-xl overflow-hidden flex flex-col border border-t-0 border-gray-200">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setTimeFilter(option.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-right px-4 py-2.5 text-xs font-bold transition-colors border-b border-gray-200/60 last:border-none hover:bg-gray-200/70 ${
                    timeFilter === option.value ? "text-[#146C5B] bg-gray-200/50" : "text-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
              <th className="pb-2.5 px-3">رقم الرحلة</th>
              <th className="pb-2.5 px-3">السائق</th>
              <th className="pb-2.5 px-3">المسار</th>
              <th className="pb-2.5 px-3">وقت البداية</th>
              <th className="pb-2.5 px-3">عدد الركاب</th>
              <th className="pb-2.5 px-3">الحالة</th>
              <th className="pb-2.5 px-3 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
            {trips.map((trip, index) => {
              const isInProgress = trip.status === "in_progress";
              const isEvenRow = index % 2 === 1;
              return (
                <tr
                  key={trip.id}
                  className={`${
                    isEvenRow ? "bg-table-row-alt" : "bg-white"
                  } hover:!bg-[#E8F5E9]/60 transition-colors`}
                >
                  <td className="py-3.5 px-3 font-semibold text-gray-900" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {trip.tripNumber}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-gray-900">
                    {trip.driverName}
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">
                    {trip.route}
                  </td>
                  <td className="py-3.5 px-3 text-gray-500 font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {trip.startTime}
                  </td>
                  <td className="py-3.5 px-3 text-gray-700 font-semibold">
                    <span dir="ltr" style={{ unicodeBidi: "isolate" }}>{trip.passengerCount}</span> ركاب
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge variant={isInProgress ? "success" : "warning"}>
                      {trip.statusText}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <Button variant="actionOutline" size="default">
                      عرض الرحلة
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Shared Pagination Component */}
      <PaginationControls meta={pagination} />
    </div>
  );
}
