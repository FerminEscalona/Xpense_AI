import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { dayStart, money, periodTransactions, safeDaily, sorted, sum } from '@/lib/demo';
import { BarChart, Button, Card, CardHeading, Chip, Heading, Insight, Progress, Screen, SmallLink, TransactionList } from '@/components/ui';

export default function Inicio() {
  const { data, openExpense } = useDemo();
  const week = periodTransactions(data.transactions, 'semana');
  const micro = week.filter(item => item.amount <= 10000);
  const daily = safeDaily(data);
  const pct = data.goal ? Math.min(100, Math.round(data.saved / data.goal * 100)) : 100;
  const now = new Date();
  const values = Array.from({ length: 7 }, (_, i) => sum(week.filter(item => dayStart(item.at) === dayStart(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i)))));
  const labels = Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i).toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '').slice(0, 3));
  return <Screen title="Inicio"><Heading eyebrow="Tu dinero, con perspectiva" title="Hola, Sam 👋" subtitle="Hoy puedes tomar buenas decisiones sin dejar de disfrutar la U." />
    <View className="mb-4 min-h-[225px] overflow-hidden rounded-[23px] bg-navy p-6"><View className="absolute -right-14 -top-24 h-[250px] w-[250px] rounded-full bg-[#514c8b] opacity-75" /><View className="absolute -bottom-36 right-2 h-[210px] w-[210px] rounded-full border-[25px] border-[#aaa0f5] opacity-20" /><View className="absolute right-8 top-16 h-[80px] w-[80px] rotate-[-19deg] items-center justify-center rounded-full bg-[#9c91f3] shadow-lg"><Text className="text-[45px] font-black text-white">x</Text></View><Text className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#c1c0df]">Saldo disponible</Text><Text className="mt-3 text-[40px] font-black tracking-[-1.7px] text-white">{money(data.balance)}</Text><Text className="max-w-[200px] text-xs leading-[18px] text-[#dad9ee]">Para tus gastos de la universidad y mucho más.</Text><View className="mt-7 flex-row items-center gap-3"><Button label="+ Registrar gasto" secondary onPress={() => openExpense()} /><Text className="flex-1 text-[10px] leading-4 text-[#c5c3e3]">Tu dinero está bajo control ✨</Text></View></View>
    <Card className="mb-4"><View className="mb-5 flex-row items-start justify-between gap-2"><View className="flex-1"><Text className="text-[17px] font-extrabold text-ink">Tu meta de ahorro</Text><Text className="mt-1 text-xs text-muted">Un pequeño paso cada semana</Text></View><Chip label="En camino" tone="green" /></View><View className="mb-2 flex-row justify-between"><Text className="text-xs text-ink">Ahorrado hasta hoy</Text><Text className="text-[13px] font-extrabold text-ink">{money(data.saved)}</Text></View><Progress value={pct} /><View className="mb-6 mt-2 flex-row justify-between"><Text className="text-[11px] text-muted">{pct}% de la meta</Text><Text className="text-[11px] text-muted">Meta {money(data.goal)}</Text></View><Insight title="Tu gemelo te acompaña">Puedes gastar {money(daily)} hoy y seguir avanzando hacia tu meta.</Insight></Card>
    <View className="mb-4 flex-row flex-wrap justify-between gap-y-2">{[
      { label: 'Gastado esta semana', value: money(sum(week)), note: 'Tus gastos recientes', icon: 'wallet-outline' as const, bg: '#ffe8db', color: '#e77b46' },
      { label: 'Microgastos esta semana', value: money(sum(micro)), note: `${micro.length} gastos de ${money(10000)} o menos`, icon: 'stats-chart-outline' as const, bg: '#eeebff', color: '#6759d8' },
      { label: 'Puedes gastar hoy', value: money(daily), note: 'Y seguir cuidando tu meta', icon: 'sparkles-outline' as const, bg: '#d5f5e7', color: '#138965' },
    ].map((metric, index) => <View key={metric.label} className={`rounded-[19px] border border-line bg-panel p-[14px] ${index === 2 ? 'w-full' : 'w-[49%]'}`}><View style={{ backgroundColor: metric.bg }} className="mb-4 h-9 w-9 items-center justify-center rounded-xl"><Ionicons name={metric.icon} size={20} color={metric.color} /></View><Text className="text-[11px] font-bold text-muted">{metric.label}</Text><Text className="my-1 text-[21px] font-extrabold tracking-[-0.7px] text-ink">{metric.value}</Text><Text className="text-[10px] text-muted">{metric.note}</Text></View>)}</View>
    <Card className="mb-4"><CardHeading title="Así va tu semana" subtitle="Tus gastos día a día" action={<SmallLink label="Ver análisis →" onPress={() => router.push('/(tabs)/analisis')} />} /><BarChart values={values} labels={labels} highlight={6} /><View className="mt-3 flex-row gap-4"><Text className="text-[11px] text-muted"><Text className="text-purple">●</Text> Hoy</Text><Text className="text-[11px] text-muted"><Text className="text-[#cac5f3]">●</Text> Otros días</Text></View></Card>
    <Card><CardHeading title="Movimientos recientes" subtitle="Cada peso cuenta" action={<SmallLink label="Ver pagos →" onPress={() => router.push('/(tabs)/pagos')} />} /><TransactionList items={sorted(data.transactions).slice(0, 4)} /></Card>
  </Screen>;
}
