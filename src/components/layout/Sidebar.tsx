"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  UserCheck,
  Car,
  Ticket,
  GitPullRequest,
  AlertCircle,
  MessageSquare,
  CreditCard,
  LogOut,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

const navSections: NavGroup[] = [
  {
    groupName: "نظرة عامة",
    items: [
      {
        title: "الرئيسية",
        href: "/",
        icon: LayoutGrid,
      },
    ],
  },
  {
    groupName: "إدارة المستخدمين",
    items: [
      {
        title: "السائقون",
        href: "/drivers",
        icon: UserCheck,
      },
      {
        title: "الركاب",
        href: "/passengers",
        icon: Users,
      },
    ],
  },
  {
    groupName: "إدارة الرحلات",
    items: [
      {
        title: "الرحلات",
        href: "/trips",
        icon: Car,
      },
      {
        title: "الحجوزات",
        href: "/bookings",
        icon: Ticket,
      },
      {
        title: "طلبات الرحلات",
        href: "/trip-requests",
        icon: GitPullRequest,
      },
    ],
  },
  {
    groupName: "المتابعة والدعم",
    items: [
      {
        title: "الشكاوى",
        href: "/complaints",
        icon: AlertCircle,
      },
      {
        title: "المحادثات",
        href: "/chats",
        icon: MessageSquare,
      },
    ],
  },
  {
    groupName: "الاشتراكات",
    items: [
      {
        title: "الباقات والمدفوعات",
        href: "/subscriptions",
        icon: CreditCard,
      },
    ],
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white min-h-full border-l border-gray-100 flex flex-col justify-between py-6 px-3 shrink-0 shadow-2xs">
      <nav className="flex flex-col gap-5">
        {navSections.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 px-3 tracking-wide text-right">
              {group.groupName}
            </span>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? "bg-[#196A58] text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Profile card */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-black tracking-widest uppercase shrink-0">
            AMS
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-extrabold text-gray-900 leading-tight">أحمد شلبي</span>
            <span className="text-[10px] font-medium text-gray-400">مدير النظام</span>
          </div>
        </div>
        <button
          title="تسجيل الخروج"
          className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 transform -scale-x-100" />
        </button>
      </div>
    </aside>
  );
}
