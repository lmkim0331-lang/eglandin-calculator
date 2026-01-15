'use client';

import { useState, useMemo } from 'react';

// 1. 프로토콜 데이터 (여기에 모든 질환 정보를 저장합니다)
const PROTOCOLS = [
  { id: '1', disease: 'LT(간이식)', dosage: '~0.6 mcg/kg/h', duration: 'ABO-C ~7일 / ABO-I ~14일', baseUnit: 'mcg/kg/h', baseValue: 0.6 },
  { id: '2', disease: 'KT(신장이식)', dosage: '1 amp/d', duration: '~7일', baseUnit: 'amp/d', baseValue: 1 },
  { id: '3', disease: 'HSCT(조혈모세포이식)', dosage: '~0.6 mcg/kg/h or 1 mcg/kg/d', duration: '~21일', baseUnit: 'mcg/kg/h', baseValue: 0.6 },
  { id: '4', disease: 'DMF(당뇨발궤양)', dosage: '1 amp/d', duration: '제한 없음', baseUnit: 'amp/d', baseValue: 1 },
  { id: '5', disease: 'PAD(말초혈관질환)', dosage: '1 amp/d', duration: '~28일', baseUnit: 'amp/d', baseValue: 1 },
  { id: '6', disease: 'Free FLAP & Reconstruction', dosage: '1 amp/d', duration: '제한 없음', baseUnit: 'amp/d', baseValue: 1 },
  { id: '7', disease: 'SSNHL(돌발성난청)', dosage: '1 amp/d', duration: '~10일', baseUnit: 'amp/d', baseValue: 1 },
];

export default function IntegratedPage() {
  const MCG_PER_AMP = 10;

  // 상태 관리
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const [weight, setWeight] = useState<number | ''>(60);
  const [unit, setUnit] = useState('amp/d');
  const [duration, setDuration] = useState<number | ''>(7);
  const [dose, setDose] = useState<number | ''>(1);
  const [fluid, setFluid] = useState<number | ''>(100);
  const [price, setPrice] = useState<number | ''>(17548);

  // [계산기로 적용] 버튼 클릭 시 실행
  const handleApply = (p: any) => {
    setUnit(p.baseUnit);
    setDose(p.baseValue);
    setSelectedInfo(p);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 화면 상단 계산기로 이동
  };

  // 계산 로직
  const results = useMemo(() => {
    if (!weight || !duration || !dose || !fluid || !price) return null;
    const totalDays = Number(duration);
    const totalHours = totalDays * 24;
    let totalAmp = 0;

    if (unit === 'amp/d') totalAmp = Number(dose) * totalDays;
    else if (unit === 'mcg/kg/h') totalAmp = (Number(dose) * Number(weight) * totalHours) / MCG_PER_AMP;
    else if (unit === 'mcg/kg/d') totalAmp = (Number(dose) * Number(weight) * totalDays) / MCG_PER_AMP;

    return {
      totalAmp: totalAmp.toFixed(2),
      mlH: ((Number(fluid) / (totalDays * 24))).toFixed(2),
      totalCost: Math.round(totalAmp * Number(price))
    };
  }, [weight, unit, duration, dose, fluid, price]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-12">
      {/* --- 계산기 섹션 --- */}
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-red-700 uppercase tracking-tighter">Eglandin Calculator</h1>
        
        {/* 질환 안내 박스 */}
        {selectedInfo && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl shadow-sm animate-pulse">
            <p className="font-bold text-red-800 text-lg">📌 적용됨: {selectedInfo.disease}</p>
            <p className="text-sm text-red-600">기준: {selectedInfo.dosage} | 권장기간: {selectedInfo.duration}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* 입력창 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">환자 체중 (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-3 bg-slate-50 rounded-xl border font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">단위</label>
                <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border font-bold">
                  <option value="amp/d">amp/d</option>
                  <option value="mcg/kg/h">mcg/kg/h</option>
                  <option value="mcg/kg/d">mcg/kg/d</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">처방 투여량</label>
                <input type="number" step="0.1" value={dose} onChange={e => setDose(Number(e.target.value))} className="w-full p-3 bg-slate-50 rounded-xl border font-bold" />
              </div>
            </div>
          </div>

          {/* 결과창 */}
          <div className="bg-red-700 text-white p-6 rounded-2xl shadow-xl space-y-4">
            <p className="text-red-200 text-xs font-bold uppercase">Result</p>
            {results ? (
              <>
                <div>
                  <p className="text-4xl font-black">{results.totalAmp} <span className="text-xl opacity-60">amp</span></p>
                  <p className="text-sm opacity-80 mt-1">주입 속도: {results.mlH} ml/h</p>
                </div>
                <div className="pt-4 border-t border-red-500">
                  <p className="text-xs text-red-200">예상 비용</p>
                  <p className="text-2xl font-bold">₩ {results.totalCost.toLocaleString()}</p>
                </div>
              </>
            ) : <p>데이터를 입력하세요.</p>}
          </div>
        </div>
      </div>

      {/* --- 프로토콜 리스트 섹션 --- */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">질환별 프로토콜 가이드</h2>
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold">
              <tr>
                <th className="px-4 py-3">질환명</th>
                <th className="px-4 py-3">기준</th>
                <th className="px-4 py-3">권장 기간</th>
                <th className="px-4 py-3">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PROTOCOLS.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-bold">{p.disease}</td>
                  <td className="px-4 py-4 text-red-600 font-medium">{p.dosage}</td>
                  <td className="px-4 py-4 text-slate-500">{p.duration}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => handleApply(p)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-bold text-xs hover:bg-red-700 hover:text-white transition-all">계산기로 적용</button>
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