import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDemo } from '@/context/DemoContext';
import { Category, IconName, money, PaymentKind, paymentDefaults } from '@/lib/demo';
import { Button, Choice, colors, Field, FormError, IconTile, Sheet, Text } from './ui';

const categories: Category[] = ['Cafetería', 'Transporte', 'Parqueadero', 'Estudio', 'Otros'];

/* ---------- Registrar gasto ---------- */

export function ExpenseModal() {
  const { expenseOpen } = useDemo();
  return expenseOpen ? <ExpenseContent /> : null;
}

const quick: { kind: PaymentKind; label: string; icon: IconName }[] = [
  { kind: 'cafeteria', label: 'Cafetería', icon: 'cafe-outline' },
  { kind: 'transporte', label: 'Bus', icon: 'bus-outline' },
  { kind: 'parqueadero', label: 'Parqueadero', icon: 'bicycle-outline' },
];

function ExpenseContent() {
  const { closeExpense, addExpense } = useDemo();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Cafetería');
  const [payment, setPayment] = useState(false);
  const [error, setError] = useState('');
  const preset = (kind: PaymentKind) => {
    const item = paymentDefaults[kind];
    setName(item.name); setAmount(String(item.amount)); setCategory(item.category); setPayment(true); setError('');
  };
  return <Sheet close={closeExpense} title="Registrar gasto">
    <Text className="mb-2 font-semi text-sm text-ink">Pago rápido</Text>
    <View className="mb-5 flex-row flex-wrap gap-2">{quick.map(item => <Choice key={item.kind} label={item.label} icon={item.icon} selected={payment && name === paymentDefaults[item.kind].name} onPress={() => preset(item.kind)} />)}</View>
    <Field label="¿En qué gastaste?" value={name} onChangeText={value => { setName(value); setPayment(false); }} placeholder="Ej. Café después de clase" maxLength={40} />
    <Field label="Valor" prefix="$" value={amount} onChangeText={setAmount} placeholder="8000" keyboardType="numeric" />
    <Text className="mb-2 font-semi text-sm text-ink">Categoría</Text>
    <View className="mb-5 flex-row flex-wrap gap-2">{categories.map(item => <Choice key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />)}</View>
    <FormError message={error} />
    <Button label="Guardar gasto" onPress={() => setError(addExpense({ name, amount: Number(amount), category, payment }))} className="w-full" />
  </Sheet>;
}

/* ---------- Plan de ahorro (también es el primer paso al entrar) ---------- */

export function PlanSheet() {
  const { sheet } = useDemo();
  return sheet === 'plan' ? <PlanContent /> : null;
}

function PlanContent() {
  const { data, setupDone, closeSheet, skipSetup, updatePlan } = useDemo();
  const [goal, setGoal] = useState(String(data.goal));
  const [income, setIncome] = useState(String(data.income));
  const [error, setError] = useState('');
  return <Sheet close={setupDone ? closeSheet : skipSetup} title={setupDone ? 'Ajustar mi plan' : 'Empecemos por tu meta'}>
    <Text className="mb-5 text-sm leading-5 text-muted">{setupDone ? 'Cambia tu meta o tu ingreso y tu gemelo recalcula cuánto puedes gastar.' : 'Solo necesitamos dos datos para calcular cuánto puedes gastar cada día.'}</Text>
    <Field label="¿Cuánto quieres ahorrar?" prefix="$" value={goal} onChangeText={setGoal} keyboardType="numeric" helper="Tu meta total de ahorro, en pesos colombianos." />
    <Field label="¿Cuánto recibes a la semana?" prefix="$" value={income} onChangeText={setIncome} keyboardType="numeric" helper="Mesada, beca o ingresos. Puede ser un estimado." />
    <FormError message={error} />
    <Button label={setupDone ? 'Guardar plan' : 'Listo, calcular'} onPress={() => setError(updatePlan(Number(goal), Number(income)))} className="w-full" />
    {!setupDone ? <Button label="Ahora no" variant="ghost" onPress={skipSetup} className="mt-2 w-full" /> : null}
  </Sheet>;
}

/* ---------- Aportar a la meta ---------- */

export function SavingSheet() {
  const { sheet } = useDemo();
  return sheet === 'saving' ? <SavingContent /> : null;
}

function SavingContent() {
  const { data, closeSheet, addSaving } = useDemo();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  return <Sheet close={closeSheet} title="Aportar a mi meta">
    <Text className="mb-4 text-sm leading-5 text-muted">Saldo disponible: <Text className="font-strong text-ink">{money(data.balance)}</Text>. Moverás dinero de tu saldo a tu ahorro.</Text>
    <View className="mb-4 flex-row flex-wrap gap-2">{[10000, 20000, 50000].map(value => <Choice key={value} label={money(value)} selected={amount === String(value)} onPress={() => setAmount(String(value))} />)}</View>
    <Field label="Otro valor" prefix="$" value={amount} onChangeText={setAmount} placeholder="20000" keyboardType="numeric" />
    <FormError message={error} />
    <Button label="Mover a ahorro" onPress={() => setError(addSaving(Number(amount)))} className="w-full" />
  </Sheet>;
}

