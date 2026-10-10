"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  XCircle,
  Check,
  Loader2,
  X,
  Info,
} from "lucide-react";
import { useBookingDetailsData } from "../hooks/use-bookings-data";
import { Button } from "@/components/ui/button";
import { CancelBookingModal } from "./CancelBookingModal";

interface BookingDetailsContentProps {
  id: string;
}

export function BookingDetailsContent({ id }: BookingDetailsContentProps) {
  const { data, isLoading, error } = useBookingDetailsData(id);
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
        <span className="text-sm font-semibold">جاري تحميل تفاصيل الحجز...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium">
        حدث خطأ أثناء تحميل تفاصيل الحجز. يرجى محاولة التحديث مرة أخرى.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-right" dir="rtl">
      {/* 1. Header Row (Breadcrumb + Title on Right, Cancel Button on Left) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Right in RTL: Breadcrumb & Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Link href="/bookings" className="hover:text-gray-600 transition-colors">
              الحجوزات
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 font-bold">تفاصيل الحجز</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            تفاصيل الحجز
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            عرض جميع بيانات الحجز والراكب والرحلة المرتبطة به وإدارة حالة الحجز.
          </p>
        </div>

        {/* Left in RTL: Cancel Booking Button */}
        <div>
          {isCancelled || data.status === "cancelled" ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
              ملغاة
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="flex items-center justify-center gap-2 border border-rose-400 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>إلغاء الحجز</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top 5 Stat Cards Grid (Right to Left) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: إجمالي الحجوزات */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">إجمالي الحجوزات</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2F1ED] text-[#146C5B]">
              +14% ↗
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-1 text-right">
            1,284
          </div>
          <div className="text-[11px] text-gray-400 font-medium text-right leading-tight">
            إجمالي الحجوزات المسجلة على منصة مسار.
          </div>
        </div>

        {/* Card 2: القادمة */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">القادمة</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2F1ED] text-[#146C5B]">
              +12% ↗
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-1 text-right">
            312
          </div>
          <div className="text-[11px] text-gray-400 font-medium text-right leading-tight">
            الحجوزات المرتبطة برحلات لم تبدأ بعد.
          </div>
        </div>

        {/* Card 3: قيد التنفيذ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">قيد التنفيذ</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDEBD0] text-[#D67E10]">
              +4% ↗
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-1 text-right">
            47
          </div>
          <div className="text-[11px] text-gray-400 font-medium text-right leading-tight">
            الحجوزات المرتبطة برحلات يتم تنفيذها حاليًا.
          </div>
        </div>

        {/* Card 4: المكتملة */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">المكتملة</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FADBD8] text-[#D9383A]">
              -8% ↘
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-1 text-right">
            864
          </div>
          <div className="text-[11px] text-gray-400 font-medium text-right leading-tight">
            الحجوزات التي اكتملت رحلاتها بنجاح.
          </div>
        </div>

        {/* Card 5: الملغاة */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-800">الملغاة</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FADBD8] text-[#D9383A]">
              -5% ↘
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight my-1 text-right">
            61
          </div>
          <div className="text-[11px] text-gray-400 font-medium text-right leading-tight">
            الحجوزات التي تم إلغاؤها قبل اكتمال الرحلة.
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid (2 Columns: Right Side 8 Cols, Left Side 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= RIGHT COLUMN (8 Cols) ================= */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Card 1: ملخص الرحلة (ملخص الحجز) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
            <h2 className="text-sm font-black text-gray-900">ملخص الرحلة</h2>

            {/* 3 Columns Key-Value Grid (RTL layout matching image) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-6 text-xs">
              {/* Row 1 / Col 1 (Right): رقم الحجز */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">رقم الحجز</span>
                <span className="font-extrabold text-gray-900 text-sm">{data.bookingNumber}</span>
              </div>

              {/* Row 1 / Col 2 (Middle): رقم الرحلة */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">رقم الرحلة</span>
                <span className="font-extrabold text-gray-900 text-sm">{data.tripNumber}</span>
              </div>

              {/* Row 1 / Col 3 (Left): تاريخ إنشاء الحجز */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">تاريخ إنشاء الحجز</span>
                <span className="font-extrabold text-gray-900 text-sm">{data.bookingDate}</span>
              </div>

              {/* Row 2 / Col 1 (Right): وقت إنشاء الحجز */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">وقت إنشاء الحجز</span>
                <span className="font-extrabold text-gray-900 text-sm">{data.bookingTime}</span>
              </div>

              {/* Row 2 / Col 2 (Middle): عدد المقاعد */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">عدد المقاعد</span>
                <span className="font-extrabold text-gray-900 text-sm">{data.seatsCount}</span>
              </div>

              {/* Row 2 / Col 3 (Left): سعر المقعد */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">سعر المقعد</span>
                <span className="font-extrabold text-gray-900 text-sm">{data.seatPrice}</span>
              </div>

              {/* Row 3 / Col 1 (Right): إجمالي قيمة الحجز */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">إجمالي قيمة الحجز</span>
                <span className="font-extrabold text-gray-900 text-sm">{data.totalAmount}</span>
              </div>

              {/* Row 3 / Col 2 (Middle): حالة الحجز */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">حالة الحجز</span>
                {isCancelled || data.status === "cancelled" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                    ملغاة
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E2F1ED] text-[#146C5B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#146C5B]" />
                    {data.statusText || "مؤكد"}
                  </span>
                )}
              </div>

              {/* Row 3 / Col 3 (Left): طريقة دفع الرحلة */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-gray-400 font-medium">طريقة دفع الرحلة</span>
                <span className="font-extrabold text-gray-900 text-sm">{data.paymentMethod}</span>
              </div>
            </div>

            {/* Blue Notice Bar */}
            <div className="bg-[#EBF5FB] border border-[#AED6F1] rounded-2xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-[#2980B9]">
              <Info className="w-4 h-4 text-[#2980B9] shrink-0" />
              <span>{data.paymentNotice}</span>
            </div>
          </div>

          {/* Card 2: ملخص الرحلة المرتبطة */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-sm font-black text-gray-900">
                ملخص الرحلة المرتبطة
              </h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                جميع بيانات الرحلة الأساسية في مكان واحد.
              </p>
            </div>

            {/* Key-Value Pairs List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-xs">
              {/* نقطة الانطلاق */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">نقطة الانطلاق</span>
                <span className="font-bold text-gray-900">{data.tripSummary.departureCity}</span>
              </div>

              {/* الوجهة */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">الوجهة</span>
                <span className="font-bold text-gray-900">{data.tripSummary.destinationCity}</span>
              </div>

              {/* تاريخ الرحلة */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">تاريخ الرحلة</span>
                <span className="font-bold text-gray-900">{data.tripSummary.tripDate}</span>
              </div>

              {/* الوقت */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">الوقت</span>
                <span className="font-bold text-gray-900">{data.tripSummary.tripTime}</span>
              </div>

              {/* عدد المقاعد */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">عدد المقاعد</span>
                <span className="font-bold text-gray-900">{data.tripSummary.totalSeats}</span>
              </div>

              {/* المقاعد المحجوزة */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">المقاعد المحجوزة</span>
                <span className="font-bold text-gray-900">{data.tripSummary.bookedSeats}</span>
              </div>

              {/* المقاعد المتاحة */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">المقاعد المتاحة</span>
                <span className="font-bold text-gray-900">{data.tripSummary.availableSeats}</span>
              </div>

              {/* سعر المقعد */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">سعر المقعد</span>
                <span className="font-bold text-gray-900">{data.tripSummary.seatPrice}</span>
              </div>

              {/* نوع الرحلة */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">نوع الرحلة</span>
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#EBF5FB] text-[#2980B9]">
                  {data.tripSummary.tripType}
                </span>
              </div>

              {/* الجنس */}
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">الجنس</span>
                <span className="font-bold text-gray-900">{data.tripSummary.gender}</span>
              </div>
            </div>

            {/* Blue Notice if cancelled by driver */}
            {(isCancelled || data.cancelledBy === "driver" || data.tripSummary.status === "ملغاة") && (
              <div className="bg-[#EBF5FB] border border-[#AED6F1] rounded-2xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-[#2980B9]">
                <Info className="w-4 h-4 text-[#2980B9] shrink-0" />
                <span>قام السائق بإلغاء هذه الرحلة.</span>
              </div>
            )}

            {/* Button: عرض الرحلة (Only shown when cancelled by driver/trip cancelled) */}
            {(isCancelled || data.cancelledBy === "driver" || data.tripSummary.status === "ملغاة") && (
              <div>
                <Link href={`/trips/${data.tripNumber}`}>
                  <Button
                    variant="outline"
                    className="w-full border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED] rounded-xl text-xs font-bold h-10 cursor-pointer"
                  >
                    عرض الرحلة
                  </Button>
                </Link>
              </div>
            )}

            {/* حالة الرحلة bottom row */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-900">حالة الرحلة</span>
              {data.tripSummary.status === "ملغاة" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FADBD8] text-[#D9383A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                  ملغاة
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5FB] text-[#2980B9]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2980B9]" />
                  {data.tripSummary.status}
                </span>
              )}
            </div>
          </div>

          {/* Card 3: بيانات الراكب (Shown in right column only if NOT cancelled by driver) */}
          {!(isCancelled || data.cancelledBy === "driver") && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
              <h2 className="text-sm font-black text-gray-900">بيانات الراكب</h2>

              {/* 3 Columns Key-Value Grid matching image (RTL) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-6 text-xs">
                {/* Row 1 / Col 1 (Right): الاسم الكامل */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-medium">الاسم الكامل</span>
                  <span className="font-extrabold text-gray-900 text-xs">{data.passenger.name}</span>
                </div>

                {/* Row 1 / Col 2 (Middle): تاريخ التسجيل */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-medium">تاريخ التسجيل</span>
                  <span className="font-extrabold text-gray-900 text-xs">{data.passenger.registrationDate}</span>
                </div>

                {/* Row 1 / Col 3 (Left): رقم الهاتف */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-medium">رقم الهاتف</span>
                  <span className="font-extrabold text-gray-900 text-xs" dir="ltr">{data.passenger.phone}</span>
                </div>

                {/* Row 2 / Col 1 (Right): العمر */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-medium">العمر</span>
                  <span className="font-extrabold text-gray-900 text-xs">{data.passenger.age}</span>
                </div>

                {/* Row 2 / Col 2 (Middle): آخر نشاط */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-medium">آخر نشاط</span>
                  <span className="font-extrabold text-gray-900 text-xs">{data.passenger.lastActive}</span>
                </div>

                {/* Row 2 / Col 3 (Left): المدينة */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-400 font-medium">المدينة</span>
                  <span className="font-extrabold text-gray-900 text-xs">{data.passenger.city}</span>
                </div>
              </div>

              {/* Action Button: عرض الراكب */}
              <div className="pt-2">
                <Link href={`/passengers/${data.passenger.id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED] rounded-xl text-xs font-bold h-10 cursor-pointer"
                  >
                    عرض الراكب
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ================= LEFT COLUMN (4 Cols) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card 1: المسار الزمني للرحلة (Shown only if NOT cancelled by driver) */}
          {!(isCancelled || data.cancelledBy === "driver") && data.timeline.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col gap-4">
              <h2 className="text-xs font-bold text-gray-900">
                المسار الزمني للرحلة
              </h2>

              {/* Vertical Stepper (RTL: right side line and circles) */}
              <div className="flex flex-col relative pr-1">
                {/* Connecting vertical line */}
                <div className="absolute top-5 bottom-6 right-[17px] w-0.5 bg-[#146C5B]/30 z-0" />

                {data.timeline.map((step, idx) => {
                  const isLast = idx === data.timeline.length - 1;
                  return (
                    <div
                      key={step.stepNumber}
                      className={`flex items-start gap-4 relative z-10 ${isLast ? "pb-0" : "pb-7"}`}
                    >
                      {/* Step Circle */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          step.isCompleted
                            ? "bg-[#146C5B] text-white shadow-xs"
                            : step.isActive
                            ? "bg-[#7DB5A9] text-white"
                            : "bg-white border-2 border-gray-300 text-gray-500"
                        }`}
                      >
                        {step.isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          step.stepNumber
                        )}
                      </div>

                      {/* Text Content */}
                      <div className="flex flex-col pt-0.5">
                        <span className="text-xs font-bold text-gray-900">
                          {step.title}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                          {step.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card 2: بيانات السائق */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col gap-3">
            <h2 className="text-xs font-bold text-gray-900">بيانات السائق</h2>

            {/* Key-Value list */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">الاسم الكامل</span>
                <span className="font-bold text-gray-900">{data.driver.name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">رقم الهاتف</span>
                <span className="font-bold text-gray-900" dir="ltr">{data.driver.phone}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">العمر</span>
                <span className="font-bold text-gray-900">{data.driver.age}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">تاريخ التسجيل</span>
                <span className="font-bold text-gray-900">{data.driver.registrationDate}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">آخر نشاط</span>
                <span className="font-bold text-gray-900">{data.driver.lastActive}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">المدينة</span>
                <span className="font-bold text-gray-900">{data.driver.city}</span>
              </div>
            </div>

            {/* Action Button: عرض السائق */}
            <div className="pt-2">
              <Link href={`/drivers/${data.driver.id}`}>
                <Button
                  variant="outline"
                  className="w-full border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED] rounded-xl text-xs font-bold h-10 cursor-pointer"
                >
                  عرض السائق
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 3: إحصائيات النشاط الخاصة بالراكب */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col gap-3">
            <h2 className="text-xs font-bold text-gray-900">
              إحصائيات النشاط الخاصة بالراكب
            </h2>

            <div className="grid grid-cols-2 gap-3 my-1">
              <div className="bg-gray-50/80 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-gray-900">
                  {data.passengerStats.totalBookings}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  إجمالي الحجوزات
                </span>
              </div>
              <div className="bg-gray-50/80 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-gray-900">
                  {data.passengerStats.completedTrips}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  الرحلات المكتملة
                </span>
              </div>
              <div className="bg-gray-50/80 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-gray-900">
                  {data.passengerStats.cancelledBookings}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  الحجوزات الملغاة
                </span>
              </div>
              <div className="bg-gray-50/80 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-gray-900">
                  {data.passengerStats.tripRequests}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  طلبات الرحلات
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: آخر حجز للراكب */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900">آخر حجز للراكب</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E2F1ED] text-[#146C5B]">
                {data.latestPassengerBooking.statusText}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">المسار</span>
                <span className="font-bold text-gray-900">{data.latestPassengerBooking.route}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">التاريخ</span>
                <span className="font-bold text-gray-900">{data.latestPassengerBooking.date}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
                <span className="text-gray-400 font-medium">المقاعد</span>
                <span className="font-bold text-gray-900">{data.latestPassengerBooking.seats}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full-Width Passenger Details Card (Rendered at bottom when cancelled by driver or passenger) */}
      {(isCancelled || data.cancelledBy === "driver" || data.cancelledBy === "passenger") && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col gap-4">
          <h2 className="text-sm font-black text-gray-900">بيانات الراكب</h2>

          {/* Key-Value Pairs List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-xs">
            {/* الاسم الكامل */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">الاسم الكامل</span>
              <span className="font-bold text-gray-900">{data.passenger.name}</span>
            </div>

            {/* رقم الهاتف */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">رقم الهاتف</span>
              <span className="font-bold text-gray-900" dir="ltr">{data.passenger.phone}</span>
            </div>

            {/* العمر */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">العمر</span>
              <span className="font-bold text-gray-900">{data.passenger.age}</span>
            </div>

            {/* تاريخ التسجيل */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">تاريخ التسجيل</span>
              <span className="font-bold text-gray-900">{data.passenger.registrationDate}</span>
            </div>

            {/* آخر نشاط */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">آخر نشاط</span>
              <span className="font-bold text-gray-900">{data.passenger.lastActive}</span>
            </div>

            {/* المدينة */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="text-gray-400 font-medium">المدينة</span>
              <span className="font-bold text-gray-900">{data.passenger.city}</span>
            </div>
          </div>

          {/* Action Button: عرض الراكب */}
          <div className="pt-2">
            <Link href={`/passengers/${data.passenger.id}`}>
              <Button
                variant="outline"
                className="w-full border-[#146C5B] text-[#146C5B] hover:bg-[#E2F1ED] rounded-xl text-xs font-bold h-10 cursor-pointer"
              >
                عرض الراكب
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 5. Passenger Cancellation Reason Card (سبب قيام الراكب بإلغاء الحجز) */}
      {(data.cancelledBy === "passenger" || data.passengerCancellation) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs flex flex-col gap-4">
          <h2 className="text-sm font-black text-gray-900">
            سبب قيام الراكب بإلغاء الحجز
          </h2>

          {/* 7 Radio Options Grid in 3 Columns (RTL: Column 1 on Right, Column 2 in Middle, Column 3 on Left) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3.5 gap-x-6 text-xs">
            {/* Row 1 / Column 1 (Right): تغير موعدي */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-default">
              <input
                type="radio"
                name="passenger_reason_display"
                checked={data.passengerCancellation?.selectedReason === "تغير موعدي"}
                readOnly
                className="w-4 h-4 text-[#146C5B] accent-[#146C5B] cursor-default"
              />
              <span>تغير موعدي</span>
            </label>

            {/* Row 1 / Column 2 (Middle): لم أعد بحاجة إلى الرحلة */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-default">
              <input
                type="radio"
                name="passenger_reason_display"
                checked={data.passengerCancellation?.selectedReason === "لم أعد بحاجة إلى الرحلة"}
                readOnly
                className="w-4 h-4 text-[#146C5B] accent-[#146C5B] cursor-default"
              />
              <span>لم أعد بحاجة إلى الرحلة</span>
            </label>

            {/* Row 1 / Column 3 (Left): وجدت رحلة أخرى */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-default">
              <input
                type="radio"
                name="passenger_reason_display"
                checked={data.passengerCancellation?.selectedReason === "وجدت رحلة أخرى"}
                readOnly
                className="w-4 h-4 text-[#146C5B] accent-[#146C5B] cursor-default"
              />
              <span>وجدت رحلة أخرى</span>
            </label>

            {/* Row 2 / Column 1 (Right): نقطة الانطلاق غير مناسبة */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-default">
              <input
                type="radio"
                name="passenger_reason_display"
                checked={data.passengerCancellation?.selectedReason === "نقطة الانطلاق غير مناسبة"}
                readOnly
                className="w-4 h-4 text-[#146C5B] accent-[#146C5B] cursor-default"
              />
              <span>نقطة الانطلاق غير مناسبة</span>
            </label>

            {/* Row 2 / Column 2 (Middle): مشكلة في التواصل مع السائق */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-default">
              <input
                type="radio"
                name="passenger_reason_display"
                checked={data.passengerCancellation?.selectedReason === "مشكلة في التواصل مع السائق"}
                readOnly
                className="w-4 h-4 text-[#146C5B] accent-[#146C5B] cursor-default"
              />
              <span>مشكلة في التواصل مع السائق</span>
            </label>

            {/* Row 2 / Column 3 (Left): تغير مساري */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-default">
              <input
                type="radio"
                name="passenger_reason_display"
                checked={data.passengerCancellation?.selectedReason === "تغير مساري"}
                readOnly
                className="w-4 h-4 text-[#146C5B] accent-[#146C5B] cursor-default"
              />
              <span>تغير مساري</span>
            </label>

            {/* Row 3 / Column 1 (Right): ظرف شخصي طارئ */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-default">
              <input
                type="radio"
                name="passenger_reason_display"
                checked={data.passengerCancellation?.selectedReason === "ظرف شخصي طارئ"}
                readOnly
                className="w-4 h-4 text-[#146C5B] accent-[#146C5B] cursor-default"
              />
              <span>ظرف شخصي طارئ</span>
            </label>

            {/* Row 3 / Column 2 (Middle): سبب آخر */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-default">
              <input
                type="radio"
                name="passenger_reason_display"
                checked={data.passengerCancellation?.selectedReason === "سبب آخر"}
                readOnly
                className="w-4 h-4 text-[#146C5B] accent-[#146C5B] cursor-default"
              />
              <span>سبب آخر</span>
            </label>
          </div>

          {/* Explanation text box (only shown when 'سبب آخر' is selected or explanation exists) */}
          {data.passengerCancellation?.selectedReason === "سبب آخر" && (
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-xs font-bold text-gray-800">
                توضيح السبب الخاص بالراكب لإلغاء الحجز
              </span>
              <div className="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs text-gray-500 font-medium min-h-[90px]">
                {data.passengerCancellation?.explanation || "سبب واضح لإلغاء الحجز"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      {/* 6. Success / Undo Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#146C5B] text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-4 text-xs font-bold border border-emerald-700/50" dir="rtl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white text-[#146C5B] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-white text-xs font-bold">تم إلغاء الحجز بنجاح.</span>
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
