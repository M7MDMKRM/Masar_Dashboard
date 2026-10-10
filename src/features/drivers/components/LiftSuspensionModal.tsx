"use client";

import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiftSuspensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LiftSuspensionModal({
  isOpen,
  onClose,
  onConfirm,
}: LiftSuspensionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center gap-4 border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Blue Info Circle Icon */}
        <div className="w-12 h-12 rounded-full border-2 border-[#2E86C1] flex items-center justify-center text-[#2E86C1]">
          <Info className="w-6 h-6 stroke-[2.5]" />
        </div>

        {/* Title and Description */}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-extrabold text-gray-900">
            رفع الإيقاف عن الحساب
          </h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[240px]">
            سيتم إعادة تفعيل حساب المستخدم والسماح له باستخدام خدمات مسار مرة أخرى.
          </p>
        </div>

        {/* Action Buttons: إلغاء on Right (RTL Start), تأكيد رفع الإيقاف on Left (RTL End) */}
        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold"
          >
            إلغاء
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 rounded-xl bg-[#146C5B] hover:bg-[#0D4B3F] text-white text-xs font-bold shadow-2xs cursor-pointer"
          >
            تأكيد رفع الإيقاف
          </Button>
        </div>
      </div>
    </div>
  );
}
