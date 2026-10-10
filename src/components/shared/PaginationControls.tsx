"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
}

export interface PaginationControlsProps {
  meta: PaginationMeta;
  onPageChange?: (page: number) => void;
}

export function PaginationControls({ meta, onPageChange }: PaginationControlsProps) {
  const { currentPage, totalPages, totalResults, pageSize } = meta;

  // Ensure button disabled state logic is strict:
  // - Previous button is disabled ONLY when currentPage <= 1
  // - Next button is disabled ONLY when currentPage >= totalPages
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium w-full">
      {/* Total items counter */}
      <div>
        عرض <span className="font-bold text-gray-800" dir="ltr" style={{ unicodeBidi: "isolate" }}>{pageSize}</span> من أصل{" "}
        <span className="font-bold text-gray-800" dir="ltr" style={{ unicodeBidi: "isolate" }}>{totalResults}</span> نتيجة
      </div>

      {/* Pagination Controls (RTL layout: Prev Outline Green on Right, Numbers Middle, Next Solid Green on Left) */}
      <div className="flex items-center gap-2">
        {/* Previous Button (Right in RTL - Outline green with > icon, rounded-[14px]) */}
        <Button
          variant="outline"
          size="sm"
          className="border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED] rounded-[14px] gap-1 px-4 h-8 text-xs font-bold disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
          disabled={isPrevDisabled}
          onClick={() => !isPrevDisabled && onPageChange?.(currentPage - 1)}
        >
          <ChevronRight className="w-4 h-4 text-current" />
          <span>السابق</span>
        </Button>

        {/* Page Numbers (Squircle rounded-[8px] boxes matching uploaded image) */}
        <div className="flex items-center gap-1.5 mx-1">
          {/* Page 1 */}
          <button
            onClick={() => onPageChange?.(1)}
            className={`w-7 h-7 rounded-[8px] font-bold flex items-center justify-center text-xs transition-all cursor-pointer ${
              currentPage === 1
                ? "bg-[#146C5B] text-white shadow-2xs"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold"
            }`}
            dir="ltr"
            style={{ unicodeBidi: "isolate" }}
          >
            1
          </button>

          {/* Page 2 */}
          <button
            onClick={() => onPageChange?.(2)}
            className={`w-7 h-7 rounded-[8px] font-bold flex items-center justify-center text-xs transition-all cursor-pointer ${
              currentPage === 2
                ? "bg-[#146C5B] text-white shadow-2xs"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold"
            }`}
            dir="ltr"
            style={{ unicodeBidi: "isolate" }}
          >
            2
          </button>

          {/* Page 3 */}
          <button
            onClick={() => onPageChange?.(3)}
            className={`w-7 h-7 rounded-[8px] font-bold flex items-center justify-center text-xs transition-all cursor-pointer ${
              currentPage === 3
                ? "bg-[#146C5B] text-white shadow-2xs"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold"
            }`}
            dir="ltr"
            style={{ unicodeBidi: "isolate" }}
          >
            3
          </button>

          <span className="px-1 text-gray-400 font-bold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
            ....
          </span>

          {/* Last Page */}
          <button
            onClick={() => onPageChange?.(totalPages)}
            className={`w-7 h-7 rounded-[8px] font-bold flex items-center justify-center text-xs transition-all cursor-pointer ${
              currentPage === totalPages
                ? "bg-[#146C5B] text-white shadow-2xs"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold"
            }`}
            dir="ltr"
            style={{ unicodeBidi: "isolate" }}
          >
            {totalPages}
          </button>
        </div>

        {/* Next Button (Left in RTL - Solid green filled with < icon, rounded-[14px]) */}
        <Button
          variant="default"
          size="sm"
          className="bg-[#146C5B] hover:bg-[#0E4E42] text-white rounded-[14px] gap-1 px-4 h-8 text-xs font-bold shadow-2xs disabled:opacity-40 disabled:bg-gray-200 disabled:text-gray-400"
          disabled={isNextDisabled}
          onClick={() => !isNextDisabled && onPageChange?.(currentPage + 1)}
        >
          <span>التالي</span>
          <ChevronLeft className="w-4 h-4 text-current" />
        </Button>
      </div>
    </div>
  );
}
