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
  Star,
  Phone,
  Eye,
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  X,
  RotateCcw,
} from "lucide-react";
import { useDriverDetailsData } from "../hooks/use-driver-details-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerificationDocumentItem } from "../types/drivers-types";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { SendNotificationModal } from "./SendNotificationModal";
import { SendWarningModal } from "./SendWarningModal";
import { TempSuspendModal } from "./TempSuspendModal";
import { FinalSuspendModal } from "./FinalSuspendModal";
import { LiftSuspensionModal } from "./LiftSuspensionModal";

interface DriverDetailsContentProps {
  id: string;
}

const tabs = [
  { id: "overview", label: "نظرة عامة" },
  { id: "verification", label: "التوثيق" },
  { id: "vehicle", label: "المركبة" },
  { id: "status", label: "حالة الحساب" },
  { id: "trips", label: "الرحلات" },
  { id: "ratings", label: "التقييمات" },
];

const tripStatusFilters = [
  { label: "الكل", value: "all" },
  { label: "قيد التنفيذ", value: "in_progress" },
  { label: "قادمة", value: "upcoming" },
  { label: "المكتملة", value: "completed" },
  { label: "الملغاة", value: "cancelled" },
];

const timeDropdownOptions = [
  { label: "اليوم", value: "today" },
  { label: "أي وقت", value: "anytime" },
  { label: "هذا الأسبوع", value: "this_week" },
  { label: "هذا الشهر", value: "this_month" },
  { label: "هذا العام", value: "this_year" },
];

