"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { PopularRoute } from "../types/dashboard-types";

interface PopularRoutesCardProps {
  routes: PopularRoute[];
}

const filterOptions = [
  { label: "اليوم", value: "today" },
  { label: "أي وقت", value: "anytime" },
  { label: "هذا الأسبوع", value: "this_week" },
  { label: "هذا الشهر", value: "this_month" },
  { label: "هذا العام", value: "this_year" },
];

export function PopularRoutesCard({ routes }: PopularRoutesCardProps) {
  const [filter, setFilter] = useState("this_month");
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

  const selectedLabel = filterOptions.find((o) => o.value === filter)?.label || "هذا الشهر";

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between gap-4 w-full lg:w-72 shrink-0">
      {/* Header with filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-900">المسارات الأكثر طلباً</h3>

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

      {/* Progress Items */}
      <div className="flex flex-col gap-3.5 my-1">
        {routes.map((item) => (
          <div key={item.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span className="text-gray-900 font-bold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {item.count}
              </span>
              <span className="text-gray-700 font-bold">{item.route}</span>
            </div>
            {/* Progress bar container */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex justify-start dir-rtl">
              <div
                className="h-full bg-[#146C5B] rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer text */}
      <div className="mt-auto pt-3 border-t border-gray-100 text-[11px] text-gray-400 text-center font-medium">
        عدد طلبات رحلات الركاب خلال آخر 7 أيام
      </div>
    </div>
  );
}
