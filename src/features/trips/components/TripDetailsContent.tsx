"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  XCircle,
  Star,
  Phone,
  MessageSquare,
  Check,
  Loader2,
  X,
  Info,
} from "lucide-react";
import { useTripDetailsData } from "../hooks/use-trips-data";
import { Button } from "@/components/ui/button";
import { CancelTripModal } from "./CancelTripModal";

interface TripDetailsContentProps {
  id: string;
}

export function TripDetailsContent({ id }: TripDetailsContentProps) {
  const { data, isLoading, error } = useTripDetailsData(id);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleConfirmCancel = (reason: string, notes: string) => {
    setIsCancelled(true);
    setShowToast(true);
  };

  const handleUndo = () => {
    setIsCancelled(false);
    setShowToast(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#146C5B]" />
        <span className="text-sm font-semibold">جاري تحميل تفاصيل الرحلة...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium">
        حدث خطأ أثناء تحميل تفاصيل الرحلة. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-right" dir="rtl">
      {/* 1. Breadcrumb & Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Link href="/trips" className="hover:text-gray-600 transition-colors">
            الرحلات
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-gray-400 transform scale-y-100" />
          <span className="text-gray-600 font-bold">تفاصيل الرحلة</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            تفاصيل الرحلة
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            عرض ومتابعة جميع تفاصيل الرحلة وحالتها والحجوزات المرتبطة بها.
          </p>
        </div>
      </div>

      {/* 2. Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: المقاعد الكلية */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[125px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">
              {data.stats.totalSeats.label}
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-0.5">
            {data.stats.totalSeats.value}
          </div>
          <div className="text-[11px] text-gray-400 font-medium leading-tight">
            {data.stats.totalSeats.description}
          </div>
        </div>

        {/* Card 2: المقاعد المحجوزة */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[125px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">
              {data.stats.bookedSeats.label}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2F1ED] text-[#146C5B]">
              {data.stats.bookedSeats.percentage}
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-0.5">
            {data.stats.bookedSeats.value}
          </div>
          <div className="text-[11px] text-gray-400 font-medium leading-tight">
            {data.stats.bookedSeats.description}
          </div>
        </div>

        {/* Card 3: المقاعد المتاحة */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[125px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">
              {data.stats.availableSeats.label}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDEBD0] text-[#D67E10]">
              {data.stats.availableSeats.badge}
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-0.5">
            {data.stats.availableSeats.value}
          </div>
          <div className="text-[11px] text-gray-400 font-medium leading-tight">
            {data.stats.availableSeats.description}
          </div>
        </div>

        {/* Card 4: إجمالي قيمة الحجوزات */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[125px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">
              {data.stats.totalBookingValue.label}
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-0.5">
            {data.stats.totalBookingValue.value}
          </div>
          <div className="text-[11px] text-gray-400 font-medium leading-tight">
            {data.stats.totalBookingValue.description}
          </div>
        </div>
      </div>

      {/* 3. Quick Info Bar & Action */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Right Info Items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full md:w-auto">
          {/* رقم الرحلة */}
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-gray-400">رقم الرحلة</span>
            <span className="text-xs font-black text-gray-900 mt-0.5">
              {data.tripNumber}
            </span>
          </div>

          {/* حالة الرحلة */}
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-gray-400">حالة الرحلة</span>
            <div className="mt-0.5">
              {isCancelled ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FADBD8] text-[#D9383A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                  ملغاة
                </span>
              ) : data.status === "completed" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E2F1ED] text-[#146C5B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#146C5B]" />
                  {data.statusText}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF5FB] text-[#2980B9]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2980B9]" />
                  {data.statusText}
                </span>
              )}
            </div>
          </div>

          {/* اسم السائق */}
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-gray-400">اسم السائق</span>
            <span className="text-xs font-black text-gray-900 mt-0.5">
              {data.driverName}
            </span>
          </div>

          {/* المسار */}
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-gray-400">المسار</span>
            <span className="text-xs font-black text-gray-900 mt-0.5">
              {data.route}
            </span>
          </div>
        </div>

        {/* Left Cancel Trip Button or Cancelled Badge */}
        <div className="w-full md:w-auto flex justify-end">
          {isCancelled || data.status === "cancelled" ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
              ملغاة
            </span>
          ) : data.status !== "completed" ? (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="flex items-center justify-center gap-2 border border-rose-400 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer w-full md:w-auto"
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>إلغاء الرحلة</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* 4. Middle Section: Summary (Right) & Driver Info Card (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Right: ملخص الرحلة (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900">ملخص الرحلة</h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              جميع بيانات الرحلة الأساسية في مكان واحد.
            </p>
          </div>

          {/* Key-Value Pairs List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 my-5 text-xs">
            {/* نقطة الانطلاق */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">نقطة الانطلاق</span>
              <span className="font-bold text-gray-900">{data.summary.departureCity}</span>
            </div>

            {/* الوجهة */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">الوجهة</span>
              <span className="font-bold text-gray-900">{data.summary.destinationCity}</span>
            </div>

            {/* تاريخ الرحلة */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">تاريخ الرحلة</span>
              <span className="font-bold text-gray-900">{data.summary.tripDate}</span>
            </div>

            {/* الوقت */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">الوقت</span>
              <span className="font-bold text-gray-900">{data.summary.tripTime}</span>
            </div>

            {/* عدد المقاعد */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">عدد المقاعد</span>
              <span className="font-bold text-gray-900">{data.summary.totalSeatsCount}</span>
            </div>

            {/* المقاعد المحجوزة */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">المقاعد المحجوزة</span>
              <span className="font-bold text-gray-900">{data.summary.bookedSeatsCount}</span>
            </div>

            {/* المقاعد المتاحة */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">المقاعد المتاحة</span>
              <span className="font-bold text-gray-900">{data.summary.availableSeatsCount}</span>
            </div>

            {/* سعر المقعد */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">سعر المقعد</span>
              <span className="font-bold text-gray-900">{data.summary.seatPrice}</span>
            </div>

            {/* نوع الرحلة */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">نوع الرحلة</span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                  data.summary.tripType === "متكررة"
                    ? "bg-[#FDEBD0] text-[#D67E10]"
                    : "bg-[#EBF5FB] text-[#2980B9]"
                }`}
              >
                {data.summary.tripType}
              </span>
            </div>

            {/* الجنس */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">الجنس</span>
              <span className="font-bold text-gray-900">{data.summary.gender}</span>
            </div>

            {/* التكرار (إذا كانت الرحلة متكررة) */}
            {data.summary.recurrenceDays && (
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">التكرار</span>
                <span className="font-bold text-gray-900">{data.summary.recurrenceDays}</span>
              </div>
            )}

            {/* تاريخ الانتهاء (إذا كانت الرحلة متكررة) */}
            {data.summary.endDate && (
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">تاريخ الانتهاء</span>
                <span className="font-bold text-gray-900">{data.summary.endDate}</span>
              </div>
            )}
          </div>

          {/* حالة الرحلة bottom row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-900">حالة الرحلة</span>
            {isCancelled || data.summary.status === "ملغاة" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                ملغاة
              </span>
            ) : data.summary.status === "مكتملة" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#146C5B]" />
                {data.summary.status}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5FB] text-[#2980B9]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2980B9]" />
                {data.summary.status}
              </span>
            )}
          </div>

          {/* Blue Info Notice if cancelled by driver */}
          {(isCancelled || data.cancellationDetails?.cancelledBy === "driver") && (
            <div className="mt-3 bg-[#EBF5FB] border border-[#AED6F1] rounded-2xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-[#2980B9]">
              <Info className="w-4 h-4 text-[#2980B9] shrink-0" />
              <span>قام السائق بإلغاء هذه الرحلة.</span>
            </div>
          )}
        </div>

        {/* Left: بيانات السائق (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 mb-2">بيانات السائق</span>

          <div className="flex flex-col items-center text-center">
            {/* Avatar & Name Row */}
            <div className="flex items-center gap-3 w-full justify-start text-right">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                  alt={data.driverInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-gray-900 leading-tight">
                  {data.driverInfo.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-800">{data.driverInfo.rating}</span>
                  <span className="text-gray-400">/ 5.0</span>
                  <span className="text-gray-400">({data.driverInfo.ratingsCount} تقييم)</span>
                </div>
              </div>
            </div>

            {/* Stats Blocks (إجمالي الرحلات / الرحلات المكتملة) */}
            <div className="grid grid-cols-2 gap-3 w-full my-4">
              <div className="bg-gray-50/80 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-gray-900">
                  {data.driverInfo.totalTrips}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  إجمالي الرحلات
                </span>
              </div>
              <div className="bg-gray-50/80 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-gray-900">
                  {data.driverInfo.completedTrips}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  الرحلات المكتملة
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full">
              <Link href={`/drivers/${data.driverInfo.id}`} className="flex-1">
                <Button className="w-full bg-[#146C5B] hover:bg-[#0E4E42] text-white rounded-xl text-xs font-bold h-10 shadow-xs cursor-pointer">
                  عرض السائق
                </Button>
              </Link>
              <button className="w-10 h-10 rounded-xl bg-[#FDEBD0] text-[#D67E10] flex items-center justify-center hover:bg-[#FAD7A0] transition-colors cursor-pointer shrink-0">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-[#E2F1ED] text-[#146C5B] flex items-center justify-center hover:bg-[#C9E7DF] transition-colors cursor-pointer shrink-0">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4.5 Driver Cancellation Reason Section (سبب قيام السائق بإلغاء الرحلة) */}
      {(isCancelled || data.cancellationDetails?.cancelledBy === "driver") && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs flex flex-col gap-4 text-right">
          <div>
            <h2 className="text-sm font-black text-gray-900">
              سبب قيام السائق بإلغاء الرحلة
            </h2>
          </div>

          {/* Radio Options Grid (RTL layout matching the 3 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700">
            {/* Column 1 (Right in RTL): ظرف شخصي طارئ (Selected) & تعذر تنفيذ الرحلة في الموعد */}
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-900">
                <input
                  type="radio"
                  name="driverCancelReason"
                  disabled
                  checked={data.cancellationDetails?.reason === "ظرف شخصي طارئ" || !data.cancellationDetails?.notes}
                  className="w-4 h-4 text-gray-700 accent-gray-700"
                />
                <span>ظرف شخصي طارئ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-500">
                <input
                  type="radio"
                  name="driverCancelReason"
                  disabled
                  checked={false}
                  className="w-4 h-4 text-gray-400 accent-[#146C5B]"
                />
                <span>تعذر تنفيذ الرحلة في الموعد</span>
              </label>
            </div>

            {/* Column 2 (Middle): ظرف صحي طارئ & ظروف الطريق أو الطقس */}
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-500">
                <input
                  type="radio"
                  name="driverCancelReason"
                  disabled
                  checked={false}
                  className="w-4 h-4 text-gray-400 accent-[#146C5B]"
                />
                <span>ظرف صحي طارئ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-500">
                <input
                  type="radio"
                  name="driverCancelReason"
                  disabled
                  checked={false}
                  className="w-4 h-4 text-gray-400 accent-[#146C5B]"
                />
                <span>ظروف الطريق أو الطقس</span>
              </label>
            </div>

            {/* Column 3 (Left): عطل مفاجئ في المركبة & سبب آخر */}
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-500">
                <input
                  type="radio"
                  name="driverCancelReason"
                  disabled
                  checked={false}
                  className="w-4 h-4 text-gray-400 accent-[#146C5B]"
                />
                <span>عطل مفاجئ في المركبة</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-500">
                <input
                  type="radio"
                  name="driverCancelReason"
                  disabled
                  checked={data.cancellationDetails?.reason === "سبب آخر" && !!data.cancellationDetails?.notes}
                  className="w-4 h-4 text-gray-700 accent-gray-700"
                />
                <span>سبب آخر</span>
              </label>
            </div>
          </div>

          {/* Subtitle / Explanation Text Box */}
          {(data.cancellationDetails?.notes || data.cancellationDetails?.reason === "سبب آخر") && (
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[11px] font-bold text-gray-500">
                توضيح السبب الخاص بالسائق لإلغاء الرحلة:
              </span>
              <div className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl p-4 text-xs font-medium text-gray-700 text-right min-h-[70px]">
                {data.cancellationDetails?.notes || "سبب واضح لإلغاء الرحلة"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Passengers & Bookings Table (الركاب والحجوزات المرتبطة) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        {/* Title */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900">
            الركاب والحجوزات المرتبطة
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            3 حجوزات مؤكدة على هذه الرحلة
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-[11px] font-bold">
                <th className="py-3.5 px-4 text-right">الراكب</th>
                <th className="py-3.5 px-4 text-center">عدد المقاعد</th>
                <th className="py-3.5 px-4 text-center">رقم الحجز</th>
                <th className="py-3.5 px-4 text-center">تاريخ الحجز</th>
                <th className="py-3.5 px-4 text-center">رقم الهاتف</th>
                {!isCancelled && data.passengers.some((p) => p.rating) && (
                  <th className="py-3.5 px-4 text-center">التقييم</th>
                )}
                <th className="py-3.5 px-4 text-center">حالة الحجز</th>
                <th className="py-3.5 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-800">
              {data.passengers.map((passenger) => (
                <tr key={passenger.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* الراكب */}
                  <td className="py-4 px-4 text-right font-bold text-gray-900">
                    {passenger.passengerName}
                  </td>

                  {/* عدد المقاعد */}
                  <td className="py-4 px-4 text-center font-bold text-gray-800">
                    {passenger.seatsCount}
                  </td>

                  {/* رقم الحجز */}
                  <td className="py-4 px-4 text-center font-bold text-gray-800">
                    {passenger.bookingNumber}
                  </td>

                  {/* تاريخ الحجز */}
                  <td className="py-4 px-4 text-center text-gray-600">
                    {passenger.bookingDate}
                  </td>

                  {/* رقم الهاتف */}
                  <td className="py-4 px-4 text-center font-semibold text-gray-700" dir="ltr">
                    {passenger.phone}
                  </td>

                  {/* التقييم */}
                  {!isCancelled && data.passengers.some((p) => p.rating) && (
                    <td className="py-4 px-4 text-center">
                      {passenger.rating ? (
                        <div className="inline-flex items-center gap-1 font-bold text-gray-900 text-xs" dir="ltr">
                          <span>{passenger.rating}</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>
                      ) : (
                        <span className="text-gray-400 font-medium">-</span>
                      )}
                    </td>
                  )}

                  {/* حالة الحجز */}
                  <td className="py-4 px-4 text-center">
                    {isCancelled || data.status === "cancelled" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FADBD8] text-[#D9383A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                        ملغاة
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E2F1ED] text-[#146C5B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#146C5B]" />
                        {passenger.statusText}
                      </span>
                    )}
                  </td>

                  {/* إجراء */}
                  <td className="py-4 px-4 text-center">
                    <button className="border border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED]/50 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                      عرض الحجز
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Timeline Section (المسار الزمني للرحلة - Hidden if cancelled) */}
      {!isCancelled && data.status !== "cancelled" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs flex flex-col gap-6">
          <h2 className="text-xs font-bold text-gray-900 text-right">
            المسار الزمني للرحلة
          </h2>

          {/* Stepper (RTL: Step 1 on Right -> Step 4 on Left) */}
          <div className="flex items-center justify-between relative max-w-3xl mx-auto w-full px-4">
            {/* Connecting Line */}
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200 z-0" />

            {data.timeline.map((step) => {
              return (
                <div
                  key={step.stepNumber}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      step.isCompleted
                        ? "bg-[#146C5B] text-white ring-4 ring-white"
                        : "bg-white border-2 border-gray-300 text-gray-500"
                    }`}
                  >
                    {step.isCompleted ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      step.stepNumber
                    )}
                  </div>

                  {/* Title */}
                  <span className="text-xs font-bold text-gray-900 mt-2">
                    {step.title}
                  </span>

                  {/* Date */}
                  <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                    {step.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Cancel Trip Modal */}
      <CancelTripModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      {/* 8. Success / Undo Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#146C5B] text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-4 text-xs font-bold border border-emerald-700/50" dir="rtl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white text-[#146C5B] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-white text-xs font-bold">تم إلغاء الرحلة بنجاح.</span>
            </div>

            <div className="flex items-center gap-3 pr-2 border-r border-emerald-700/60">
              <button
                type="button"
                onClick={handleUndo}
                className="text-[#F1C40F] hover:text-[#F39C12] font-black cursor-pointer transition-colors text-xs"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => setShowToast(false)}
                className="text-white/70 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