function DocumentCard({ doc }: { doc: VerificationDocumentItem }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-all">
      <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
        <Image
          src={doc.imageUrl}
          alt={doc.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-extrabold text-gray-900 text-start leading-snug">
            {doc.title}
          </h4>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-[11px] font-bold bg-[#FDEBD0] text-[#D67E10]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D67E10]" />
            <span>{doc.statusText}</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
          <span className="text-start">
            رُفع في {doc.uploadedDate}
          </span>
          <button
            type="button"
            className="flex items-center gap-1 text-gray-400 hover:text-[#146C5B] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>عرض المستند</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant="default"
            size="sm"
            className="w-full bg-[#146C5B] hover:bg-[#0D4B3F] text-white rounded-[14px] font-bold text-xs h-9 shadow-2xs"
          >
            اعتماد
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#FADBD8] text-[#D9383A] hover:bg-rose-50 rounded-[14px] font-bold text-xs h-9"
          >
            رفض
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DriverDetailsContent({ id }: DriverDetailsContentProps) {
  const { data, isLoading, error } = useDriverDetailsData(id);
  const [activeTab, setActiveTab] = useState("status");
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isTempSuspendModalOpen, setIsTempSuspendModalOpen] = useState(false);
  const [isFinalSuspendModalOpen, setIsFinalSuspendModalOpen] = useState(false);
  const [isLiftSuspensionModalOpen, setIsLiftSuspensionModalOpen] = useState(false);
  
  // Account Status State: "active" | "temp_suspended" | "final_suspended"
  const [accountStatusState, setAccountStatusState] = useState<"active" | "temp_suspended" | "final_suspended">("active");
  const [showToast, setShowToast] = useState(false);

  const [selectedTripStatus, setSelectedTripStatus] = useState("all");
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F5D4C]" />
        <span className="text-body font-semibold">جاري تحميل تفاصيل السائق...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-body font-medium">
        حدث خطأ أثناء تحميل تفاصيل السائق. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  const handleConfirmLiftSuspension = () => {
    const previousState = accountStatusState;
    setAccountStatusState("active");
    setIsLiftSuspensionModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast Notification (Bottom Left Toast matching screenshot) */}
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

      {/* Breadcrumb & Action Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right side in RTL: Title, Breadcrumb & Subtitle */}
        <div className="flex flex-col gap-1 text-right">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold justify-start">
            <span className="text-gray-500">تفاصيل السائق</span>
            <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/drivers" className="hover:text-gray-600 transition-colors">
              السائقون
            </Link>
          </div>
          <h1 className="text-heading text-2xl font-black text-gray-900 mt-1">
            تفاصيل السائق
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            عرض شامل لبيانات السائق وحالة التوثيق والنشاط وسجل الحساب على منصة مسار.
          </p>
        </div>

        {/* Left side in RTL: Action Buttons (Dynamic based on suspension state) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 1. Send Notification Button (Solid dark green) */}
          <Button
            variant="default"
            size="default"
            onClick={() => setIsNotificationModalOpen(true)}
            className="bg-[#146C5B] hover:bg-[#0D4B3F] text-white rounded-[14px] gap-2 px-4 py-2 text-xs font-bold shadow-2xs cursor-pointer"
          >
            <span>إرسال إشعار</span>
            <Bell className="w-4 h-4 text-white" />
          </Button>

          {/* 2. Send Warning Button (Amber Outline) */}
          <Button
            variant="outline"
            size="default"
            onClick={() => setIsWarningModalOpen(true)}
            className="border-[#FDEBD0] text-[#D67E10] hover:bg-amber-50 rounded-[14px] gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
          >
            <span>إرسال إنذار</span>
            <AlertTriangle className="w-4 h-4 text-[#D67E10]" />
          </Button>

          {/* In Final Suspension Mode: Exactly 3 buttons (إرسال إشعار, إرسال إنذار, رفع إيقاف) */}
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

          {/* In Temporary Suspension Mode: 4 buttons with Lift Suspension + Final Suspend */}
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

          {/* In Active Mode: 4 buttons (إرسال إشعار, إرسال إنذار, إيقاف مؤقت, إيقاف نهائي) */}
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
        </div>
      </div>

      {/* Main Hero Card: Driver Profile Info & 4 Summary Metrics */}
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-6">
        {/* Top Driver Info Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Profile Image & Text Info on Right in RTL */}
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
              {/* Gender, Age & Phone row */}
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

              {/* Rating row */}
              <div className="flex items-center justify-start gap-1.5 text-xs text-gray-500 font-bold mt-1.5">
                <span className="font-mono text-gray-800" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                  {data.rating} / 5.0
                </span>
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                  ({data.reviewCount} تقييم)
                </span>
              </div>

              {/* Suspension Notice if Suspended */}
              {accountStatusState !== "active" && (
                <span className="text-xs font-semibold text-gray-400 mt-1">
                  موقوف حتى 11 ديسمبر 2026
                </span>
              )}
            </div>
          </div>

          {/* Badges on Left in RTL (Matching Screenshots exactly per State) */}
          <div className="flex items-center gap-2">
            {accountStatusState === "final_suspended" && (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                  <span className="w-2 h-2 rounded-full bg-[#146C5B]" />
                  <span>موثق</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
                  <span className="w-2 h-2 rounded-full bg-[#D9383A]" />
                  <span>موقوف نهائيًا</span>
                </span>
              </>
            )}

            {accountStatusState === "temp_suspended" && (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                  <span className="w-2 h-2 rounded-full bg-[#146C5B]" />
                  <span>الحساب نشط</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                  <span className="w-2 h-2 rounded-full bg-[#146C5B]" />
                  <span>موثق</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FDEBD0] text-[#D67E10]">
                  <span className="w-2 h-2 rounded-full bg-[#D67E10]" />
                  <span>موقوف مؤقتًا</span>
                </span>
              </>
            )}

            {accountStatusState === "active" && (
              <Badge variant="success" className="px-3.5 py-1 text-xs font-bold rounded-[14px]">
                {data.statusText}
              </Badge>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* 4 Summary Stat Cards Grid Inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-gray-100 text-center">
          {/* 1. Total Trips */}
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl font-black text-gray-900 font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {data.summaryStats.totalTrips}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-1">إجمالي الرحلات</span>
          </div>

          {/* 2. Completed Trips */}
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl font-black text-[#146C5B] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {data.summaryStats.completedTrips}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-1">الرحلات المكتملة</span>
          </div>

          {/* 3. Cancelled Trips */}
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl font-black text-[#D9383A] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {data.summaryStats.cancelledTrips}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-1">الرحلات الملغاة</span>
          </div>

          {/* 4. Current Plan */}
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-2xl font-black text-[#D67E10]">
              {data.summaryStats.currentPlanValue}
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-1">الباقة الحالية</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header Bar */}
      <div className="border-b border-gray-200 flex items-center justify-start gap-8 text-sm font-bold">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 relative transition-colors cursor-pointer ${
                isActive ? "text-[#146C5B]" : "text-gray-500 hover:text-gray-800"
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
          {/* RTL Right Column */}
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

          {/* RTL Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 text-right">
                إحصائيات الرحلات
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <span className="text-2xl font-black text-gray-900 font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.tripStats.totalTrips}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 mt-1">إجمالي الرحلات</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <span className="text-2xl font-black text-[#146C5B] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.tripStats.completedTrips}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 mt-1">الرحلات المكتملة</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <span className="text-2xl font-black text-[#D9383A] font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.tripStats.cancelledTrips}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 mt-1">الرحلات الملغاة</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <div className="flex items-center gap-1" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    <span className="text-xl font-black text-gray-900 font-mono">
                      {data.tripStats.averageRating}
                    </span>
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 mt-1">متوسط التقييم</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900">الباقة الحالية</h3>
                <Badge variant="success" className="px-3.5 py-1 text-xs font-bold rounded-[14px]">
                  {data.currentPlan.statusText}
                </Badge>
              </div>
              <div className="flex flex-col divide-y divide-gray-50 text-xs font-medium">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">السعر</span>
                  <span className="text-gray-900 font-bold">
                    {data.currentPlan.price}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">المدة</span>
                  <span className="text-gray-800 font-semibold">
                    {data.currentPlan.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">العمولة</span>
                  <span className="text-gray-800 font-semibold">
                    {data.currentPlan.commission}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">تاريخ التفعيل</span>
                  <span className="text-gray-800 font-semibold">
                    {data.currentPlan.activationDate}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">تاريخ الانتهاء</span>
                  <span className="text-rose-600 font-bold">
                    {data.currentPlan.expiryDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: التوثيق (Verification Tab) */}
      {activeTab === "verification" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex items-center justify-between gap-4">
            <div className="flex flex-col text-right">
              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                توثيق السائق
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                راجع بيانات السائق والمستندات المرفوعة قبل اتخاذ قرار التوثيق.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FDEBD0] text-[#D67E10]">
              <span className="w-2 h-2 rounded-full bg-[#D67E10]" />
              <span>{data.verificationData?.statusText || "قيد التوثيق"}</span>
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                مستندات الهوية الشخصية
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FDEBD0] text-[#D67E10]">
                <span className="w-2 h-2 rounded-full bg-[#D67E10]" />
                <span>قيد التوثيق</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.verificationData?.identityDocuments.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                توثيق المركبة
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FDEBD0] text-[#D67E10]">
                <span className="w-2 h-2 rounded-full bg-[#D67E10]" />
                <span>قيد التوثيق</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.verificationData?.vehicleDocuments.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: المركبة (Vehicle Tab) */}
      {activeTab === "vehicle" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 text-right">
                بيانات المركبة
              </h3>
              <div className="flex flex-col divide-y divide-gray-50 text-xs font-medium">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">نوع المركبة</span>
                  <span className="text-gray-900 font-bold">{data.vehicleData?.specs.vehicleType || "سيدان"}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">الشركة المصنعة</span>
                  <span className="text-gray-900 font-bold">{data.vehicleData?.specs.manufacturer || "هيونداي"}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">الموديل</span>
                  <span className="text-gray-800 font-semibold">{data.vehicleData?.specs.model || "ألنترا"}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">سنة الصنع</span>
                  <span className="text-gray-800 font-mono font-semibold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.vehicleData?.specs.manufacturingYear || "2016"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">اللون</span>
                  <span className="text-gray-800 font-semibold">{data.vehicleData?.specs.color || "أبيض لؤلؤي"}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">رقم اللوحة</span>
                  <span className="text-gray-800 font-mono font-semibold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                    {data.vehicleData?.specs.plateNumber || "10-34567"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-gray-400">عدد المقاعد</span>
                  <span className="text-gray-800 font-semibold">{data.vehicleData?.specs.seatsCount || "4 مقاعد"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 text-right">
                حالة توثيق المركبة
              </h3>
              <div className="flex flex-col divide-y divide-gray-50 text-xs font-medium">
                {data.vehicleData?.verificationStatuses.map((item) => {
                  const isApproved = item.status === "approved";
                  return (
                    <div key={item.id} className="flex items-center justify-between py-2.5">
                      <span className="text-gray-400">{item.title}</span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-[14px] text-xs font-bold ${
                          isApproved
                            ? "bg-[#E2F1ED] text-[#146C5B]"
                            : "bg-[#FDEBD0] text-[#D67E10]"
                        }`}
                      >
                        {item.statusText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 text-right">
                صور المركبة
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.vehicleData?.photos.map((photo) => (
                  <div key={photo.id} className="flex flex-col gap-2">
                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-100 shadow-2xs">
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 text-center">
                      {photo.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 text-right">
                وثائق المركبة
              </h3>
              {data.vehicleData?.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-[#F8F9FA] rounded-xl p-4 flex items-center justify-between border border-gray-100"
                >
                  <div className="flex items-center gap-3 text-right">
                    <div className="w-10 h-10 rounded-xl bg-[#E2F1ED] flex items-center justify-center text-[#146C5B] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-gray-900">{doc.title}</span>
                      <span className="text-[11px] text-gray-400 font-medium">رُفع في {doc.uploadedDate}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#146C5B] hover:bg-gray-200/50 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: حالة الحساب (Account Status Tab) */}
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
                3
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-5 flex flex-col justify-between min-h-[95px] gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-900">قيد التوثيق</span>
              </div>
              <div className="text-2xl font-black text-gray-900 font-mono text-start" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                18
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
                    <th className="py-3 px-4 rounded-r-xl">العنوان</th>
                    <th className="py-3 px-4">السبب</th>
                    <th className="py-3 px-4">الرحلة المرتبطة</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4 text-center">النوع</th>
                    <th className="py-3 px-4 text-center rounded-l-xl">الحالة</th>
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

      {/* TAB 5: الرحلات (Trips Tab) */}
      {activeTab === "trips" && (
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
                {tripStatusFilters.map((tab) => {
                  const isActive = selectedTripStatus === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setSelectedTripStatus(tab.value)}
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
                  <th className="pb-3 px-3">رقم الرحلة</th>
                  <th className="pb-3 px-3">المسار</th>
                  <th className="pb-3 px-3">التاريخ والوقت</th>
                  <th className="pb-3 px-3">المقاعد</th>
                  <th className="pb-3 px-3">الحجوزات</th>
                  <th className="pb-3 px-3">سعر المقعد</th>
                  <th className="pb-3 px-3 text-center">الحالة</th>
                  <th className="pb-3 px-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {data.tripsData?.trips
                  .filter((trip) =>
                    selectedTripStatus === "all" ? true : trip.status === selectedTripStatus
                  )
                  .map((trip, index) => {
                    const isEven = index % 2 === 1;
                    return (
                      <tr
                        key={trip.id}
                        className={`${
                          isEven ? "bg-table-row-alt" : "bg-white"
                        } hover:!bg-[#E8F5E9]/60 transition-colors`}
                      >
                        <td className="py-4 px-3 font-semibold text-gray-900" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {trip.tripNumber}
                        </td>
                        <td className="py-4 px-3 font-bold text-gray-900">
                          {trip.route}
                        </td>
                        <td className="py-4 px-3 text-gray-500 font-medium">
                          {trip.dateTime}
                        </td>
                        <td className="py-4 px-3 text-gray-700 font-mono font-semibold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {trip.seats}
                        </td>
                        <td className="py-4 px-3 text-gray-700 font-mono font-semibold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                          {trip.bookings}
                        </td>
                        <td className="py-4 px-3 text-gray-900 font-bold">
                          {trip.seatPrice}
                        </td>
                        <td className="py-4 px-3 text-center">
                          {trip.status === "upcoming" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FDEBD0] text-[#D67E10]">
                              <span className="w-2 h-2 rounded-full bg-[#D67E10]" />
                              <span>{trip.statusText}</span>
                            </span>
                          )}
                          {trip.status === "in_progress" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#EBF5FB] text-[#2980B9]">
                              <span className="w-2 h-2 rounded-full bg-[#2980B9]" />
                              <span>{trip.statusText}</span>
                            </span>
                          )}
                          {trip.status === "completed" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                              <span className="w-2 h-2 rounded-full bg-[#146C5B]" />
                              <span>{trip.statusText}</span>
                            </span>
                          )}
                          {trip.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
                              <span className="w-2 h-2 rounded-full bg-[#D9383A]" />
                              <span>{trip.statusText}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3 text-center">
                          <Button
                            variant="actionOutline"
                            size="sm"
                            className="h-7 px-3.5"
                          >
                            عرض الرحلة
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <PaginationControls meta={data.tripsData?.pagination} />
        </div>
      )}

      {/* TAB 6: التقييمات (Ratings Tab) */}
      {activeTab === "ratings" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs text-gray-400 font-semibold" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                  {data.ratingsData?.totalReviews || 76} تقييم
                </span>
                <h3 className="text-sm font-bold text-gray-900">توزيع التقييمات</h3>
              </div>

              <div className="flex flex-col gap-3">
                {data.ratingsData?.distribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 text-xs font-bold">
                    <div className="flex items-center gap-1 w-10 justify-end" dir="ltr">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      <span className="text-gray-700 font-mono">{item.stars}</span>
                    </div>

                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden flex justify-start dir-rtl">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    <span className="text-gray-400 font-mono w-6 text-start" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
              <span className="text-xs font-bold text-gray-500">متوسط التقييم</span>
              <span className="text-5xl font-black text-gray-900 font-mono" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {data.ratingsData?.averageRating || 4.8}
              </span>
              <div className="flex items-center gap-1 text-amber-400 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-400">من 5.0</span>
            </div>
          </div>

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

          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xs p-6 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-900 text-right">تقييمات الركاب</h3>

            <div className="flex flex-col divide-y divide-gray-100">
              {data.ratingsData?.reviews.map((rev) => (
                <div key={rev.id} className="py-5 first:pt-0 last:pb-0 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 text-right">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm shrink-0">
                        {rev.userInitial}
                      </div>

                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? "fill-amber-400 stroke-amber-400"
                                  : "fill-gray-200 stroke-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {rev.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-[10px] bg-gray-100 text-gray-600 text-[10px] font-semibold"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-gray-400 font-medium shrink-0">
                      {rev.date}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 font-medium leading-relaxed text-right pe-12">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
