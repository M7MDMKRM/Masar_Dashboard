"use client";

import React from "react";
import { Download } from "lucide-react";

export function DownloadReportButton() {
  return (
    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#196A58]/30 bg-white text-[#196A58] hover:bg-emerald-50/50 active:scale-[0.98] font-bold text-xs shadow-2xs transition-all cursor-pointer">
      <Download className="w-4 h-4 text-[#196A58]" />
      <span>تحميل التقرير</span>
    </button>
  );
}
