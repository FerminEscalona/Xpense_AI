import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Category, DemoData, initialData, Transaction } from '@/lib/demo';

type Sheet = 'plan' | 'saving' | null;
type ExpenseDraft = { name: string; amount: number; category: Category; payment: boolean };
type DemoContextValue = {
  data: DemoData;
  ready: boolean;
  loggedIn: boolean;
  setupDone: boolean;
  expenseOpen: boolean;
  sheet: Sheet;
  linkOpen: boolean;
  toast: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  openExpense: () => void;
  closeExpense: () => void;
  openSheet: (sheet: Exclude<Sheet, null>) => void;
  closeSheet: () => void;
  skipSetup: () => void;
  /** The three mutators return an error message to show inline, or '' on success. */
  addExpense: (draft: ExpenseDraft) => string;
  updatePlan: (goal: number, income: number) => string;
  addSaving: (amount: number) => string;
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
const SETUP_KEY = 'xpense-demo-setup';

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DemoData>(initialData);
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(DATA_KEY), AsyncStorage.getItem(SESSION_KEY), AsyncStorage.getItem(SETUP_KEY)])
      .then(([savedData, session, setup]) => {
        setSetupDone(setup === 'yes');
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
  const finishSetup = () => {
    setSetupDone(true);
    AsyncStorage.setItem(SETUP_KEY, 'yes').catch(() => {});
  };
  const addExpense = ({ name, amount, category, payment }: ExpenseDraft) => {
    const rounded = Math.round(amount);
    if (!name.trim()) return 'Escribe en qué gastaste.';
    if (!Number.isFinite(rounded) || rounded <= 0) return 'Escribe un valor mayor a cero.';
    if (rounded > data.balance) return 'El valor supera tu saldo disponible.';
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      at: new Date().toISOString(),
      name: name.trim().slice(0, 40),
      amount: rounded,
      category,
      payment,
    };
    setData(current => ({ ...current, balance: current.balance - rounded, transactions: [...current.transactions, transaction] }));
    setExpenseOpen(false);
    notify(payment ? 'Pago simulado y registrado.' : 'Gasto registrado. Tu panorama se actualizó.');
    return '';
  };
  const updatePlan = (goal: number, income: number) => {
    if (![goal, income].every(value => Number.isFinite(value) && value >= 0)) return 'Escribe valores válidos para tu plan.';
    if (goal <= 0) return 'La meta debe ser mayor a cero.';
    setData(current => ({ ...current, goal: Math.round(goal), income: Math.round(income) }));
    finishSetup();
    setSheet(null);
    notify('Tu plan de ahorro se actualizó.');
    return '';
  };
  const addSaving = (amount: number) => {
    const rounded = Math.round(amount);
    if (!Number.isFinite(rounded) || rounded <= 0) return 'Escribe un aporte mayor a cero.';
    if (rounded > data.balance) return 'El aporte supera tu saldo disponible.';
    setData(current => ({ ...current, balance: current.balance - rounded, saved: current.saved + rounded }));
    setSheet(null);
    notify('Aporte registrado: tu meta avanzó.');
    return '';
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

  return <DemoContext.Provider value={{ data, ready, loggedIn, setupDone, expenseOpen, sheet, linkOpen, toast, login, logout,
    openExpense: () => setExpenseOpen(true), closeExpense: () => setExpenseOpen(false),
    openSheet: setSheet, closeSheet: () => setSheet(null), skipSetup: () => { finishSetup(); setSheet(null); },
    addExpense, updatePlan, addSaving, openLink: () => setLinkOpen(true), closeLink: () => setLinkOpen(false),
    linkBank, unlinkBank, notify, reset }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('DemoProvider is required');
  return context;
}
