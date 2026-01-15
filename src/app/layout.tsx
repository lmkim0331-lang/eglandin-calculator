// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  // 메타데이터 타이틀도 살짝 수정했습니다.
  title: "Eglandin Calculator",
  description: "의료용 에글란딘 프로토콜 및 투여 속도 계산기",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <nav className="bg-red-700 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            {/* 여기를 HELPER -> CALCULATOR로 변경했습니다 */}
            <Link href="/" className="font-bold text-lg tracking-tight">EGLANDIN CALCULATOR</Link>
            <div className="space-x-4 text-sm font-medium">
              <Link href="/" className="hover:text-red-200 transition">프로토콜</Link>
              <Link href="/calculator" className="hover:text-red-200 transition">계산기</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}