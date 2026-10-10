import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "مسار | مسار للرحلات والنقل",
  description: "لوحة تحكم مسار لإدارة الرحلات والمستخدمين والاشتراكات",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen bg-[#F8FAF9] text-gray-800 font-sans antialiased flex flex-col overflow-x-hidden">
        {/* Full width Shared Header at Top */}
        <Header />

        {/* Content Row: Sidebar Right (Hidden on mobile/tablet, visible on desktop), Main Content Left */}
        <div className="flex flex-1 min-h-[calc(100vh-5rem)] w-full">
          <div className="hidden lg:block shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 p-3 sm:p-5 md:p-8 overflow-y-auto w-full min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
