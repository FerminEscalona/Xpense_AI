import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDemo } from '@/context/DemoContext';
import { Category, PaymentKind, paymentDefaults } from '@/lib/demo';
import { Button, Field } from './ui';

const categories: Category[] = ['Cafetería', 'Transporte', 'Parqueadero', 'Estudio', 'Otros'];

function ModalFrame({ visible, close, title, children }: { visible: boolean; close: () => void; title: string; children: React.ReactNode }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end bg-[#19182d77]">
      <Pressable onPress={close} className="absolute inset-0" accessibilityLabel="Cerrar" />
      <View className="max-h-[92%] rounded-t-[25px] bg-panel px-5 pb-8 pt-5"><View className="mb-4 flex-row items-center justify-between"><Text className="text-xl font-extrabold text-ink">{title}</Text><Pressable onPress={close} accessibilityLabel="Cerrar" className="h-8 w-8 items-center justify-center rounded-lg bg-[#f1f0ed]"><Ionicons name="close" size={20} color="#78788a" /></Pressable></View><ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView></View>
    </KeyboardAvoidingView>
  </Modal>;
}

export function ExpenseModal() {
  const { expenseKind } = useDemo();
  return expenseKind ? <ExpenseContent key={expenseKind} kind={expenseKind} /> : null;
}

function ExpenseContent({ kind }: { kind: PaymentKind | 'manual' }) {
  const { closeExpense, addExpense } = useDemo();
  const payment = kind !== 'manual' ? paymentDefaults[kind] : null;
  const [name, setName] = useState(payment?.name || '');
  const [amount, setAmount] = useState(payment ? String(payment.amount) : '');
  const [category, setCategory] = useState<Category>(payment?.category || 'Cafetería');
  return <ModalFrame visible close={closeExpense} title={payment?.title || 'Registrar gasto'}>
    <Text className="mb-4 text-xs leading-[19px] text-muted">{payment ? 'Simula el pago y descubre cómo afecta tu saldo.' : 'Añade un gasto para ver cómo cambia tu panorama.'}</Text>
    <Field label="Concepto" value={name} onChangeText={setName} placeholder="Ej. Café después de clase" maxLength={40} />
    <Field label="Valor (COP)" value={amount} onChangeText={setAmount} placeholder="8000" keyboardType="numeric" />
    <Text className="mb-2 text-[11px] font-extrabold text-[#6c6d80]">Categoría</Text>
    <View className="mb-5 flex-row flex-wrap gap-2">{categories.map(item => <Pressable key={item} onPress={() => setCategory(item)} className={`rounded-full px-3 py-2 ${category === item ? 'bg-purple' : 'bg-lavender'}`}><Text className={`text-xs font-bold ${category === item ? 'text-white' : 'text-purple'}`}>{item}</Text></Pressable>)}</View>
    <Button label={payment ? 'Simular pago' : 'Registrar gasto'} onPress={() => addExpense({ name, amount: Number(amount), category, payment: !!payment })} className="w-full" />
  </ModalFrame>;
}

type LinkStep = 'bank' | 'credentials' | 'consent' | 'success';
const banks = [
  { name: 'Bancolombia', kind: 'Cuenta de ahorros', icon: '🏦', color: '#ffe8db' },
  { name: 'Nequi', kind: 'Billetera digital', icon: '📱', color: '#e5f2fc' },
  { name: 'Davivienda', kind: 'Cuenta de ahorros', icon: '🏦', color: '#d5f5e7' },
  { name: 'Nu', kind: 'Cuenta Nu', icon: '💜', color: '#eeebff' },
];

export function LinkModal() {
  const { linkOpen } = useDemo();
  return linkOpen ? <LinkFlow /> : null;
}

function LinkFlow() {
  const { closeLink, linkBank, notify } = useDemo();
  const [step, setStep] = useState<LinkStep>('bank');
  const [bank, setBank] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const finish = () => {
    if (!user.trim() || !password) { notify('Escribe dos valores inventados para continuar con el demo.'); return; }
    setUser('');
    setPassword('');
    setStep('consent');
  };
  return <ModalFrame visible close={closeLink} title={step === 'success' ? '¡Cuenta vinculada!' : 'Vincula tu banco'}>
    {step === 'bank' && <><Text className="mb-4 text-xs leading-[19px] text-muted">Elige tu banco para simular la conexión. Demo: no se envía ni se guarda ningún dato real.</Text><View className="flex-row flex-wrap justify-between gap-y-3">{banks.map(item => <Pressable key={item.name} onPress={() => { setBank(item.name); setStep('credentials'); }} className="w-[48%] min-h-[150px] rounded-[20px] border border-line bg-panel p-4"><View style={{ backgroundColor: item.color }} className="mb-4 h-12 w-12 items-center justify-center rounded-2xl"><Text className="text-2xl">{item.icon}</Text></View><Text className="text-sm font-extrabold text-ink">{item.name}</Text><Text className="mt-1 text-xs leading-[18px] text-muted">{item.kind}</Text></Pressable>)}</View></>}
    {step === 'credentials' && <><View className="mb-4 rounded-xl bg-peach p-3"><Text className="text-xs font-bold leading-[19px] text-[#a75836]">Simulación de {bank}: usa solo datos inventados. No escribas tus credenciales bancarias reales.</Text></View><Field label="Usuario de prueba" value={user} onChangeText={setUser} placeholder="Ej. usuario-demo" /><Field label="Clave de prueba" value={password} onChangeText={setPassword} placeholder="Cualquier valor inventado" secureTextEntry /><Button label="Continuar" onPress={finish} className="mt-2 w-full" /></>}
    {step === 'consent' && <><Text className="mb-4 text-xs leading-[19px] text-muted">Autoriza qué datos quieres compartir con Xpense en esta simulación:</Text><View className="mb-3 flex-row items-center gap-2"><Ionicons name="checkbox" size={22} color="#6759d8" /><Text className="text-[13px] text-ink">Ver el saldo de tu cuenta</Text></View><View className="mb-4 flex-row items-center gap-2"><Ionicons name="checkbox" size={22} color="#6759d8" /><Text className="text-[13px] text-ink">Ver el historial de movimientos</Text></View><View className="mb-4 rounded-xl bg-[#f8f7f3] p-4"><Text className="text-xs leading-[19px] text-muted">En el flujo representado, Xpense solo puede leer tu información. No puede mover dinero, hacer pagos ni transferencias desde tu cuenta. Aquí todo es simulado.</Text></View><Button label="Autorizar y vincular" className="w-full" onPress={() => { linkBank(bank); setStep('success'); }} /></>}
    {step === 'success' && <View className="items-center py-3"><Text className="mb-2 text-5xl">🎉</Text><Text className="mb-6 text-center text-sm leading-6 text-muted">¡Listo! Tu cuenta quedó vinculada y Xpense ya está trayendo movimientos de ejemplo.</Text><Button label="Ver mi panorama" onPress={closeLink} className="w-full" /></View>}
  </ModalFrame>;
}

export function Toast() {
  const { toast } = useDemo();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return <View pointerEvents="none" style={{ bottom: insets.bottom + 82 }} className="absolute left-4 right-4 rounded-[13px] bg-navy px-4 py-3"><Text className="text-xs font-bold text-white">{toast}</Text></View>;
}
