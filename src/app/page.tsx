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
  { id: '6', disease: 'Free FLAP & Reconstruction(유리피판&재건)', dosage: '1 amp/d', duration: '제한 없음', baseUnit: 'amp/d', baseValue: 1 },
  { id: '7', disease: 'SSNHL(돌발성난청)', dosage: '1 amp/d', duration: '~10일', baseUnit: 'amp/d', baseValue: 1 },
];

export default function IntegratedCalculator() {
  const MCG_PER_AMP = 10;
  const ML_PER_AMP = 2; // 에글란딘 1앰플 부피 2ml

  const [selectedId, setSelectedId] = useState('none');
  const [weight, setWeight] = useState<number | ''>(60);
  const [unit, setUnit] = useState('amp/d');
  const [totalDays, setTotalDays] = useState<number | ''>(7); 
  const [dose, setDose] = useState<number | ''>(1);
  const [fluidVolume, setFluidVolume] = useState<number | ''>(100); 
  const [infusionHours, setInfusionHours] = useState<number | ''>(2); 
  const [price, setPrice] = useState<number | ''>(17548); // 앰플당 가격

  // 선택된 프로토콜 객체 찾기
  const selectedProtocol = useMemo(() => 
    PROTOCOLS.find(p => p.id === selectedId), 
  [selectedId]);

  const handleProtocolChange = (id: string) => {
    setSelectedId(id);
    const p = PROTOCOLS.find(item => item.id === id);
    if (p && p.id !== 'none') {
      setUnit(p.baseUnit);
      setDose(p.baseValue);
    }
  };

  const results = useMemo(() => {
    if (!weight || !totalDays || !dose || !fluidVolume || !infusionHours || !price) return null;
    
    const weightNum = Number(weight);
    const doseNum = Number(dose);
    const daysNum = Number(totalDays);
    const fluidNum = Number(fluidVolume);
    const hoursNum = Number(infusionHours);

    let dailyAmp = 0;
    if (unit === 'amp/d') {
      dailyAmp = doseNum;
    } else if (unit === 'mcg/kg/h') {
      dailyAmp = (doseNum * weightNum * 24) / MCG_PER_AMP;
    } else if (unit === 'mcg/kg/d') {
      dailyAmp = (doseNum * weightNum) / MCG_PER_AMP;
    }

    const totalAmp = dailyAmp * daysNum;
    const totalInfusionVolume = fluidNum + (dailyAmp * ML_PER_AMP);
    
    const mlPerHour = totalInfusionVolume / hoursNum;
    const mlPerMin = mlPerHour / 60;
    const gttPerMin = (mlPerHour * 20) / 60; // 20 gtt = 1ml 기준

    return {
      totalAmp: totalAmp.toFixed(2),
      mlPerHour: mlPerHour.toFixed(2),
      mlPerMin: mlPerMin.toFixed(3),
      gttPerMin: gttPerMin.toFixed(1),
      totalCost: Math.round(totalAmp * Number(price)),
      dailyAmp: dailyAmp.toFixed(2)
    };
  }, [weight, unit, totalDays, dose, fluidVolume, infusionHours, price]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="bg-red-700 text-white p-6 rounded-3xl shadow-lg text-center">
        <h2 className="text-2xl font-black uppercase tracking-widest">EGLANDIN CALCULATOR</h2>
        <p className="text-red-200 text-xs mt-1 font-bold italic underline underline-offset-4">Precision Infusion Guide</p>
      </div>

      {/* 1. 프로토콜 선택 드롭다운 */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Protocol Selector</label>
        <select 
          value={selectedId} 
          onChange={(e) => handleProtocolChange(e.target.value)} 
          className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold text-slate-700 text-lg focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
        >
          {PROTOCOLS.map(p => (<option key={p.id} value={p.id}>{p.disease}</option>))}
        </select>
      </div>

      {/* 2. 질환별 상세 프로토콜 정보 박스 (질환 선택 시에만 표시) */}
      {selectedProtocol && selectedId !== 'none' && (
        <div className="bg-white border-l-8 border-red-600 p-6 rounded-3xl shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📌</span>
            <h3 className="text-red-700 font-black text-xl uppercase tracking-tight">
              {selectedProtocol.disease} 가이드라인
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-slate-400 text-[10px] font-black uppercase mb-1 tracking-widest">기준 프로토콜 (Dosage)</p>
              <p className="text-slate-800 font-bold text-lg">{selectedProtocol.dosage}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-slate-400 text-[10px] font-black uppercase mb-1 tracking-widest">권장 투여기간 (Duration)</p>
              <p className="text-slate-800 font-bold text-lg">{selectedProtocol.duration}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 입력 및 결과 그리드 */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* 입력 섹션 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Input</h2>
          <div className="space-y-3">
            <label className="block"><span className="text-[11px] font-bold text-slate-500 ml-1">환자 체중 (kg)</span>
            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-4 bg-slate-100 rounded-2xl font-bold focus:bg-white transition-colors" /></label>
            
            <div className="grid grid-cols-2 gap-4">
              <label><span className="text-[11px] font-bold text-slate-500 ml-1">단위</span>
              <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-4 bg-slate-100 rounded-2xl font-bold cursor-pointer">
                <option value="amp/d">amp/d</option>
                <option value="mcg/kg/h">mcg/kg/h</option>
                <option value="mcg/kg/d">mcg/kg/d</option>
              </select></label>
              <label><span className="text-[11px] font-bold text-slate-500 ml-1">일일 처방량</span>
              <input type="number" step="0.1" value={dose} onChange={e => setDose(Number(e.target.value))} className="w-full p-4 bg-slate-100 rounded-2xl font-bold focus:bg-white transition-colors" /></label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label><span className="text-[11px] font-bold text-slate-500 ml-1">수액량 (ml)</span>
              <input type="number" value={fluidVolume} onChange={e => setFluidVolume(Number(e.target.value))} className="w-full p-4 bg-slate-100 rounded-2xl font-bold focus:bg-white transition-colors" /></label>
              <label><span className="text-[11px] font-bold text-slate-500 ml-1">투여 시간 (h/day)</span>
              <input type="number" step="0.5" value={infusionHours} onChange={e => setInfusionHours(Number(e.target.value))} className="w-full p-4 bg-slate-100 rounded-2xl font-bold focus:bg-white transition-colors" /></label>
            </div>

            <label className="block"><span className="text-[11px] font-bold text-slate-500 ml-1">총 치료 기간 (day)</span>
            <input type="number" value={totalDays} onChange={e => setTotalDays(Number(e.target.value))} className="w-full p-4 bg-slate-100 rounded-2xl font-bold focus:bg-white transition-colors" /></label>
          </div>
        </div>

        {/* 결과 카드 */}
        <div className="bg-red-700 text-white p-10 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-8 relative z-10">
            <p className="text-red-200 text-xs font-bold uppercase tracking-widest">Calculation Results</p>
            {results ? (
              <div className="space-y-6">
                <div>
                  <p className="text-6xl font-black tracking-tighter">{results.totalAmp}<span className="text-xl opacity-50 ml-2 italic">amp</span></p>
                  <p className="text-red-200 text-[10px] mt-1 font-bold">총 {totalDays}일 필요량 (일일 {results.dailyAmp} amp)</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                    <p className="text-red-100 text-[10px] font-bold uppercase mb-1">Infusion Rate (ml/h)</p>
                    <p className="text-4xl font-black">{results.mlPerHour} <span className="text-sm opacity-60">ml/h</span></p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                      <p className="text-red-100 text-[10px] font-bold uppercase mb-1">ml/min</p>
                      <p className="text-2xl font-black">{results.mlPerMin}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20 border-l-4 border-l-yellow-400">
                      <p className="text-yellow-200 text-[10px] font-bold uppercase mb-1">Gtt/min</p>
                      <p className="text-2xl font-black">{results.gttPerMin}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-red-500/50">
                  <p className="text-red-200 text-xs font-bold mb-1">총 예상 비용</p>
                  <p className="text-3xl font-black">₩ {results.totalCost.toLocaleString()}</p>
                </div>
              </div>
            ) : <p className="text-red-300 italic animate-pulse">데이터를 입력해 주세요.</p>}
          </div>
        </div>
      </div>

      {/* 4. 하단 정보 박스 */}
      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
        <span className="text-blue-500 text-2xl">💡</span>
        <div className="space-y-2 text-blue-800 text-[11px] leading-relaxed">
          <p className="font-bold text-sm">Clinical Reference & Notes</p>
          <ul className="list-disc ml-4 space-y-1 opacity-90">
            <li><b>약제 부피 보정:</b> 앰플당 2ml 부피를 수액량에 합산하여 주입 속도를 산출합니다.</li>
            <li><b>gtt 계산 기준:</b> 성인용 수액 세트(20 gtt = 1ml) 규격을 기준으로 계산되었습니다.</li>
            <li><b>단가 안내:</b> 1amp 당 17,548원이 적용된 예상 비용입니다.</li>
            <li><b>주의:</b> 모든 수치는 참고용이며 실제 투여 시 환자의 Vital Sign을 상시 모니터링하십시오.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}