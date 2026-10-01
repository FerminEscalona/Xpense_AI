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

export const categoryStyle: Record<Category, { emoji: string; background: string; bar: string }> = {
  'Cafetería': { emoji: '☕', background: '#ffe8db', bar: '#786be3' },
  'Transporte': { emoji: '🚌', background: '#e5f2fc', bar: '#7ac5b1' },
  'Parqueadero': { emoji: '🚲', background: '#d5f5e7', bar: '#f4b68e' },
  'Estudio': { emoji: '📚', background: '#eeebff', bar: '#8db8ee' },
  'Otros': { emoji: '🧾', background: '#f0efed', bar: '#b6b6c4' },
};

export const paymentDefaults: Record<PaymentKind, { title: string; name: string; amount: number; category: Category }> = {
  cafeteria: { title: 'Pagar en cafetería', name: 'Compra en cafetería', amount: 9000, category: 'Cafetería' },
  transporte: { title: 'Pagar bus o transporte', name: 'Viaje en bus', amount: 3200, category: 'Transporte' },
  parqueadero: { title: 'Pagar parqueadero', name: 'Pago de parqueadero', amount: 5000, category: 'Parqueadero' },
};
