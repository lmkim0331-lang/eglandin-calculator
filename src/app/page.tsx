'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROTOCOLS } from '@/constants/protocols';

export default function ProtocolPage() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filtered = PROTOCOLS.filter(p => 
    p.disease.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (p: typeof PROTOCOLS[0]) => {
    // 쿼리 파라미터로 계산기에 값 전달
    const params = new URLSearchParams({
      unit: p.baseUnit,
      dose: p.baseValue.toString()
    });
    router.push(`/calculator?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-red-800">질환별 프로토콜 가이드</h1>
        <p className="text-slate-500 text-sm">표준 기준이며 환자 상태에 따라 조절이 필요할 수 있습니다.</p>
      </div>

      <div className="relative">
        <input 
          type="text"
          placeholder="질환명을 검색하세요..."
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-4 font-semibold">질환명</th>
                <th className="px-4 py-4 font-semibold">기준 프로토콜</th>
                <th className="px-4 py-4 font-semibold">권장 기간</th>
                <th className="px-4 py-4 font-semibold">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-red-50/30 transition">
                  <td className="px-4 py-4 font-medium text-slate-800">{p.disease}</td>
                  <td className="px-4 py-4 text-red-700 font-mono">{p.dosage}</td>
                  <td className="px-4 py-4 text-slate-600">{p.duration}</td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => handleSelect(p)}
                      className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition"
                    >
                      계산기로 적용
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
