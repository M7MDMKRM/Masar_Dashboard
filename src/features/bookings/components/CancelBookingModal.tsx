"use client";

import React, { useState } from "react";
import { X, Ban } from "lucide-react";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => void;
}

const cancelBookingReasonsRow1 = [
  "طلب الراكب إلغاء الحجز",
  "مشكلة في الدفع أو التأكيد",
];

const cancelBookingReasonsRow2 = [
  "مخالفة قواعد المنصة",
  "انتهاك صارم لشروط الاستخدام",
  "أخرى",
];

export function CancelBookingModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const isFormValid = selectedReason.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onConfirm(selectedReason, notes);
    onClose();
    setSelectedReason("");
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col p-6 gap-5 relative border border-gray-100 animate-in zoom-in-95 duration-200 text-right">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          {/* العنوان والأيقونة على اليمين */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FADBD8] flex items-center justify-center text-[#D9383A] shrink-0">
              <Ban className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-right">
              <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                إلغاء الحجز
              </h3>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                أنت على وشك إلغاء هذا الحجز. الرجاء تحديد سبب الإلغاء قبل تنفيذ الإجراء.
              </p>
            </div>
          </div>

          {/* زر الإغلاق على اليسار */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* سبب الإلغاء */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-800">
              سبب الإلغاء <span className="text-rose-500">*</span>
            </label>

            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-2.5">
              {cancelBookingReasonsRow1.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer border leading-snug ${
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

            {/* Row 2 */}
            <div className="grid grid-cols-12 gap-2.5">
              {/* مخالفة قواعد المنصة */}
              <button
                type="button"
                onClick={() => setSelectedReason(cancelBookingReasonsRow2[0])}
                className={`col-span-5 py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer border leading-snug ${
                  selectedReason === cancelBookingReasonsRow2[0]
                    ? "bg-[#FADBD8] border-[#D9383A] text-[#D9383A] shadow-xs"
                    : "bg-[#F8F9FA] border-gray-200/80 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {cancelBookingReasonsRow2[0]}
              </button>

              {/* انتهاك صارم لشروط الاستخدام */}
              <button
                type="button"
                onClick={() => setSelectedReason(cancelBookingReasonsRow2[1])}
                className={`col-span-5 py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer border leading-snug ${
                  selectedReason === cancelBookingReasonsRow2[1]
                    ? "bg-[#FADBD8] border-[#D9383A] text-[#D9383A] shadow-xs"
                    : "bg-[#F8F9FA] border-gray-200/80 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {cancelBookingReasonsRow2[1]}
              </button>

              {/* أخرى */}
              <button
                type="button"
                onClick={() => setSelectedReason(cancelBookingReasonsRow2[2])}
                className={`col-span-2 py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer border leading-snug ${
                  selectedReason === cancelBookingReasonsRow2[2]
                    ? "bg-[#FADBD8] border-[#D9383A] text-[#D9383A] shadow-xs"
                    : "bg-[#F8F9FA] border-gray-200/80 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {cancelBookingReasonsRow2[2]}
              </button>
            </div>
          </div>

          {/* ملاحظات إضافية */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-800">
              ملاحظات إضافية
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب تفاصيل إضافية إن وجدت..."
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D9383A] transition-colors resize-none text-right"
            />
          </div>

          {/* Buttons Footer (RTL: تأكيد الإلغاء on Right, إلغاء on Left) */}
          <div className="flex items-center justify-between pt-2">
            {/* إلغاء on Left */}
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            {/* تأكيد الإلغاء on Right */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isFormValid
                  ? "bg-[#D9383A] hover:bg-[#C0392B] text-white shadow-md shadow-rose-500/20 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              تأكيد الإلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
