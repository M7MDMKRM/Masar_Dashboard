"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { FeaturedTripSummary } from "../types/dashboard-types";

interface FeaturedTripCardProps {
  summary: FeaturedTripSummary;
}

export function FeaturedTripCard({ summary }: FeaturedTripCardProps) {
  return (
    <div className="bg-gradient-to-l from-[#0D382E] to-[#196A58] text-white rounded-2xl p-5 flex flex-col justify-between gap-3.5 shadow-sm relative overflow-hidden min-h-[140px]">
      {/* 1. السطر الأول العلوي: عنوان الكارت على اليمين بالكامل */}
      <div className="text-start z-10">
        <h4 className="text-xs font-bold text-white tracking-wide">
          {summary.title}
        </h4>
      </div>

      {/* 2. السطر الأوسط: الرقم والجملة مدمجان في نفس السطر البصري من اليمين (42 رحلة يتم تنفيذها حاليًا...) */}
      <div className="flex items-baseline justify-start gap-2 z-10 text-start leading-snug">
        <span
          dir="ltr"
          className="inline-block font-mono text-2xl font-black text-white tracking-tight"
        >
          {summary.activeCount}
        </span>
        <span className="text-[11px] font-medium text-emerald-100/90">
          رحلة يتم تنفيذها حاليًا ويمكن متابعتها مباشرة من لوحة التحكم.
        </span>
      </div>

      {/* 3. الزر الأبيض السفلي: السهم على اليمين ثم النص "عرض الرحلات النشطة" بنفس الترتيب والانحناء بالضبط */}
      <button className="z-10 w-full bg-white text-[#196A58] hover:bg-emerald-50 active:scale-[0.99] font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 cursor-pointer mt-1">
        <ChevronRight className="w-4 h-4 text-[#196A58]" />
        <span>عرض الرحلات النشطة</span>
      </button>
    </div>
  );
}
