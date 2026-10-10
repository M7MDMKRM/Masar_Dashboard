"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Bell, Menu, X } from "lucide-react";
import { useDashboardStore } from "@/features/dashboard/store/use-dashboard-store";
import { Sidebar } from "./Sidebar";

export function Header() {
  const { searchQuery, setSearchQuery } = useDashboardStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get current Arabic formatted date
  const todayDate = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <header className="h-20 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          title="القائمة"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* 1. Far Right: Brand Logo "masar" */}
        <div className="flex items-center gap-4 shrink-0">
          <Image
            src="/masar-logo.png"
            alt="masar logo"
            width={120}
            height={40}
            priority
            className="h-auto w-auto max-w-[100px] md:max-w-[120px] object-contain"
          />
        </div>

        {/* 2. Center: Search Bar (Hidden on small mobile screens) */}
        <div className="flex-1 flex justify-end relative hidden sm:flex">
          <div className="w-full max-w-xl md:ml-10 lg:ml-20 mr-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سائق، رحلة، أو حجز..."
              className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl pr-10 pl-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5D4C]/20 focus:border-[#0F5D4C] transition-all text-right"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 3. Notification Icon */}
        <div className="flex items-center px-2 md:px-3 shrink-0">
          <button
            title="الإشعارات"
            className="relative text-gray-500 hover:text-[#0F5D4C] p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>

        {/* 4. Date (Hidden on mobile) */}
        <div className="hidden md:flex items-center shrink-0 px-4 lg:px-10">
          <span className="text-xs lg:text-sm font-medium text-gray-600 whitespace-nowrap">
            {todayDate}
          </span>
        </div>

        {/* 5. Far Left: User Profile */}
        <div className="flex items-center gap-3 pl-2 md:pl-4 border-r md:border-r-0 md:border-l border-gray-100 shrink-0">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-sm font-bold text-gray-900 leading-tight">أحمد شلبي</span>
            <span className="text-xs font-medium text-gray-400">مدير النظام</span>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs overflow-hidden">
            AMS
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Sidebar */}
          <div className="relative z-50 w-64 max-w-[80vw] bg-white h-full shadow-2xl overflow-y-auto">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}