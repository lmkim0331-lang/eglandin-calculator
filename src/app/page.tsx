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

export default function IntegratedCalculator() {
  const MCG_PER_AMP = 10;

  // 상태 관리
  const [selectedId, setSelectedId] = useState('none');
  const [weight, setWeight] = useState<number | ''>(60);
  const [unit, setUnit] = useState('amp/d');
  const [totalDays, setTotalDays] = useState<number | ''>(7); // 총 치료 기간
  const [dose, setDose] = useState<number | ''>(1);
  const [fluidVolume, setFluidVolume] = useState<number | ''>(100); // 수액량 (ml)
  const [infusionHours, setInfusionHours] = useState<number | ''>(2); // 일일 투여 시간 (hour)
  const [price, setPrice] = useState<number | ''>(17548);

  // 드롭박스 변경 시 실행
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
    if (!weight || !totalDays || !dose || !fluidVolume || !infusionHours || !price) return null;
    
    const weightNum = Number(weight);
    const doseNum = Number(dose);
    const daysNum = Number(totalDays);
    const fluidNum = Number(fluidVolume);
    const hoursNum = Number(infusionHours);

    let totalAmp = 0;

    // 1. 총 필요 앰플 계산 (전체 치료 기간 기준)
    if (unit === 'amp/d') {
      totalAmp = doseNum * daysNum;
    } else if (unit === 'mcg/kg/h') {
      // mcg/kg/h 단위는 하루 24시간 풀 주입 가정 하에 계산하거나, 
      // 실제 주입 시간(hoursNum) 동안만 투여하는 경우로 나뉘나 일반적인 총량 계산식을 따름
      totalAmp = (doseNum * weightNum * 24 * daysNum) / MCG_PER_AMP;
    } else if (unit === 'mcg/kg/d') {
      totalAmp = (doseNum * weightNum * daysNum) / MCG_PER_AMP;
    }

    // 2. 투여 속도 계산 (ml/h) = 수액 용량 / 투여 시간
    const mlPerHour = fluidNum / hoursNum;

    return {
      totalAmp: totalAmp.toFixed(2),
      mlPerHour: mlPerHour.toFixed(2),
      totalCost: Math.round(totalAmp * Number(price))
    };
  }, [weight, unit, totalDays, dose, fluidVolume, infusionHours, price]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="bg-red-700 text-white p-6 rounded-3xl shadow-lg text-center">
        <h1 className="text-2xl font-black uppercase tracking-widest">Eglandin Calculator</h1>
        <p className="text-red-200 text-xs mt-1 font-bold">Fluid Rate & Protocol Integrated</p>
      </div>

      {/* 질환 선택 */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Protocol Selector</label>
        <select value={selectedId} onChange={(e) => handleProtocolChange(e.target.value)} className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold text-slate-700 text-lg">
          {PROTOCOLS.map(p => (<option key={p.id} value={p.id}>{p.disease}</option>))}
        </select>
      </div>

      {/* 안내문 */}
      {selectedProtocol && selectedId !== 'none' && (
        <div className="bg-white border-l-8 border-red-600 p-6 rounded-3xl shadow-md">
          <h3 className="text-red-700 font-black text-xl mb-2 flex items-center gap-2"><span>📌</span> {selectedProtocol.disease} 가이드라인</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl"><p className="text-slate-400 text-[10px] font-bold uppercase">기준 프로토콜</p><p className="text-slate-700 font-bold">{selectedProtocol.dosage}</p></div>
            <div className="bg-slate-50 p-3 rounded-xl"><p className="text-slate-400 text-[10px] font-bold uppercase">권장 투여기간</p><p className="text-slate-700 font-bold">{selectedProtocol.duration}</p></div>
          </div>
        </div>
      )}

      {/* 입력 및 결과 */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Input</h2>
          <div className="space-y-3">
            <label className="block"><span className="text-[11px] font-bold text-slate-500 ml-1">환자 체중 (kg)</span>
            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" /></label>
            
            <div className="grid grid-cols-2 gap-4">
              <label><span className="text-[11px] font-bold text-slate-500 ml-1">단위</span>
              <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                <option value="amp/d">amp/d</option>
                <option value="mcg/kg/h">mcg/kg/h</option>
                <option value="mcg/kg/d">mcg/kg/d</option>
              </select></label>
              <label><span className="text-[11px] font-bold text-slate-500 ml-1">처방 투여량</span>
              <input type="number" step="0.1" value={dose} onChange={e => setDose(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" /></label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label><span className="text-[11px] font-bold text-slate-500 ml-1">수액량 (ml)</span>
              <input type="number" value={fluidVolume} onChange={e => setFluidVolume(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="e.g. 100" /></label>
              <label><span className="text-[11px] font-bold text-slate-500 ml-1">투여 시간 (hour)</span>
              <input type="number" step="0.5" value={infusionHours} onChange={e => setInfusionHours(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="e.g. 2" /></label>
            </div>

            <label className="block"><span className="text-[11px] font-bold text-slate-500 ml-1">총 치료 기간 (day)</span>
            <input type="number" value={totalDays} onChange={e => setTotalDays(Number(e.target.value))} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" /></label>
          </div>
        </div>

        {/* 결과 카드 */}
        <div className="bg-red-700 text-white p-10 rounded-3xl shadow-2xl flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-4">Calculation Results</p>
              {results ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-6xl font-black tracking-tighter">{results.totalAmp}<span className="text-xl opacity-50 ml-2">amp</span></p>
                    <p className="text-red-200 text-xs mt-1 font-bold italic">전체 기간 총 필요량</p>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                    <p className="text-red-100 text-[11px] font-bold uppercase mb-1">Pump Setting (Rate)</p>
                    <p className="text-4xl font-black">{results.mlPerHour} <span className="text-lg opacity-70 ml-1">ml/h</span></p>
                  </div>

                  <div className="pt-6 border-t border-red-500/50">
                    <p className="text-red-200 text-xs font-bold mb-1">총 예상 비용</p>
                    <p className="text-3xl font-black">₩ {results.totalCost.toLocaleString()}</p>
                  </div>
                </div>
              ) : <p className="text-red-300 italic">데이터를 입력해 주세요.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}