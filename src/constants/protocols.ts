import { Protocol } from "../types";

export const PROTOCOLS: Protocol[] = [
  { id: '1', disease: 'LT(간이식)', dosage: '~0.6 mcg/kg/h', duration: 'ABO-C ~7일 / ABO-I ~14일', baseUnit: 'mcg/kg/h', baseValue: 0.6 },
  { id: '2', disease: 'KT(신장이식)', dosage: '1 amp/d', duration: '~7일', baseUnit: 'amp/d', baseValue: 1 },
  { id: '3', disease: 'HSCT(조혈모세포이식)', dosage: '~0.6 mcg/kg/h or 1 mcg/kg/d', duration: '~21일', baseUnit: 'mcg/kg/h', baseValue: 0.6 },
  { id: '4', disease: 'DMF(당뇨발궤양)', dosage: '1 amp/d', duration: '제한 없음', baseUnit: 'amp/d', baseValue: 1 },
  { id: '5', disease: 'PAD(말초혈관질환)', dosage: '1 amp/d', duration: '~28일', baseUnit: 'amp/d', baseValue: 1 },
  { id: '6', disease: 'Free FLAP & Reconstruction(피판술&재건)', dosage: '1 amp/d', duration: '제한 없음', baseUnit: 'amp/d', baseValue: 1 },
  { id: '7', disease: 'SSNHL(돌발성난청)', dosage: '1 amp/d', duration: '~10일', baseUnit: 'amp/d', baseValue: 1 },
];

