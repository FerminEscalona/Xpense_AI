import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { money, PaymentKind, sorted } from '@/lib/demo';
import { Button, Card, CardHeading, Heading, Screen, TransactionList } from '@/components/ui';

const choices: { kind: PaymentKind; icon: string; background: string; title: string; subtitle: string }[] = [
  { kind: 'cafeteria', icon: '☕', background: '#ffe8db', title: 'Cafetería', subtitle: 'Tu café, snack o almuerzo en el campus.' },
  { kind: 'transporte', icon: '🚌', background: '#e5f2fc', title: 'Bus y transporte', subtitle: 'Simula la recarga de tus viajes.' },
  { kind: 'parqueadero', icon: '🚲', background: '#d5f5e7', title: 'Parqueadero', subtitle: 'Un solo lugar para pagar tu espacio.' },
];

export default function Pagos() {
  const { data, openExpense } = useDemo();
  return <Screen title="Pagos"><Heading eyebrow="Todo en un lugar" title="Pagos universitarios" subtitle="Cafetería, movilidad y parqueadero desde un mismo espacio." />
    <Card className="mb-4"><Text className="text-[11px] text-muted">Saldo para pagos</Text><Text className="mt-1 text-[28px] font-black tracking-[-1px] text-ink">{money(data.balance)}</Text><Button label="Registrar otro gasto" secondary className="mt-4 self-start" onPress={() => openExpense()} /></Card>
    <View className="mb-4 flex-row flex-wrap justify-between gap-y-3">{choices.map((choice, index) => <Pressable key={choice.kind} onPress={() => openExpense(choice.kind)} className={`rounded-[22px] border border-line bg-panel p-[17px] ${index === 2 ? 'w-full' : 'w-[49%]'}`}><View style={{ backgroundColor: choice.background }} className="mb-4 h-12 w-12 items-center justify-center rounded-[15px]"><Text className="text-2xl">{choice.icon}</Text></View><Text className="text-[14px] font-extrabold text-ink">{choice.title}</Text><Text className="mt-1 text-[11px] leading-[17px] text-muted">{choice.subtitle}</Text><Text className="mt-3 text-xl text-purple">↗</Text></Pressable>)}</View>
    <Card><CardHeading title="Pagos recientes" subtitle="Movimientos realizados en el demo" /><TransactionList items={sorted(data.transactions).filter(item => item.payment).slice(0, 6)} empty="Aún no hay pagos en este demo." /></Card>
  </Screen>;
}
