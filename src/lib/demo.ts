import type { Ionicons } from '@expo/vector-icons';
import type React from 'react';

export type Category = 'Cafetería' | 'Transporte' | 'Parqueadero' | 'Estudio' | 'Otros';
export type Period = 'dia' | 'semana' | 'mes';
export type PaymentKind = 'cafeteria' | 'transporte' | 'parqueadero';

export type Transaction = {
  id: string;
  at: string;
  name: string;
  amount: number;
  category: Category;
  payment: boolean;
  source?: 'auto';
};

export type DemoData = {
  balance: number;
  saved: number;
  goal: number;
  income: number;
  linkedBank: string | null;
  linkedMask: string | null;
  linkedAt: string | null;
  transactions: Transaction[];
};

const sample = (days: number, amount: number, name: string, category: Category, payment = false): Transaction => {
  const at = new Date();
  at.setDate(at.getDate() - days);
  at.setHours(12, 0, 0, 0);
  return { id: `seed-${days}-${name}`, at: at.toISOString(), amount, name, category, payment };
};

export function initialData(): DemoData {
  return {
    balance: 245000,
    saved: 85000,
    goal: 200000,
    income: 320000,
    linkedBank: null,
    linkedMask: null,
    linkedAt: null,
    transactions: [
      sample(0, 8500, 'Café y empanada', 'Cafetería', true),
      sample(0, 3200, 'Bus al campus', 'Transporte', true),
      sample(1, 16000, 'Almuerzo en la U', 'Cafetería', true),
      sample(1, 6000, 'Café de la tarde', 'Cafetería', true),
      sample(2, 5000, 'Parqueadero bici', 'Parqueadero', true),
      sample(3, 12000, 'Fotocopias', 'Estudio'),
      sample(4, 7000, 'Snack entre clases', 'Cafetería', true),
      sample(5, 3200, 'Bus al campus', 'Transporte', true),
      sample(6, 9000, 'Desayuno rápido', 'Cafetería', true),
      sample(10, 14000, 'Almuerzo en la U', 'Cafetería', true),
      sample(14, 7000, 'Café y snack', 'Cafetería', true),
      sample(23, 18000, 'Materiales de clase', 'Estudio'),
    ],
  };
}

export const money = (value: number) => '$' + Math.max(0, Math.round(value || 0)).toLocaleString('es-CO');
export const sum = (items: Transaction[]) => items.reduce((total, item) => total + item.amount, 0);
export const sorted = (items: Transaction[]) => [...items].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
export const dayStart = (date: Date | string) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
export function periodTransactions(items: Transaction[], period: Period) {
  const now = new Date();
  const start = dayStart(now);
  return items.filter(item => {
    const date = new Date(item.at);
    const day = dayStart(date);
    if (period === 'dia') return day === start;
    if (period === 'semana') return day >= start - 6 * 86400000 && day <= start;
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
}
export const freeBudget = (data: DemoData) =>
  Math.max(0, Math.min(data.balance, data.income) - Math.max(0, data.goal - data.saved));
export const safeDaily = (data: DemoData) => Math.floor(freeBudget(data) / 7 / 100) * 100;

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export const categoryStyle: Record<Category, { icon: IconName; background: string; color: string; bar: string }> = {
  'Cafetería': { icon: 'cafe-outline', background: '#FEF3C7', color: '#B45309', bar: '#D97706' },
  'Transporte': { icon: 'bus-outline', background: '#E0F2FE', color: '#0369A1', bar: '#0284C7' },
  'Parqueadero': { icon: 'bicycle-outline', background: '#D1FAE5', color: '#047857', bar: '#059669' },
  'Estudio': { icon: 'book-outline', background: '#FCE7F3', color: '#BE185D', bar: '#DB2777' },
  'Otros': { icon: 'receipt-outline', background: '#EEF2F1', color: '#4A6361', bar: '#64748B' },
};

export const MICRO_LIMIT = 10000;

export type Meal = { id: string; icon: IconName; title: string; text: string; moment: string; price: number; compare: number };
export const meals: Meal[] = [
  { id: 'avena', icon: 'sunny-outline', title: 'Avena con fruta y canela', text: 'Energía lenta para llegar a la primera clase.', moment: 'Desayuno', price: 4000, compare: 8000 },
  { id: 'arepa', icon: 'restaurant-outline', title: 'Arepa con huevo y aguacate', text: 'Grasas buenas y proteína para toda la mañana.', moment: 'Desayuno', price: 6000, compare: 11000 },
  { id: 'sandwich', icon: 'fast-food-outline', title: 'Sándwich integral, huevo y fruta', text: 'Sencillo y completo para media jornada.', moment: 'Almuerzo', price: 8000, compare: 14000 },
  { id: 'bowl', icon: 'leaf-outline', title: 'Bowl de arroz, lentejas y vegetales', text: 'Proteína vegetal, fibra y energía para clases.', moment: 'Almuerzo', price: 9000, compare: 16000 },
  { id: 'pollo', icon: 'nutrition-outline', title: 'Ensalada de pollo y quinoa', text: 'Ligera y saciante para días de estudio largo.', moment: 'Almuerzo', price: 12000, compare: 18000 },
];
/** Roughly what one meal can cost so the whole day still fits the safe daily budget. */
export const mealBudget = (data: DemoData) => Math.round(safeDaily(data) * 0.55 / 100) * 100;

export const paymentDefaults: Record<PaymentKind, { title: string; name: string; amount: number; category: Category }> = {
  cafeteria: { title: 'Pagar en cafetería', name: 'Compra en cafetería', amount: 9000, category: 'Cafetería' },
  transporte: { title: 'Pagar bus o transporte', name: 'Viaje en bus', amount: 3200, category: 'Transporte' },
  parqueadero: { title: 'Pagar parqueadero', name: 'Pago de parqueadero', amount: 5000, category: 'Parqueadero' },
};
