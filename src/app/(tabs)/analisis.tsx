import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { Category, categoryStyle, dayStart, money, Period, periodTransactions, sorted, sum } from '@/lib/demo';
import { BarChart, Button, Card, CardHeading, Heading, Insight, Progress, Screen, TransactionList } from '@/components/ui';

const categories: Category[] = ['Cafetería', 'Transporte', 'Parqueadero', 'Estudio', 'Otros'];

export default function Analisis() {
  const { data, openExpense } = useDemo();
  const [period, setPeriod] = useState<Period>('semana');
  const tx = periodTransactions(data.transactions, period);
  const total = sum(tx);
  const micro = tx.filter(item => item.amount <= 10000);
  const microSum = sum(micro);
  const now = new Date();
  const { values, labels, highlight } = (() => {
    if (period === 'dia') {
      const values = Array.from({ length: 6 }, (_, i) => sum(tx.filter(item => Math.floor(new Date(item.at).getHours() / 4) === i)));
      return { values, labels: ['00', '04', '08', '12', '16', '20'], highlight: values.map(value => value > 0).lastIndexOf(true) };
    }
    if (period === 'semana') return {
      values: Array.from({ length: 7 }, (_, i) => sum(tx.filter(item => dayStart(item.at) === dayStart(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i))))),
      labels: Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i).toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '').slice(0, 3)),
      highlight: 6,
    };
    const groups = Math.ceil(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() / 5);
    return { values: Array.from({ length: groups }, (_, i) => sum(tx.filter(item => Math.floor((new Date(item.at).getDate() - 1) / 5) === i))), labels: Array.from({ length: groups }, (_, i) => String(i * 5 + 1)), highlight: Math.floor((now.getDate() - 1) / 5) };
  })();
  const categoryTotals = categories.map(name => ({ name, value: sum(tx.filter(item => item.category === name)) })).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
  const caption = period === 'dia' ? 'Hoy' : period === 'semana' ? 'Últimos 7 días' : 'Este mes';
  return <Screen title="Análisis"><Heading eyebrow="Entiende tus hábitos" title="Análisis de gastos" subtitle="Descubre lo que suman tus decisiones de cada día." />
    <Card className="mb-4"><CardHeading title="Panorama de gastos" subtitle="Registros de ejemplo y los que agregues" /><View className="mb-5 self-start flex-row rounded-xl bg-[#f1f0ed] p-1">{(['dia', 'semana', 'mes'] as Period[]).map(item => <Pressable key={item} onPress={() => setPeriod(item)} className={`rounded-lg px-3 py-2 ${period === item ? 'bg-white' : ''}`}><Text className={`text-[11px] font-extrabold ${period === item ? 'text-purple' : 'text-[#92909e]'}`}>{item === 'dia' ? 'Día' : item === 'semana' ? 'Semana' : 'Mes'}</Text></Pressable>)}</View><Text className="text-[11px] font-bold text-muted">Gastado en este período</Text><View className="mb-6 flex-row items-end gap-4"><Text className="text-[35px] font-black tracking-[-1.5px] text-ink">{money(total)}</Text><Text className="mb-2 text-[11px] font-extrabold text-orange">{caption}</Text></View><BarChart values={values} labels={labels} highlight={highlight} height={195} /><View className="mt-5 rounded-[18px] border border-[#ffe1d0] bg-[#fff1e9] p-4"><Text className="text-[13px] font-extrabold text-[#a75836]">✳ El efecto hormiga</Text><Text className="mt-2 text-xs leading-[19px] text-[#9b705f]">{micro.length ? `${micro.length} gastos de ${money(10000)} o menos suman ${money(microSum)} en este período. Si se repitieran cada semana, serían cerca de ${money(microSum * 4)} al mes.` : 'Todavía no hay microgastos en este período. Añade un gasto para observar su efecto acumulado.'}</Text></View></Card>
    <Card className="mb-4"><CardHeading title="¿En qué se va tu dinero?" subtitle="Distribución del período" />{categoryTotals.length ? categoryTotals.map(item => <View key={item.name} className="mb-5"><View className="mb-2 flex-row items-center justify-between"><Text className="text-xs text-ink"><Text style={{ color: categoryStyle[item.name].bar }}>● </Text>{item.name}</Text><Text className="text-xs font-extrabold text-ink">{money(item.value)}</Text></View><Progress value={total ? item.value / total * 100 : 0} color={categoryStyle[item.name].bar} /></View>) : <Text className="py-4 text-xs text-muted">Sin gastos en este período.</Text>}<Insight title="Idea de Xpense">{categoryTotals.length ? `${categoryTotals[0].name} representa ${Math.round(categoryTotals[0].value / total * 100)}% de tus gastos del período. Revisa si hay una alternativa que te convenga más.` : 'Registra tus gastos para descubrir en qué categoría podrías ajustar.'}</Insight></Card>
    <Card><CardHeading title="Todos tus movimientos" subtitle="Historial en este demo" /><Button label="+ Añadir gasto" secondary className="mb-3 self-start" onPress={() => openExpense()} /><TransactionList items={sorted(data.transactions)} /></Card>
  </Screen>;
}
