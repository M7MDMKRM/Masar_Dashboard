"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  Bell,
  AlertTriangle,
  Clock,
  Ban,
  Phone,
  RotateCcw,
  CheckCircle2,
  X,
  Star,
  Loader2,
} from "lucide-react";
import { usePassengerDetailsData } from "../hooks/use-passenger-details-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { SendNotificationModal } from "@/features/drivers/components/SendNotificationModal";
import { SendWarningModal } from "@/features/drivers/components/SendWarningModal";
import { TempSuspendModal } from "@/features/drivers/components/TempSuspendModal";
import { FinalSuspendModal } from "@/features/drivers/components/FinalSuspendModal";
import { LiftSuspensionModal } from "@/features/drivers/components/LiftSuspensionModal";

interface PassengerDetailsContentProps {
  id: string;
}

const passengerTabs = [
  { id: "overview", label: "نظرة عامة" },
  { id: "status", label: "حالة الحساب" },
  { id: "bookings", label: "الحجوزات" },
  { id: "trip_requests", label: "طلبات الرحلات" },
  { id: "complaints", label: "الشكاوى" },
  { id: "ratings", label: "التقييمات" },
];

const statusFilters = [
  { label: "الكل", value: "all" },
  { label: "قيد التنفيذ", value: "in_progress" },
  { label: "قادمة", value: "upcoming" },
  { label: "المكتملة", value: "completed" },
  { label: "الملغاة", value: "cancelled" },
];

const timeDropdownOptions = [
  { label: "هذا الشهر", value: "this_month" },
  { label: "اليوم", value: "today" },
  { label: "أي وقت", value: "anytime" },
  { label: "هذا الأسبوع", value: "this_week" },
  { label: "هذا العام", value: "this_year" },
];

