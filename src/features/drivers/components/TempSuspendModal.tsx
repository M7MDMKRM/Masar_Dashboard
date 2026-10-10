"use client";

import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TempSuspendModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
}

const suspensionReasons = [
  "تكرار إلغاء الرحلات",
  "عدم الالتزام بالمواعيد",
  "سلوك غير لائق",
  "مخالفة قواعد المنصة",
  "شكوى من راكب",
  "أخرى",
];

const durationOptions = [
  "يوم واحد",
  "3 أيام",
  "7 أيام",
  "مدة مخصصة",
];

export function TempSuspendModal({
  isOpen,
  onClose,
  driverName,
}: TempSuspendModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const isFormValid = selectedReason.length > 0 && selectedDuration.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onClose();
    setSelectedReason("");
    setSelectedDuration("");
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col p-6 gap-5 relative border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          {/* زر الإغلاق على اليسار */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* العنوان والأيقونة على اليمين */}
          <div className="flex items-center gap-3 text-right">
            <div className="flex flex-col text-right">
              <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                إيقاف الحساب مؤقتًا
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                يتطلب هذا الإجراء تحديد السبب والمدة.
              </p>
            </div>
            {/* أيقونة التنبيه البرتقالية */}
            <div className="w-12 h-12 rounded-2xl bg-[#FDEBD0] flex items-center justify-center text-[#D67E10] shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. سبب الإيقاف */}
          <div className="flex flex-col gap-2 text-right">
            <label className="text-xs font-bold text-gray-800">
              سبب الإيقاف <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {suspensionReasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer border ${
                      isSelected
                        ? "bg-[#FDEBD0] border-[#D67E10] text-[#D67E10] shadow-xs"
                        : "bg-[#F8F9FA] border-gray-200/80 text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. مدة الإيقاف */}
          <div className="flex flex-col gap-2 text-right">
            <label className="text-xs font-bold text-gray-800">
              مدة الإيقاف <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {durationOptions.map((duration) => {
                const isSelected = selectedDuration === duration;
                return (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setSelectedDuration(duration)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer border ${
                      isSelected
                        ? "bg-[#FDEBD0] border-[#D67E10] text-[#D67E10] shadow-xs"
                        : "bg-[#F8F9FA] border-gray-200/80 text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {duration}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. ملاحظات إضافية */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-xs font-bold text-gray-800">
              ملاحظات إضافية
            </label>
            <textarea
              rows={3}
              placeholder="اكتب تفاصيل إضافية إن وجدت..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-right p-4 rounded-2xl border border-gray-200 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#D67E10] focus:ring-1 focus:ring-[#D67E10] transition-all resize-none bg-white"
            />
          </div>

          {/* 4. تنبيه تحذيري بالأسفل */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl border border-[#D67E10] bg-white text-[#D67E10] text-xs font-bold">
            <div className="flex items-center justify-between w-full">
              <span>لن يتمكن السائق من استخدام تطبيق مسار خلال فترة الإيقاف.</span>
              <AlertTriangle className="w-4 h-4 text-[#D67E10] shrink-0 ml-1" />
            </div>
          </div>

          {/* 5. Action Buttons */}
          <div className="flex items-center justify-between mt-2 pt-1">
            {/* زر إلغاء على اليمين */}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold cursor-pointer"
            >
              إلغاء
            </Button>

            {/* زر تأكيد الإيقاف المؤقت على اليسار */}
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                isFormValid
                  ? "bg-[#D67E10] hover:bg-[#B86B0B] text-white cursor-pointer"
                  : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
              }`}
            >
              تأكيد الإيقاف المؤقت
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
