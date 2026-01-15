'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CalculatorContent() {
  const searchParams = useSearchParams();

  // 1. 상수 설정: 에글란딘 1앰플(2ml) 당 Alprostadil 함량은 10mcg으로 고정
  const MCG_PER_AMP = 10;

  // 입력 필드 상태
  const [weight, setWeight] = useState<number | ''>(60);
  const [unit, setUnit] = useState('amp/d');
  const [durationUnit, setDurationUnit] = useState('day');
  const [duration, setDuration] = useState<number | ''>(7);
  const [dose, setDose] = useState<number | ''>(1);
  const [fluid, setFluid] = useState<number | ''>(100);
  const [price, setPrice] = useState<number | ''>(17548);

  useEffect(() => {
    const u = searchParams.get('unit');
    const d = searchParams.get('dose');
    if (u) setUnit(u);
    if (d) setDose(Number(d));
  }, [searchParams]);

  const results = useMemo(() => {
    if (!weight || !duration || !dose || !fluid || !price) return null;

    // 1. 총 시간 및 일수 환산
    let totalMinutes = 0;
    const durNum = Number(duration);
    if (durationUnit === 'day') totalMinutes = durNum * 24 * 60;
    else if (durationUnit === 'hour') totalMinutes = durNum * 60;
    else totalMinutes = durNum;

    const totalHours = totalMinutes / 60;
    const totalDays = totalMinutes / (24 * 60);

    // 2. 총 Amp 계산 (1 amp = 10mcg 기준)
    let totalAmp = 0;
    const doseNum = Number(dose);
    const weightNum = Number(weight);

    if (unit === 'amp/d') {
      totalAmp = doseNum * totalDays;
    } else if (unit === 'mcg/kg/h') {
      const totalMcg = doseNum * weightNum * totalHours;
      totalAmp = totalMcg / MCG_PER_AMP;
    } else if (unit === 'mcg/kg/min') {
      const totalMcg = doseNum * weightNum * totalMinutes;
      totalAmp = totalMcg / MCG_PER_AMP;
    } else if (unit === 'mcg/kg/d') {
      const totalMcg = doseNum * weightNum * totalDays;
      totalAmp = totalMcg / MCG_PER_AMP;
    }

    // 3. 투여 속도 계산 (수액 주입 속도)
    const mlMin = Number(fluid) / totalMinutes;
    const mlH = mlMin * 60;
    const lH = mlH / 1000;

    return {
      totalAmp: totalAmp.toFixed(2),
      mlMin: mlMin.toFixed(3),
      mlH: mlH.toFixed(2),
      lH: lH.toFixed(4),
      totalCost: Math.round(totalAmp * Number(price))
    };
  }, [weight, unit, durationUnit, duration, dose, fluid, price]);

  const reset = () => {
    setWeight(60); setUnit('amp/d'); setDurationUnit('day'); setDuration(7);
    setDose(1); setFluid(100); setPrice(17548);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* 입력 카드 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 uppercase tracking-tight">Clinical Input</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 underline decoration-red-200 underline-offset-4">환자 체중 (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))} className="input-style" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 underline decoration-red-200 underline-offset-4">프로토콜 단위</label>
            <select value={unit} onChange={e => setUnit(e.target.value)} className="input-style">
              <option value="amp/d">amp/d</option>
              <option value="mcg/kg/h">mcg/kg/h</option>
              <option value="mcg/kg/min">mcg/kg/min</option>
              <option value="mcg/kg/d">mcg/kg/d</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 underline decoration-red-200 underline-offset-4">투여 기간 ({durationUnit})</label>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value === '' ? '' : Number(e.target.value))} className="input-style" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 underline decoration-red-200 underline-offset-4">기간 단위</label>
            <select value={durationUnit} onChange={e => setDurationUnit(e.target.value)} className="input-style">
              <option value="day">day</option>
              <option value="hour">hour</option>
              <option value="minute">minute</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 underline decoration-red-200 underline-offset-4">처방 투여량 ({unit})</label>
          <input type="number" step="0.1" value={dose} onChange={e => setDose(e.target.value === '' ? '' : Number(e.target.value))} className="input-style" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 underline decoration-red-200 underline-offset-4">수액 용량 (ml)</label>
                <input type="number" value={fluid} onChange={e => setFluid(e.target.value === '' ? '' : Number(e.target.value))} className="input-style" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 underline decoration-red-200 underline-offset-4">앰플 가격 (원/1amp)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="input-style" />
            </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Drug Information</p>
            <p className="text-sm text-slate-600 font-medium italic">Eglandin (Alprostadil) 10mcg / 2ml (1 Amp)</p>
        </div>

        <button onClick={reset} className="w-full py-2 text-slate-400 font-medium text-xs hover:text-red-600 transition uppercase tracking-widest">Reset All Data</button>
      </div>

      {/* 결과 카드 */}
      <div className="space-y-6 sticky top-24">
        <div className="bg-red-700 text-white p-8 rounded-2xl shadow-xl shadow-red-200 relative overflow-hidden">
          {/* 장식용 배경 */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          </div>

          <h2 className="text-red-200 text-sm font-bold uppercase tracking-widest mb-6">Calculation Results</h2>
          {results ? (
            <div className="space-y-8">
              <div>
                <p className="text-red-200 text-xs mb-1 font-bold">총 필요 약제 (Total Requirement)</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-6xl font-black tracking-tighter">{results.totalAmp}</p>
                    <p className="text-xl font-bold opacity-70 italic font-mono text-red-100">amp</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-red-600/50 pt-6">
                <div className="text-center md:text-left">
                  <p className="text-red-200 text-[10px] uppercase font-bold mb-1">Rate (ml/min)</p>
                  <p className="text-xl font-bold font-mono tracking-tighter">{results.mlMin}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-red-200 text-[10px] uppercase font-bold mb-1 border-x border-red-500 px-1">Rate (ml/h)</p>
                  <p className="text-xl font-bold font-mono tracking-tighter">{results.mlH}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-red-200 text-[10px] uppercase font-bold mb-1">Rate (L/h)</p>
                  <p className="text-xl font-bold font-mono tracking-tighter">{results.lH}</p>
                </div>
              </div>

              <div className="bg-red-800/40 p-5 rounded-xl border border-red-500/30 backdrop-blur-sm">
                <p className="text-red-200 text-xs mb-1 font-bold">예상 약제 총 비용 (Estimated Cost)</p>
                <p className="text-3xl font-black">₩ {results.totalCost.toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-red-300 italic">모든 값을 입력하면 자동으로 계산됩니다.</div>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
          <span className="text-blue-500 mt-1">⚠️</span>
          <p className="text-blue-800 text-[11px] leading-relaxed">
            <b>의료진 주의사항:</b> 본 계산 결과는 입력된 수치를 기반으로 한 참고용입니다. 에글란딘(Alprostadil) 주입 시 환자의 혈압 및 심박수를 반드시 모니터링하십시오. (기준: 10mcg/2ml per ampoule)
          </p>
        </div>
      </div>

      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 0.85rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          font-weight: 600;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: #1e293b;
        }
        .input-style:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-red-700 font-bold animate-pulse">의료용 계산기 로딩 중...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}