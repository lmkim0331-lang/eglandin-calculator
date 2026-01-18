// src/types/index.ts

export interface Protocol {
  id: string;
  disease: string;
  dosage: string;
  duration: string;
  // 아래 줄에 'mcg/kg/d' 를 추가했습니다.
  baseUnit: 'amp/d' | 'mcg/kg/h' | 'mcg/kg/min' | 'mcg/kg/d';
  baseValue: number;
}