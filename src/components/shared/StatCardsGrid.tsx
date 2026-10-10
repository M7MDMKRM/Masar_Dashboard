"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardItem {
  id: string;
  title: string;
  value: string | number;
  changePercentage: number;
  changeType: "increase" | "decrease";
  description: string;
}

interface StatCardProps {
  stat: StatCardItem;
}

export function StatCard({ stat }: StatCardProps) {
  const isIncrease = stat.changeType === "increase";

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all duration-200 min-h-[110px]">
      {/* Top row: Title on Left in RTL, Percentage badge on Right in RTL */}
      <div className="flex items-center justify-between mb-2">
        {/* Title on Left in RTL */}
        <span className="text-xs font-extrabold text-gray-800 text-start">{stat.title}</span>

        {/* Percentage badge on Right in RTL */}
        <span
          dir="ltr"
          className={`inline-block font-mono text-xs font-bold ${
            isIncrease ? "text-[#146C5B]" : "text-[#D9383A]"
          }`}
        >
          {isIncrease ? (
            <TrendingUp className="w-3.5 h-3.5 text-[#146C5B] inline me-1" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-[#D9383A] inline me-1" />
          )}
          {isIncrease ? `+${stat.changePercentage}%` : `-${stat.changePercentage}%`}
        </span>
      </div>

      {/* Middle: Big Value using LTR isolation & logical alignment */}
      <div className="my-1 text-start">
        <span
          dir="ltr"
          className="inline-block font-mono text-2xl font-black text-gray-900 tracking-tight"
        >
          {stat.value}
        </span>
      </div>

      {/* Bottom: Description */}
      <div className="mt-2 text-xs text-gray-500 font-normal text-start leading-relaxed">
        {stat.description}
      </div>
    </div>
  );
}

interface StatCardsGridProps {
  stats: StatCardItem[];
  columns?: 4 | 5;
}

export function StatCardsGrid({ stats, columns = 4 }: StatCardsGridProps) {
  const gridColsClass =
    columns === 5
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridColsClass} gap-3.5`}>
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
