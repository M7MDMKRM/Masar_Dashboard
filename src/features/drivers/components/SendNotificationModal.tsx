"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
}

const notificationTypes = [
  { label: "تنبيه عام", value: "general" },
  { label: "إشعار رحلة", value: "trip" },
  { label: "تذكير بالتوثيق", value: "verification" },
  { label: "إشعار باقة واشتراك", value: "subscription" },
];

export function SendNotificationModal({
  isOpen,
  onClose,
  driverName,
}: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState("");
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

  if (!isOpen) return null;

  const isFormValid = title.trim().length > 0 && message.trim().length > 0;
  const selectedTypeLabel =
    notificationTypes.find((t) => t.value === selectedType)?.label || "نوع الإشعار";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    // Perform notification sending
    onClose();
    setTitle("");
    setMessage("");
    setSelectedType("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col p-6 gap-6 relative border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header (Matching Screenshot 100%) */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          {/* Close button on Left (RTL End) */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Icon on Right (RTL Start) */}
          <div className="flex items-center gap-3 text-right">
            <div className="flex flex-col text-right">
              <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                إرسال إشعار للسائق
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                سيظهر الإشعار للسائق داخل تطبيق مسار.
              </p>
            </div>
            {/* Green Notification Bell Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#E2F1ED] flex items-center justify-center text-[#146C5B] shrink-0">
              <Bell className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. عنوان الإشعار */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-xs font-bold text-gray-800">
              عنوان الإشعار <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل عنوان الإشعار"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-right px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#146C5B] focus:ring-1 focus:ring-[#146C5B] transition-all bg-white"
            />
          </div>

          {/* 2. نص الإشعار */}
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-xs font-bold text-gray-800">
              نص الإشعار <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="اكتب محتوى الإشعار..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-right p-4 rounded-2xl border border-gray-200 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#146C5B] focus:ring-1 focus:ring-[#146C5B] transition-all resize-none bg-white"
            />
          </div>

          {/* 3. نوع الإشعار (Dropdown) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 transition-all cursor-pointer"
            >
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              <span className={selectedType ? "text-gray-900 font-bold" : "text-gray-400"}>
                {selectedTypeLabel}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 left-0 top-full mt-1 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden flex flex-col">
                {notificationTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-right px-4 py-2.5 text-xs font-bold transition-colors hover:bg-[#E2F1ED]/50 ${
                      selectedType === t.value ? "text-[#146C5B] bg-[#E2F1ED]/30" : "text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons (Matching Screenshot) */}
          <div className="flex items-center justify-between mt-4 pt-2">
            {/* إلغاء on Right (RTL Start) */}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold"
            >
              إلغاء
            </Button>

            {/* إرسال الإشعار on Left (RTL End) */}
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                isFormValid
                  ? "bg-[#146C5B] hover:bg-[#0D4B3F] text-white cursor-pointer"
                  : "bg-[#A3CCC3] text-white/90 cursor-not-allowed opacity-80"
              }`}
            >
              إرسال الإشعار
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