/* ---------- Vincular banco ---------- */

type LinkStep = 'bank' | 'credentials' | 'consent' | 'success';
const banks: { name: string; kind: string; icon: IconName; background: string; color: string }[] = [
  { name: 'Bancolombia', kind: 'Cuenta de ahorros', icon: 'business-outline', background: '#FEF3C7', color: '#B45309' },
  { name: 'Nequi', kind: 'Billetera digital', icon: 'phone-portrait-outline', background: '#FCE7F3', color: '#BE185D' },
  { name: 'Davivienda', kind: 'Cuenta de ahorros', icon: 'business-outline', background: '#FEE2E2', color: '#B91C1C' },
  { name: 'Nu', kind: 'Cuenta Nu', icon: 'card-outline', background: '#E0F2FE', color: '#0369A1' },
];

export function LinkModal() {
  const { linkOpen } = useDemo();
  return linkOpen ? <LinkFlow /> : null;
}

function LinkFlow() {
  const { closeLink, linkBank } = useDemo();
  const [step, setStep] = useState<LinkStep>('bank');
  const [bank, setBank] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const next = () => {
    if (!user.trim() || !password) { setError('Escribe dos valores inventados para continuar.'); return; }
    setUser(''); setPassword(''); setError(''); setStep('consent');
  };
  const stepNumber = step === 'bank' ? 1 : step === 'credentials' ? 2 : step === 'consent' ? 3 : 3;
  return <Sheet close={closeLink} title={step === 'success' ? '¡Cuenta vinculada!' : 'Vincula tu banco'}>
    {step !== 'success' ? <Text className="mb-4 text-xs text-muted">Paso {stepNumber} de 3 · Simulación sin datos reales</Text> : null}
    {step === 'bank' && <View className="flex-row flex-wrap justify-between gap-y-3">{banks.map(item => <Pressable key={item.name} accessibilityRole="button" onPress={() => { setBank(item.name); setStep('credentials'); }} className="min-h-[140px] w-[48%] rounded-3xl border border-line bg-panel p-4 active:opacity-80"><View className="mb-4"><IconTile icon={item.icon} background={item.background} color={item.color} size={48} /></View><Text className="font-strong text-base text-ink">{item.name}</Text><Text className="mt-1 text-xs leading-[18px] text-muted">{item.kind}</Text></Pressable>)}</View>}
    {step === 'credentials' && <>
      <View className="mb-4 flex-row gap-2 rounded-2xl bg-amber-soft p-3"><Ionicons name="information-circle" size={20} color={colors.amber} /><Text className="flex-1 text-sm leading-5 text-amber">Simulación de {bank}: usa solo datos inventados. No escribas tus credenciales reales.</Text></View>
      <Field label="Usuario de prueba" value={user} onChangeText={setUser} placeholder="Ej. usuario-demo" />
      <Field label="Clave de prueba" value={password} onChangeText={setPassword} placeholder="Cualquier valor inventado" secureTextEntry />
      <FormError message={error} />
      <Button label="Continuar" onPress={next} className="w-full" />
    </>}
    {step === 'consent' && <>
      <Text className="mb-4 text-sm leading-5 text-muted">Xpense solo podrá leer esta información:</Text>
      {['Ver el saldo de tu cuenta', 'Ver el historial de movimientos'].map(item => <View key={item} className="mb-3 flex-row items-center gap-3"><Ionicons name="checkmark-circle" size={24} color={colors.brand} /><Text className="flex-1 text-[15px] text-ink">{item}</Text></View>)}
      <Text className="mb-5 mt-1 text-sm leading-5 text-muted">No puede mover dinero ni hacer pagos o transferencias. Todo es simulado.</Text>
      <Button label="Autorizar y vincular" className="w-full" onPress={() => { linkBank(bank); setStep('success'); }} />
    </>}
    {step === 'success' && <View className="items-center py-3">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-mint"><Ionicons name="checkmark" size={36} color="#047857" /></View>
      <Text className="mb-6 text-center text-[15px] leading-6 text-muted">Tu cuenta quedó vinculada y Xpense ya está trayendo movimientos de ejemplo.</Text>
      <Button label="Ver mi panorama" onPress={closeLink} className="w-full" />
    </View>}
  </Sheet>;
}

/* ---------- Toast ---------- */

export function Toast() {
  const { toast } = useDemo();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return <View pointerEvents="none" accessibilityLiveRegion="polite" style={{ bottom: insets.bottom + 140 }} className="absolute left-5 right-5 flex-row items-center gap-2 rounded-2xl bg-brand-dark px-4 py-3.5">
    <Ionicons name="checkmark-circle" size={20} color="#A7F3D0" /><Text className="flex-1 font-semi text-sm text-white">{toast}</Text>
  </View>;
}
