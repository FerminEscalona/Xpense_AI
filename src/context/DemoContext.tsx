import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Category, DemoData, initialData, PaymentKind, Transaction } from '@/lib/demo';

type ExpenseDraft = { name: string; amount: number; category: Category; payment: boolean };
type DemoContextValue = {
  data: DemoData;
  ready: boolean;
  loggedIn: boolean;
  expenseKind: PaymentKind | 'manual' | null;
  linkOpen: boolean;
  toast: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  openExpense: (kind?: PaymentKind) => void;
  closeExpense: () => void;
  addExpense: (draft: ExpenseDraft) => boolean;
  updatePlan: (goal: number, income: number) => boolean;
  addSaving: (amount: number) => boolean;
  openLink: () => void;
  closeLink: () => void;
  linkBank: (bank: string) => void;
  unlinkBank: () => void;
  notify: (message: string) => void;
  reset: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);
const DATA_KEY = 'xpense-demo-native-v1';
const SESSION_KEY = 'xpense-demo-session';

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DemoData>(initialData);
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [expenseKind, setExpenseKind] = useState<PaymentKind | 'manual' | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(DATA_KEY), AsyncStorage.getItem(SESSION_KEY)])
      .then(([savedData, session]) => {
        if (savedData) {
          const parsed = JSON.parse(savedData) as DemoData;
          if (Array.isArray(parsed.transactions)) setData(parsed);
        }
        setLoggedIn(session === 'yes');
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(DATA_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  const notify = useCallback((message: string) => setToast(message), []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const login = (email: string, password: string) => {
    if (email.trim().toLowerCase() !== 'demo@xpense.app' || password !== 'demo1234') return false;
    setLoggedIn(true);
    AsyncStorage.setItem(SESSION_KEY, 'yes').catch(() => {});
    return true;
  };
  const logout = () => {
    setLoggedIn(false);
    AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
  };
  const addExpense = ({ name, amount, category, payment }: ExpenseDraft) => {
    const rounded = Math.round(amount);
    if (!name.trim() || !Number.isFinite(rounded) || rounded <= 0) {
      notify('Revisa el nombre y el valor del gasto.');
      return false;
    }
    if (rounded > data.balance) {
      notify('El valor supera tu saldo disponible.');
      return false;
    }
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      at: new Date().toISOString(),
      name: name.trim().slice(0, 40),
      amount: rounded,
      category,
      payment,
    };
    setData(current => ({ ...current, balance: current.balance - rounded, transactions: [...current.transactions, transaction] }));
    setExpenseKind(null);
    notify(payment ? 'Pago simulado y registrado.' : 'Gasto registrado. Tu panorama se actualizó.');
    return true;
  };
  const updatePlan = (goal: number, income: number) => {
    if (![goal, income].every(value => Number.isFinite(value) && value >= 0)) {
      notify('Ingresa valores válidos para tu plan.');
      return false;
    }
    setData(current => ({ ...current, goal: Math.round(goal), income: Math.round(income) }));
    notify('Tu plan de ahorro se actualizó.');
    return true;
  };
  const addSaving = (amount: number) => {
    const rounded = Math.round(amount);
    if (!Number.isFinite(rounded) || rounded <= 0) {
      notify('Ingresa un aporte válido.');
      return false;
    }
    if (rounded > data.balance) {
      notify('El aporte supera tu saldo disponible.');
      return false;
    }
    setData(current => ({ ...current, balance: current.balance - rounded, saved: current.saved + rounded }));
    notify('Aporte simulado: tu meta de ahorro avanzó.');
    return true;
  };
  const linkBank = (bank: string) => {
    const now = new Date();
    const autoSamples: [string, number, Category][] = [
      ['Netflix', 24900, 'Otros'], ['Supermercado Ara', 38700, 'Otros'],
      ['Transferencia a Nequi', 50000, 'Otros'], ['Uber', 14200, 'Transporte'],
    ];
    setData(current => {
      let balance = current.balance;
      const additions = autoSamples.map(([name, amount, category], index): Transaction => {
        balance = Math.max(0, balance - amount);
        const at = new Date(now);
        at.setDate(at.getDate() - index);
        at.setHours(10, 0, 0, 0);
        return { id: `auto-${now.getTime()}-${index}`, at: at.toISOString(), name, amount, category, payment: false, source: 'auto' };
      });
      return { ...current, balance, linkedBank: bank, linkedMask: `•••• ${Math.floor(1000 + Math.random() * 9000)}`, linkedAt: now.toISOString(), transactions: [...current.transactions, ...additions] };
    });
  };
  const unlinkBank = () => {
    setData(current => ({ ...current, linkedBank: null, linkedMask: null, linkedAt: null }));
    notify('Cuenta desvinculada de este demo. Vuelves a registrar tus gastos a mano.');
  };
  const reset = () => {
    setData(initialData());
    notify('Los datos de ejemplo se restauraron.');
  };

  return <DemoContext.Provider value={{ data, ready, loggedIn, expenseKind, linkOpen, toast, login, logout,
    openExpense: kind => setExpenseKind(kind || 'manual'), closeExpense: () => setExpenseKind(null),
    addExpense, updatePlan, addSaving, openLink: () => setLinkOpen(true), closeLink: () => setLinkOpen(false),
    linkBank, unlinkBank, notify, reset }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('DemoProvider is required');
  return context;
}
