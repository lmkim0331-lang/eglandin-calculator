"use client";

import Image from "next/image";

export default function EgladinDashboard() {
  const apps = [
    { name: "성공 사례", sub: "SUCCESS CASE SHARING", url: "https://script.google.com/macros/s/AKfycbz_O43yef-dlqNJWXAfnNAHZaahxF7LCT1i6qKYYaUPCuMa5rE1qFhUYsx4YVeqxKr1/exec" },
    { name: "Calculator", sub: "DOSAGE & INFUSION", url: "https://eglandin-calculator-egl.vercel.app/" },
    // 요청하신 문구로 수정 완료
    { name: "LT Tracker", sub: "LT CASE MANAGEMENT", url: "https://eglandin-tracker.vercel.app/" },
    { name: "Basic Case", sub: "STANDARD PROTOCOLS", url: "#" },
    { name: "SSNHL IRB", sub: "CLINICAL RESEARCH", url: "#" },
    { name: "학회 일정", sub: "ACADEMIC CALENDAR", url: "#" },
    { name: "공지 사항", sub: "NOTICE", url: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center py-12 px-4">
      <div className="mb-12">
        <Image src="/eglandin-logo.png" alt="Logo" width={300} height={100} priority className="h-auto w-auto" />
      </div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-xl">
        {apps.map((app, index) => (
          <button
            key={index}
            onClick={() => { if (app.url !== "#") window.location.href = app.url; else alert("준비 중입니다."); }}
            // cursor-pointer 추가로 마우스 오버 시 손가락 모양 활성화
            className="group relative bg-white border-l-[12px] border-[#C8202F] p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between text-left active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#C8202F] tracking-widest mb-1 uppercase opacity-80">{app.sub}</span>
              <span className="text-3xl font-black text-[#1D1D1B] tracking-tight">{app.name}</span>
            </div>
            <div className="text-gray-200 group-hover:text-[#C8202F] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 opacity-30 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <footer className="mt-16 text-gray-400 text-xs font-medium tracking-tighter">
        © 2026 EGLANDIN. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}