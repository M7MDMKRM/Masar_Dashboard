"use client";

import React, { useState } from "react";
import { X, Ban, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalSuspendModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
}

const finalReasons = [
  "تكرار إلغاء الرحلات",
  "انتهاكات متكررة جسيمة",
  "سلوك خطير أثناء الرحلة",
  "مخالفة قواعد المنصة",
  "انتهاك صارم لشروط الاستخدام",
  "أخرى",
];

export function FinalSuspendModal({
  isOpen,
  onClose,
  driverName,
}: FinalSuspendModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const isFormValid = selectedReason.length > 0 && isConfirmed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onClose();
    setSelectedReason("");
    setNotes("");
    setIsConfirmed(false);
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
                إيقاف الحساب نهائيًا
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                هذا إجراء خطير – يُرجى المراجعة الدقيقة قبل التأكيد.
              </p>
            </div>
            {/* أيقونة الحظر الحمراء */}
            <div className="w-12 h-12 rounded-2xl bg-[#FADBD8] flex items-center justify-center text-[#D9383A] shrink-0">
              <Ban className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. سبب الإيقاف النهائي */}
          <div className="flex flex-col gap-2 text-right">
            <label className="text-xs font-bold text-gray-800">
              سبب الإيقاف النهائي <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {finalReasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer border leading-snug ${
                      isSelected
                        ? "bg-[#FADBD8] border-[#D9383A] text-[#D9383A] shadow-xs"
                        : "bg-[#F8F9FA] border-gray-200/80 text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. ملاحظات إضافية */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-xs font-bold text-gray-800">
              ملاحظات إضافية
            </label>
            <textarea
              rows={3}
              placeholder="اكتب تفاصيل إضافية إن وجدت..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-right p-4 rounded-2xl border border-gray-200 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#D9383A] focus:ring-1 focus:ring-[#D9383A] transition-all resize-none bg-white"
            />
          </div>

          {/* 3. شريط التنبيه الأحمر */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl border border-[#D9383A] bg-white text-[#D9383A] text-xs font-bold">
            <div className="flex items-center justify-between w-full">
              <span>سيتم منع السائق من تسجيل الدخول أو استخدام خدمات مسار حتى تقوم الإدارة برفع الإيقاف.</span>
              <AlertCircle className="w-4 h-4 text-[#D9383A] shrink-0 ml-1" />
            </div>
          </div>

          {/* 4. خانة التأكيد (Checkbox) */}
          <div className="flex items-center justify-end gap-2.5 py-1">
            <label
              htmlFor="confirm-final-suspend"
              className="text-xs font-bold text-gray-800 cursor-pointer select-none"
            >
              أؤكد مراجعة سجل الحساب قبل تنفيذ الإجراء.
            </label>
            <button
              type="button"
              id="confirm-final-suspend"
              onClick={() => setIsConfirmed(!isConfirmed)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                isConfirmed
                  ? "bg-[#D9383A] border-[#D9383A] text-white"
                  : "bg-white border-gray-400 hover:border-gray-600"
              }`}
            >
              {isConfirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
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

            {/* زر تأكيد الإيقاف النهائي على اليسار */}
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                isFormValid
                  ? "bg-[#D9383A] hover:bg-[#B52A2C] text-white cursor-pointer"
                  : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
              }`}
            >
              تأكيد الإيقاف النهائي
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
