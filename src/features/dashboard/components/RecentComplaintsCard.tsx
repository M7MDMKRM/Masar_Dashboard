"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { RecentComplaint, PaginationMeta } from "../types/dashboard-types";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Button } from "@/components/ui/button";

interface RecentComplaintsCardProps {
  complaints: RecentComplaint[];
  pagination: PaginationMeta;
}

const filterOptions = [
  { label: "اليوم", value: "today" },
  { label: "أي وقت", value: "anytime" },
  { label: "هذا الأسبوع", value: "this_week" },
  { label: "هذا الشهر", value: "this_month" },
  { label: "هذا العام", value: "this_year" },
];

export function RecentComplaintsCard({
  complaints,
  pagination,
}: RecentComplaintsCardProps) {
  const [filter, setFilter] = useState("today");
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

  const selectedLabel = filterOptions.find((o) => o.value === filter)?.label || "اليوم";

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col gap-4">
      {/* Header with filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">آخر الشكاوى</h3>

        {/* Custom Filter Dropdown Button: Label on Right in RTL, Chevron Icon on Left in RTL */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-2.5 bg-[#EFEFEF] hover:bg-gray-200 text-gray-900 text-xs font-bold px-3.5 py-2 rounded-t-xl rounded-b-none min-w-[120px] transition-all cursor-pointer border-b border-gray-300/80"
          >
            <span>{selectedLabel}</span>
            <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full w-full bg-[#EFEFEF] shadow-lg z-50 rounded-b-xl overflow-hidden flex flex-col border border-t-0 border-gray-200 min-w-[130px]">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setFilter(option.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-right px-3.5 py-2.5 text-xs font-bold transition-colors border-b border-gray-200/60 last:border-none hover:bg-gray-200/70 ${
                    filter === option.value ? "text-[#146C5B] bg-gray-200/50" : "text-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
              <th className="pb-2.5 px-3">رقم الشكوى</th>
              <th className="pb-2.5 px-3">مقدم الشكوى</th>
              <th className="pb-2.5 px-3">الطرف المشتكى عليه</th>
              <th className="pb-2.5 px-3">نوع المشكلة</th>
              <th className="pb-2.5 px-3">التاريخ</th>
              <th className="pb-2.5 px-3">الحالة</th>
              <th className="pb-2.5 px-3 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
            {complaints.map((item, index) => {
              const isResolved = item.status === "resolved";
              const isInProgress = item.status === "in_progress";
              const isEvenRow = index % 2 === 1;

              return (
                <tr
                  key={item.id}
                  className={`${
                    isEvenRow ? "bg-table-row-alt" : "bg-white"
                  } hover:!bg-[#E8F5E9]/60 transition-colors`}
                >
                  <td className="py-3.5 px-3 font-semibold text-gray-900" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {item.complaintNumber}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-gray-900">
                    {item.complainant}
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">
                    {item.respondent}
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">
                    {item.issueType}
                  </td>
                  <td className="py-3.5 px-3 text-gray-500 font-medium">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold ${
                        isResolved
                          ? "bg-[#FADBD8] text-[#D9383A]"
                          : isInProgress
                          ? "bg-[#FDEBD0] text-[#D67E10]"
                          : "bg-[#E2F1ED] text-[#146C5B]"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isResolved
                            ? "bg-[#D9383A]"
                            : isInProgress
                            ? "bg-[#D67E10]"
                            : "bg-[#146C5B]"
                        }`}
                      />
                      <span>{item.statusText}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <Button variant="actionOutline" size="sm" className="h-7 px-3.5">
                      مراجعة
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <PaginationControls meta={pagination} />
    </div>
  );
}