export function PassengerDetailsContent({ id }: PassengerDetailsContentProps) {
  const { data, isLoading, error } = usePassengerDetailsData(id);
  const [activeTab, setActiveTab] = useState("ratings");

  // Complaints Sub-tab state
  const [complaintsSubTab, setComplaintsSubTab] = useState<"submitted" | "against">("submitted");

  // Filter state for Bookings & Trip Requests
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("this_month");
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

  const selectedTimeLabel =
    timeDropdownOptions.find((o) => o.value === timeFilter)?.label || "هذا الشهر";

  // Modals state
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isTempSuspendModalOpen, setIsTempSuspendModalOpen] = useState(false);
  const [isFinalSuspendModalOpen, setIsFinalSuspendModalOpen] = useState(false);
  const [isLiftSuspensionModalOpen, setIsLiftSuspensionModalOpen] = useState(false);

  const [accountStatusState, setAccountStatusState] = useState<"active" | "temp_suspended" | "final_suspended">("active");
  const [showToast, setShowToast] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F5D4C]" />
        <span className="text-body font-semibold">جاري تحميل تفاصيل الراكب...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-body font-medium">
        حدث خطأ أثناء تحميل تفاصيل الراكب. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  const handleConfirmLiftSuspension = () => {
    setAccountStatusState("active");
    setIsLiftSuspensionModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#174D3F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 border border-[#206654]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">تم رفع إيقاف الحساب</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setAccountStatusState("temp_suspended");
              setShowToast(false);
            }}
            className="text-xs font-bold text-emerald-300 hover:text-emerald-200 px-2 py-0.5 rounded transition-colors mr-2 cursor-pointer"
          >
            تراجع
          </button>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <SendNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        driverName={data.name}
      />

      <SendWarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        driverName={data.name}
      />

      <TempSuspendModal
        isOpen={isTempSuspendModalOpen}
        onClose={() => {
          setIsTempSuspendModalOpen(false);
          setAccountStatusState("temp_suspended");
        }}
        driverName={data.name}
      />

      <FinalSuspendModal
        isOpen={isFinalSuspendModalOpen}
        onClose={() => {
          setIsFinalSuspendModalOpen(false);
          setAccountStatusState("final_suspended");
        }}
        driverName={data.name}
      />

      <LiftSuspensionModal
        isOpen={isLiftSuspensionModalOpen}
        onClose={() => setIsLiftSuspensionModalOpen(false)}
        onConfirm={handleConfirmLiftSuspension}
      />

      {/* 1. Breadcrumb & Action Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right side in RTL */}
        <div className="flex flex-col gap-1 text-right">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold justify-start">
            <span className="text-gray-500">تفاصيل الراكب</span>
            <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/passengers" className="hover:text-gray-600 transition-colors">
              الركاب
            </Link>
          </div>
          <h1 className="text-heading text-2xl font-black text-gray-900 mt-1">
            تفاصيل الراكب
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            عرض شامل لبيانات الراكب والنشاط والحجوزات وسجل الحساب على منصة مسار.
          </p>
        </div>

        {/* Left side in RTL: Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 1. Send Notification Button */}
          <Button
            variant="default"
            size="default"
            onClick={() => setIsNotificationModalOpen(true)}
            className="bg-[#146C5B] hover:bg-[#0D4B3F] text-white rounded-[14px] gap-2 px-4 py-2 text-xs font-bold shadow-2xs cursor-pointer"
          >
            <span>إرسال إشعار</span>
            <Bell className="w-4 h-4 text-white" />
          </Button>

          {/* 2. Send Warning Button */}
          <Button
            variant="outline"
            size="default"
            onClick={() => setIsWarningModalOpen(true)}
            className="border-[#FDEBD0] text-[#D67E10] hover:bg-amber-50 rounded-[14px] gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
          >
            <span>إرسال إنذار</span>
            <AlertTriangle className="w-4 h-4 text-[#D67E10]" />
          </Button>

          {/* 3. Temp Suspend / Lift Suspension */}
          {accountStatusState === "active" && (
            <>
              <Button
                variant="outline"
                size="default"
                onClick={() => setIsTempSuspendModalOpen(true)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-[14px] gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
              >
                <span>إيقاف مؤقت</span>
                <Clock className="w-4 h-4 text-gray-500" />
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => setIsFinalSuspendModalOpen(true)}
                className="border-[#FADBD8] text-[#D9383A] hover:bg-rose-50 rounded-[14px] gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
              >
                <span>إيقاف نهائي</span>
                <Ban className="w-4 h-4 text-[#D9383A]" />
              </Button>
            </>
          )}

          {accountStatusState === "temp_suspended" && (
            <>
              <Button
                variant="outline"
                size="default"
                onClick={() => setIsLiftSuspensionModalOpen(true)}
                className="border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED] rounded-[14px] gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
              >
                <span>رفع إيقاف</span>
                <RotateCcw className="w-4 h-4 text-[#146C5B]" />
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => setIsFinalSuspendModalOpen(true)}
                className="border-[#FADBD8] text-[#D9383A] hover:bg-rose-50 rounded-[14px] gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
              >
                <span>إيقاف نهائي</span>
                <Ban className="w-4 h-4 text-[#D9383A]" />
              </Button>
            </>
          )}

          {accountStatusState === "final_suspended" && (
            <Button
              variant="outline"
              size="default"
              onClick={() => setIsLiftSuspensionModalOpen(true)}
              className="border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED] rounded-[14px] gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
            >
              <span>رفع إيقاف</span>
              <RotateCcw className="w-4 h-4 text-[#146C5B]" />
            </Button>
          )}
        </div>
      </div>

      {/* 2. Main Hero Card: Passenger Profile Info & 4 Summary Metrics */}
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-right">
            <Image
              src={data.avatarUrl}
              alt={data.name}
              width={70}
              height={70}
              className="w-16 h-16 rounded-full object-cover shadow-2xs border-2 border-white"
            />
            <div className="flex flex-col text-right">
              <h2 className="text-lg font-bold text-gray-900 leading-snug">
                {data.name}
              </h2>
              <div className="flex items-center justify-start gap-3 text-xs text-gray-400 font-semibold mt-1">
                <span>{data.gender}</span>
                <span>|</span>
                <span>العمر: {data.age} عام</span>
                <span>|</span>
                <div className="flex items-center gap-1" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                  <Phone className="w-3 h-3 text-gray-400 mr-1" />
                  <span>{data.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <Badge variant="success" className="px-3.5 py-1 text-xs font-bold rounded-[14px]">
            {data.statusText}
          </Badge>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-gray-100 text-center">
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl font-black text-gray-900 font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {data.summaryStats.totalBookings}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-1">إجمالي الحجوزات</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl font-black text-[#146C5B] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {data.summaryStats.completedTrips}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-1">الرحلات المكتملة</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl font-black text-[#D9383A] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {data.summaryStats.cancelledBookings}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-1">الحجوزات الملغاة</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl font-black text-[#D67E10] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {data.summaryStats.tripRequests}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-1">طلبات الرحلات</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs Bar */}
      <div className="border-b border-gray-200 flex items-center justify-start gap-8 text-sm font-bold">
        {passengerTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 relative transition-colors cursor-pointer ${
                isActive ? "text-[#146C5B] font-extrabold" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#146C5B] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: نظرة عامة (Overview Tab) */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 text-right">
              المعلومات الشخصية
            </h3>
            <div className="flex flex-col divide-y divide-gray-50 text-xs font-medium">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400">الاسم الكامل</span>
                <span className="text-gray-900 font-bold">{data.personalInfo.fullName}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400">رقم الهاتف</span>
                <span className="text-gray-800 font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                  {data.personalInfo.phone}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400">العمر</span>
                <span className="text-gray-800 font-semibold">
                  {data.personalInfo.age} عام
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400">تاريخ التسجيل</span>
                <span className="text-gray-800 font-semibold">
                  {data.personalInfo.registrationDate}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400">آخر نشاط</span>
                <span className="text-gray-800 font-semibold">
                  {data.personalInfo.lastActive}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400">المدينة</span>
                <span className="text-gray-800 font-semibold">{data.personalInfo.city}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 text-right">
                إحصائيات النشاط
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <span className="text-2xl font-black text-gray-900 font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.activityStats.totalBookings}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 mt-1">إجمالي الحجوزات</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <span className="text-2xl font-black text-[#146C5B] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.activityStats.completedTrips}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 mt-1">الرحلات المكتملة</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <span className="text-2xl font-black text-[#D9383A] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.activityStats.cancelledBookings}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 mt-1">الحجوزات الملغاة</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <span className="text-2xl font-black text-[#D67E10] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.activityStats.tripRequests}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 mt-1">طلبات الرحلات</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-[14px] text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                  {data.lastBooking.statusText}
                </span>
                <h3 className="text-sm font-bold text-gray-900">آخر حجز</h3>
              </div>

              <div className="flex flex-col divide-y divide-gray-50 text-xs font-medium">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">{data.lastBooking.price}</span>
                  <span className="text-gray-900 font-bold">{data.lastBooking.route}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">التاريخ</span>
                  <span className="text-gray-800 font-semibold">{data.lastBooking.date}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">المقاعد</span>
                  <span className="text-gray-800 font-semibold">{data.lastBooking.seats}</span>
                </div>
              </div>

              <Button
                variant="actionOutline"
                size="default"
                className="w-full mt-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl text-xs font-bold h-10"
              >
                عرض الحجز
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: حالة الحساب (Account Status Tab) */}
      {activeTab === "status" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[95px] gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-900">المخالفات</span>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5" dir="ltr">
                  <span>+1</span>
                  <span>↗</span>
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 font-mono text-start" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                3
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[95px] gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-900">الإنذارات</span>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5" dir="ltr">
                  <span>+1</span>
                  <span>↗</span>
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 font-mono text-start" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                2
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[95px] gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-900">العقوبات</span>
              </div>
              <div className="text-2xl font-black text-gray-900 font-mono text-start" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                1
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[95px] gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-900">الشكاوى التي قدمها</span>
              </div>
              <div className="text-2xl font-black text-gray-900 font-mono text-start" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                4
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[95px] gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-900">الشكاوى ضده</span>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5" dir="ltr">
                  <span>+1</span>
                  <span>↗</span>
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 font-mono text-start" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                2
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
            <h3 className="text-base font-bold text-gray-900 text-right">
              سجل الحساب الإداري
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#F8F9FA] text-gray-500 text-xs font-bold">
                    <th className="py-3.5 px-4 rounded-r-xl">العنوان</th>
                    <th className="py-3.5 px-4">السبب</th>
                    <th className="py-3.5 px-4">الرحلة المرتبطة</th>
                    <th className="py-3.5 px-4">التاريخ</th>
                    <th className="py-3.5 px-4 text-center">النوع</th>
                    <th className="py-3.5 px-4 text-center rounded-l-xl">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                  {data.accountStatusData?.logs.map((log, index) => {
                    const isEven = index % 2 === 1;
                    return (
                      <tr
                        key={log.id}
                        className={`${
                          isEven ? "bg-table-row-alt" : "bg-white"
                        } hover:!bg-[#E8F5E9]/60 transition-colors`}
                      >
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {log.title}
                        </td>
                        <td className="py-4 px-4 text-gray-600 max-w-xs leading-relaxed">
                          {log.reason}
                        </td>
                        <td className="py-4 px-4 text-gray-700 font-semibold">
                          {log.relatedTrip}
                        </td>
                        <td className="py-4 px-4 text-gray-500 font-medium">
                          {log.date}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {log.type === "warning" && (
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-[14px] text-[11px] font-bold bg-[#FDEBD0] text-[#D67E10]">
                              {log.typeText}
                            </span>
                          )}
                          {log.type === "violation" && (
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-[14px] text-[11px] font-bold bg-[#FADBD8] text-[#D9383A]">
                              {log.typeText}
                            </span>
                          )}
                          {log.type === "temp_suspension" && (
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-[14px] text-[11px] font-bold bg-gray-100 text-gray-700">
                              {log.typeText}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {log.status === "recorded" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-[11px] font-bold bg-[#FADBD8] text-[#D9383A]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                              <span>{log.statusText}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-[11px] font-bold bg-[#E2F1ED] text-[#146C5B]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#146C5B]" />
                              <span>{log.statusText}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: الحجوزات (Bookings Tab) */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-gray-900">سجل الرحلات</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between gap-2.5 bg-[#EFEFEF] hover:bg-gray-200 text-gray-900 text-xs font-bold px-3.5 py-2 rounded-t-xl rounded-b-none min-w-[110px] transition-all cursor-pointer border-b border-gray-300/80"
                >
                  <span>{selectedTimeLabel}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 top-full w-full bg-[#EFEFEF] shadow-lg z-50 rounded-b-xl overflow-hidden flex flex-col border border-t-0 border-gray-200 min-w-[130px]">
                    {timeDropdownOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setTimeFilter(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-right px-3.5 py-2.5 text-xs font-bold transition-colors border-b border-gray-200/60 last:border-none hover:bg-gray-200/70 ${
                          timeFilter === option.value ? "text-[#146C5B] bg-gray-200/50" : "text-gray-800"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {statusFilters.map((tab) => {
                  const isActive = selectedStatusFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setSelectedStatusFilter(tab.value)}
                      className={`px-3.5 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#146C5B] text-white shadow-2xs"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
                  <th className="pb-3 px-3">رقم الحجز</th>
                  <th className="pb-3 px-3">رقم الرحلة</th>
                  <th className="pb-3 px-3">المسار</th>
                  <th className="pb-3 px-3">التاريخ والوقت</th>
                  <th className="pb-3 px-3 text-center">المقاعد</th>
                  <th className="pb-3 px-3 text-center">سعر المقعد</th>
                  <th className="pb-3 px-3 text-center">الحالة</th>
                  <th className="pb-3 px-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {data.bookingsData?.bookings
                  .filter((item) =>
                    selectedStatusFilter === "all" ? true : item.status === selectedStatusFilter
                  )
                  .map((booking, index) => {
                    const isEven = index % 2 === 1;
                    return (
                      <tr
                        key={booking.id}
                        className={`${
                          isEven ? "bg-table-row-alt" : "bg-white"
                        } hover:!bg-[#E8F5E9]/60 transition-colors`}
                      >
                        <td className="py-4 px-3 font-semibold text-gray-900" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {booking.bookingNumber}
                        </td>
                        <td className="py-4 px-3 font-semibold text-gray-700" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {booking.tripNumber}
                        </td>
                        <td className="py-4 px-3 font-bold text-gray-900">
                          {booking.route}
                        </td>
                        <td className="py-4 px-3 text-gray-500 font-medium">
                          {booking.dateTime}
                        </td>
                        <td className="py-4 px-3 text-center text-gray-700 font-mono font-semibold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {booking.seats}
                        </td>
                        <td className="py-4 px-3 text-center text-gray-900 font-bold">
                          {booking.seatPrice}
                        </td>
                        <td className="py-4 px-3 text-center">
                          {booking.status === "upcoming" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FDEBD0] text-[#D67E10]">
                              <span className="w-2 h-2 rounded-full bg-[#D67E10]" />
                              <span>{booking.statusText}</span>
                            </span>
                          )}
                          {booking.status === "in_progress" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#EBF5FB] text-[#2980B9]">
                              <span className="w-2 h-2 rounded-full bg-[#2980B9]" />
                              <span>{booking.statusText}</span>
                            </span>
                          )}
                          {booking.status === "completed" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                              <span className="w-2 h-2 rounded-full bg-[#146C5B]" />
                              <span>{booking.statusText}</span>
                            </span>
                          )}
                          {booking.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
                              <span className="w-2 h-2 rounded-full bg-[#D9383A]" />
                              <span>{booking.statusText}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3 text-center">
                          <Link href={`/bookings/${booking.bookingNumber || booking.id}`}>
                            <Button
                              variant="actionOutline"
                              size="sm"
                              className="h-7 px-3.5 text-xs font-bold"
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

          <PaginationControls meta={data.bookingsData?.pagination} />
        </div>
      )}

      {/* TAB 4: طلبات الرحلات (Trip Requests Tab) */}
      {activeTab === "trip_requests" && (
        <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-gray-900">سجل الرحلات</h3>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between gap-2.5 bg-[#EFEFEF] hover:bg-gray-200 text-gray-900 text-xs font-bold px-3.5 py-2 rounded-t-xl rounded-b-none min-w-[110px] transition-all cursor-pointer border-b border-gray-300/80"
                >
                  <span>{selectedTimeLabel}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 top-full w-full bg-[#EFEFEF] shadow-lg z-50 rounded-b-xl overflow-hidden flex flex-col border border-t-0 border-gray-200 min-w-[130px]">
                    {timeDropdownOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setTimeFilter(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-right px-3.5 py-2.5 text-xs font-bold transition-colors border-b border-gray-200/60 last:border-none hover:bg-gray-200/70 ${
                          timeFilter === option.value ? "text-[#146C5B] bg-gray-200/50" : "text-gray-800"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {statusFilters.map((tab) => {
                  const isActive = selectedStatusFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setSelectedStatusFilter(tab.value)}
                      className={`px-3.5 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#146C5B] text-white shadow-2xs"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
                  <th className="pb-3 px-3">رقم الطلب</th>
                  <th className="pb-3 px-3">المسار</th>
                  <th className="pb-3 px-3">التاريخ المطلوب</th>
                  <th className="pb-3 px-3">النطاق الزمني</th>
                  <th className="pb-3 px-3 text-center">المقاعد</th>
                  <th className="pb-3 px-3">تاريخ الإنشاء</th>
                  <th className="pb-3 px-3 text-center">الحالة</th>
                  <th className="pb-3 px-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {data.tripRequestsData?.requests
                  .filter((item) =>
                    selectedStatusFilter === "all" ? true : item.status === selectedStatusFilter
                  )
                  .map((request, index) => {
                    const isEven = index % 2 === 1;
                    return (
                      <tr
                        key={request.id}
                        className={`${
                          isEven ? "bg-table-row-alt" : "bg-white"
                        } hover:!bg-[#E8F5E9]/60 transition-colors`}
                      >
                        <td className="py-4 px-3 font-semibold text-gray-900" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {request.requestNumber}
                        </td>
                        <td className="py-4 px-3 font-bold text-gray-900">
                          {request.route}
                        </td>
                        <td className="py-4 px-3 text-gray-700 font-medium">
                          {request.requestedDate}
                        </td>
                        <td className="py-4 px-3 text-gray-700 font-medium">
                          {request.timeRange}
                        </td>
                        <td className="py-4 px-3 text-center text-gray-700 font-mono font-semibold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {request.seats}
                        </td>
                        <td className="py-4 px-3 text-gray-500 font-medium">
                          {request.createdDate}
                        </td>
                        <td className="py-4 px-3 text-center">
                          {request.status === "matched" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                              <span className="w-2 h-2 rounded-full bg-[#146C5B]" />
                              <span>{request.statusText}</span>
                            </span>
                          )}
                          {request.status === "active" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#EBF5FB] text-[#2980B9]">
                              <span className="w-2 h-2 rounded-full bg-[#2980B9]" />
                              <span>{request.statusText}</span>
                            </span>
                          )}
                          {request.status === "expired" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-gray-100 text-gray-600">
                              <span className="w-2 h-2 rounded-full bg-gray-500" />
                              <span>{request.statusText}</span>
                            </span>
                          )}
                          {request.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
                              <span className="w-2 h-2 rounded-full bg-[#D9383A]" />
                              <span>{request.statusText}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3 text-center">
                          <Button
                            variant="actionOutline"
                            size="sm"
                            className="h-7 px-3.5"
                          >
                            عرض الطلب
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <PaginationControls meta={data.tripRequestsData?.pagination} />
        </div>
      )}

      {/* TAB 5: الشكاوى (Complaints Tab) */}
      {activeTab === "complaints" && (
        <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-gray-900">الشكاوى</h3>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between gap-2.5 bg-[#EFEFEF] hover:bg-gray-200 text-gray-900 text-xs font-bold px-3.5 py-2 rounded-t-xl rounded-b-none min-w-[110px] transition-all cursor-pointer border-b border-gray-300/80"
                >
                  <span>{selectedTimeLabel}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 top-full w-full bg-[#EFEFEF] shadow-lg z-50 rounded-b-xl overflow-hidden flex flex-col border border-t-0 border-gray-200 min-w-[130px]">
                    {timeDropdownOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setTimeFilter(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-right px-3.5 py-2.5 text-xs font-bold transition-colors border-b border-gray-200/60 last:border-none hover:bg-gray-200/70 ${
                          timeFilter === option.value ? "text-[#146C5B] bg-gray-200/50" : "text-gray-800"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setComplaintsSubTab("against")}
                  className={`px-3.5 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                    complaintsSubTab === "against"
                      ? "bg-[#146C5B] text-white shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  الشكاوى المقدمة ضده
                </button>
                <button
                  type="button"
                  onClick={() => setComplaintsSubTab("submitted")}
                  className={`px-3.5 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                    complaintsSubTab === "submitted"
                      ? "bg-[#146C5B] text-white shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  الشكاوى التي قدمها
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
                  <th className="pb-3 px-3">رقم الشكوى</th>
                  <th className="pb-3 px-3">
                    {complaintsSubTab === "submitted" ? "ضد" : "مقدم الشكوى"}
                  </th>
                  <th className="pb-3 px-3">السبب</th>
                  <th className="pb-3 px-3">الرحلة المرتبطة</th>
                  <th className="pb-3 px-3">التاريخ</th>
                  <th className="pb-3 px-3 text-center">الحالة</th>
                  <th className="pb-3 px-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {(complaintsSubTab === "submitted"
                  ? data.complaintsData?.submittedComplaints
                  : data.complaintsData?.againstComplaints
                )?.map((complaint, index) => {
                  const isEven = index % 2 === 1;
                  return (
                    <tr
                      key={complaint.id}
                      className={`${
                        isEven ? "bg-table-row-alt" : "bg-white"
                      } hover:!bg-[#E8F5E9]/60 transition-colors`}
                    >
                      <td className="py-4 px-3 font-semibold text-gray-900" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                        {complaint.complaintNumber}
                      </td>
                      <td className="py-4 px-3 font-bold text-gray-900">
                        {complaint.partyName}
                      </td>
                      <td className="py-4 px-3 text-gray-700 font-medium">
                        {complaint.reason}
                      </td>
                      <td className="py-4 px-3 text-gray-700 font-semibold">
                        {complaint.relatedTrip}
                      </td>
                      <td className="py-4 px-3 text-gray-500 font-medium">
                        {complaint.date}
                      </td>
                      <td className="py-4 px-3 text-center">
                        {complaint.status === "resolved" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                            <span className="w-2 h-2 rounded-full bg-[#146C5B]" />
                            <span>{complaint.statusText}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FDEBD0] text-[#D67E10]">
                            <span className="w-2 h-2 rounded-full bg-[#D67E10]" />
                            <span>{complaint.statusText}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <Button
                          variant="actionOutline"
                          size="sm"
                          className="h-7 px-3.5"
                        >
                          عرض الشكوى
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: التقييمات (Ratings Tab - Matching Screenshot 100% Pixel-Perfect) */}
      {activeTab === "ratings" && (
        <div className="flex flex-col gap-6">
          {/* 1. الصف العلوي: 4 كروت إحصائيات تقييم الراكب (إجمالي التقييمات, متوسط تقييماته, تقييمات بتعليق, إجمالي التقييمات مع التريند) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. إجمالي التقييمات */}
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[120px]">
              <span className="text-xs font-bold text-gray-900 text-right">إجمالي التقييمات</span>
              <div className="text-2xl font-black text-gray-900 font-mono text-start my-1" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {data.ratingsData?.stats.totalRatings.value || 18}
              </div>
              <p className="text-[11px] text-gray-400 font-medium text-right">
                {data.ratingsData?.stats.totalRatings.description}
              </p>
            </div>

            {/* 2. متوسط تقييماته */}
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[120px]">
              <span className="text-xs font-bold text-gray-900 text-right">متوسط تقييماته</span>
              <div className="text-2xl font-black text-gray-900 font-mono text-start my-1" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {data.ratingsData?.stats.averageRating.value || "4.6 / 5.0"}
              </div>
              <p className="text-[11px] text-gray-400 font-medium text-right">
                {data.ratingsData?.stats.averageRating.description}
              </p>
            </div>

            {/* 3. تقييمات بتعليق */}
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[120px]">
              <span className="text-xs font-bold text-gray-900 text-right">تقييمات بتعليق</span>
              <div className="text-2xl font-black text-gray-900 font-mono text-start my-1" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {data.ratingsData?.stats.ratingsWithComment.value || 11}
              </div>
              <p className="text-[11px] text-gray-400 font-medium text-right">
                {data.ratingsData?.stats.ratingsWithComment.description}
              </p>
            </div>

            {/* 4. إجمالي التقييمات مع شارة -8% ↘ */}
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[120px]">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-900">إجمالي التقييمات</span>
                <span className="text-[11px] font-bold text-[#D9383A] bg-[#FADBD8] px-2 py-0.5 rounded-full flex items-center gap-0.5" dir="ltr">
                  <span>-8%</span>
                  <span>↘</span>
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 font-mono text-start my-1" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {data.ratingsData?.stats.totalRatingsTrend.value || 18}
              </div>
              <p className="text-[11px] text-gray-400 font-medium text-right">
                {data.ratingsData?.stats.totalRatingsTrend.description}
              </p>
            </div>
          </div>

          {/* 2. كارت الأوصاف الشائعة */}
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 text-right">الأوصاف الشائعة</h3>
            <div className="flex items-center gap-2.5 flex-wrap">
              {data.ratingsData?.commonTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-[12px] bg-[#E2F1ED] text-[#146C5B] text-xs font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 3. كارت التقييمات التي قدمها وجدول التقييمات */}
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-5">
            {/* الهيدر مع قائمة الوقت المنسدلة */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">التقييمات التي قدمها</h3>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between gap-2.5 bg-[#EFEFEF] hover:bg-gray-200 text-gray-900 text-xs font-bold px-3.5 py-2 rounded-t-xl rounded-b-none min-w-[110px] transition-all cursor-pointer border-b border-gray-300/80"
                >
                  <span>{selectedTimeLabel}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 top-full w-full bg-[#EFEFEF] shadow-lg z-50 rounded-b-xl overflow-hidden flex flex-col border border-t-0 border-gray-200 min-w-[130px]">
                    {timeDropdownOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setTimeFilter(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-right px-3.5 py-2.5 text-xs font-bold transition-colors border-b border-gray-200/60 last:border-none hover:bg-gray-200/70 ${
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

            {/* جدول التقييمات التي قدمها */}
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
                    <th className="pb-3 px-3">السائق</th>
                    <th className="pb-3 px-3">رقم الرحلة</th>
                    <th className="pb-3 px-3">المسار</th>
                    <th className="pb-3 px-3">التاريخ والوقت</th>
                    <th className="pb-3 px-3 text-center">التقييم</th>
                    <th className="pb-3 px-3 text-center">الأوصاف</th>
                    <th className="pb-3 px-3 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                  {data.ratingsData?.ratingsGiven.map((item, index) => {
                    const isEven = index % 2 === 1;
                    return (
                      <tr
                        key={item.id}
                        className={`${
                          isEven ? "bg-table-row-alt" : "bg-white"
                        } hover:!bg-[#E8F5E9]/60 transition-colors`}
                      >
                        {/* اسم السائق */}
                        <td className="py-4 px-3 font-bold text-gray-900">
                          {item.driverName}
                        </td>

                        {/* رقم الرحلة */}
                        <td className="py-4 px-3 font-semibold text-gray-700" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {item.tripNumber}
                        </td>

                        {/* المسار */}
                        <td className="py-4 px-3 font-bold text-gray-900">
                          {item.route}
                        </td>

                        {/* التاريخ والوقت */}
                        <td className="py-4 px-3 text-gray-500 font-medium">
                          {item.dateTime}
                        </td>

                        {/* التقييم */}
                        <td className="py-4 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                            <span className="font-mono font-bold text-gray-800 text-xs">
                              {item.rating} / 5.0
                            </span>
                          </div>
                        </td>

                        {/* الأوصاف */}
                        <td className="py-4 px-3 text-center">
                          <span className="px-3 py-1 rounded-[12px] bg-[#E2F1ED] text-[#146C5B] text-xs font-bold">
                            {item.tag}
                          </span>
                        </td>

                        {/* إجراء */}
                        <td className="py-4 px-3 text-center">
                          <Button
                            variant="actionOutline"
                            size="sm"
                            className="h-7 px-3.5"
                          >
                            عرض التفاصيل
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* شريط الترقيم والتنقل */}
            <PaginationControls meta={data.ratingsData?.pagination} />
          </div>
        </div>
      )}
    </div>
  );
}
