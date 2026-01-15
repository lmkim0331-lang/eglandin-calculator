'use client';

import { useState, useMemo } from 'react';

// 1. 프로토콜 데이터 세트
const PROTOCOLS = [
  { id: 'none', disease: '-- 질환을 선택하세요 --', dosage: '', duration: '', baseUnit: 'amp/d', baseValue: 1 },
  { id: '1', disease: 'LT(간이식)', dosage: '~0.6 mcg/kg/h', duration: 'ABO-C ~7일 / ABO-I ~14일', baseUnit: 'mcg/kg/h', baseValue: 0.6 },
  { id: '2', disease: 'KT(신장이식)', dosage: '1 amp/d', duration: '~7일', baseUnit: 'amp/d', baseValue: 1 },
  { id: '3', disease: 'HSCT(조혈모세포이식)', dosage: '~0.6 mcg/kg/h or 1 mcg/kg/d', duration: '~21일', baseUnit: 'mcg/kg/h', baseValue: 0.6 },
  { id: '4', disease: 'DMF(당뇨발궤양)', dosage: '1 amp/d', duration: '제한 없음', baseUnit: 'amp/d', baseValue: 1 },
  { id: '5', disease: 'PAD(말초혈관질환)', dosage: '1 amp/d', duration: '~28일', baseUnit: 'amp/d', baseValue: 1 },
  { id: '6', disease: 'Free FLAP & Reconstruction', dosage: '1 amp/d', duration: '제한 없음', baseUnit: 'amp/d', baseValue: 1 },
  { id: '7', disease: 'SSNHL(돌발성난청)', dosage: '1 amp/d', duration: '~10일', baseUnit: 'amp/d', baseValue: 1 },
];

export default function DropdownCalculator() {
  const MCG_PER_AMP = 10;

  // 상태 관리
  const [selectedId, setSelectedId] = useState('none');
  const [weight, setWeight] = useState<number | ''>(60);
  const [unit, setUnit] = useState('amp/d');
  const [duration, setDuration] = useState<number | ''>(7);
  const [dose, setDose] = useState<number | ''>(1);
  const [fluid, setFluid] = useState<number | ''>(100);
  const [price, setPrice] = useState<number | ''>(17548);

  // 드롭박스 변경 시 실행되는 함수
  const handleProtocolChange = (id: string) => {
    setSelectedId(id);
    const p = PROTOCOLS.find(item => item.id === id);
    if (p && p.id !== 'none') {
      setUnit(p.baseUnit);
      setDose(p.baseValue);
    }
  };

  const selectedProtocol = PROTOCOLS.find(p => p.id === selectedId);

  // 계산 로직
  const results = useMemo(() => {
    if (!weight || !duration || !dose || !fluid || !price) return null;
    const durNum = Number(duration);
    const weightNum = Number(weight);
    const doseNum = Number(dose);
    let totalAmp = 0;

    if (unit === 'amp/d') totalAmp = doseNum * durNum;
    else if (unit === 'mcg/kg/h') totalAmp = (doseNum * weightNum * (durNum * 24)) / MCG_PER_AMP;
    else if (unit === 'mcg/kg/d') totalAmp = (doseNum * weightNum * durNum) / MCG_PER_AMP;

    return {
      totalAmp: totalAmp.toFixed(2),
      mlH: (Number(fluid) / (durNum * 24)).toFixed(2),
      totalCost: Math.round(totalAmp * Number(price))
    };
  }, [weight, unit, duration, dose, fluid, price]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* 헤더 */}
      <div className="bg-red-700 text-white p-6 rounded-3xl shadow-lg text-center">
        <h1 className="text-2xl font-black uppercase tracking-widest">Eglandin Calculator</h1>
        <p className="text-red-200 text-xs mt-1 font-bold">Clinical Protocol Integrated</p>
      </div>

      {/* 1. 질환 선택 드롭박스 */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Select Disease Protocol</label>
        <select 
          value={selectedId} 
          onChange={(e) => handleProtocolChange(e.target.value)}
          className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold text-slate-700 text-lg focus:ring-2 focus:ring-red-500 transition-all"
        >
          {PROTOCOLS.map(p => (
            <option key={p.id} value={p.id}>{p.disease}</option>
          ))}
        </select>
      </div>

      {/* 2. 질환 정보 안내문 (선택 시에만 나타남) */}
      {selectedProtocol && selectedId !== 'none' && (
        <div className="bg-white border-l-8 border-red-600 p-6 rounded-3xl shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-red-700 font-black text-xl mb-2 flex items-center gap-2">
            <span>📌</span> {selectedProtocol.disease} 가이드라인
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-slate-400 text-[10px] font-bold uppercase">기준 프로토콜</p>
              <p className="text-slate-700 font-bold">{selectedProtocol.dosage}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-slate-400 text-[10px] font-bold uppercase">권장 투여기간</p>
              <p className="text-slate-700 font-bold">{selectedProtocol.duration}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 계산기 입력 및 결과 */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Input</h2>
          <div className="space-y-4">
            <label className="block"><span className="text-xs font-bold text-slate-500 ml-1">환자 체중 (kg)</span>
            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-lg" /></label>
            <div className="grid grid-cols-2 gap-4">
              <label><span className="text-xs font-bold text-slate-500 ml-1">단위</span>
              <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                <option value="amp/d">amp/d</option>
                <option value="mcg/kg/h">mcg/kg/h</option>
                <option value="mcg/kg/d">mcg/kg/d</option>
              </select></label>
              <label><span className="text-xs font-bold text-slate-500 ml-1">투여량</span>
              <input type="number" step="0.1" value={dose} onChange={e => setDose(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-lg" /></label>
            </div>
            <label className="block"><span className="text-xs font-bold text-slate-500 ml-1">투여 기간 (day)</span>
            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-lg" /></label>
          </div>
        </div>

        <div className="bg-red-700 text-white p-10 rounded-3xl shadow-2xl shadow-red-200 flex flex-col justify-between">
          <div>
            <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-6">Result Summary</p>
            {results ? (
              <div className="space-y-8">
                <div>
                  <p className="text-7xl font-black tracking-tighter">{results.totalAmp}<span className="text-2xl opacity-50 ml-2">amp</span></p>
                  <div className="mt-4 flex items-center gap-2 bg-red-800/50 w-fit px-4 py-2 rounded-full border border-red-500/30">
                    <span className="text-xs font-bold">주입 속도</span>
                    <span className="text-xl font-black">{results.mlH} ml/h</span>
                  </div>
                </div>
                <div className="pt-8 border-t border-red-500/50">
                  <p className="text-red-200 text-xs font-bold mb-1">총 예상 비용</p>
                  <p className="text-4xl font-black">₩ {results.totalCost.toLocaleString()}</p>
                </div>
              </div>
            ) : <p className="text-red-300 italic">수치를 입력하면 결과가 표시됩니다.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}