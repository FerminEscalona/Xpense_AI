import React, { useState } from 'react';
import { View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { Category, categoryStyle, dayStart, MICRO_LIMIT, money, Period, periodTransactions, sorted, sum } from '@/lib/demo';
import { BarChart, Callout, Card, CardHeading, Progress, Screen, Segmented, Text, TransactionList } from '@/components/ui';

const categories: Category[] = ['Cafetería', 'Transporte', 'Parqueadero', 'Estudio', 'Otros'];

export default function Movimientos() {
  const { data } = useDemo();
  const [view, setView] = useState<'lista' | 'resumen'>('lista');
  return <Screen title="Movimientos" fab>
    <View className="mb-5"><Segmented value={view} onChange={setView} options={[{ value: 'lista', label: 'Lista' }, { value: 'resumen', label: 'Resumen' }]} /></View>
    {view === 'lista' ? <Card><TransactionList items={sorted(data.transactions)} /></Card> : <Resumen />}
  </Screen>;
}

function Resumen() {
  const { data } = useDemo();
  const [period, setPeriod] = useState<Period>('semana');
  const tx = periodTransactions(data.transactions, period);
  const total = sum(tx);
  const micro = tx.filter(item => item.amount <= MICRO_LIMIT);
  const now = new Date();
  const { values, labels, highlight } = (() => {
    if (period === 'dia') {
      const values = Array.from({ length: 6 }, (_, i) => sum(tx.filter(item => Math.floor(new Date(item.at).getHours() / 4) === i)));
      return { values, labels: ['00h', '04h', '08h', '12h', '16h', '20h'], highlight: values.map(value => value > 0).lastIndexOf(true) };
    }
    if (period === 'semana') {
      const days = Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i));
      return {
        values: days.map(day => sum(tx.filter(item => dayStart(item.at) === dayStart(day)))),
        labels: days.map(day => day.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '').slice(0, 3)),
        highlight: 6,
      };
    }
    const groups = Math.ceil(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() / 5);
    return {
      values: Array.from({ length: groups }, (_, i) => sum(tx.filter(item => Math.floor((new Date(item.at).getDate() - 1) / 5) === i))),
      labels: Array.from({ length: groups }, (_, i) => String(i * 5 + 1)),
      highlight: Math.floor((now.getDate() - 1) / 5),
    };
  })();
  const byCategory = categories.map(name => ({ name, value: sum(tx.filter(item => item.category === name)) })).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
  const caption = period === 'dia' ? 'hoy' : period === 'semana' ? 'en los últimos 7 días' : 'este mes';
  const summary = `Gasto ${caption}: ${labels.map((label, i) => `${label} ${money(values[i])}`).join(', ')}.`;
  return <>
    <View className="mb-5"><Segmented value={period} onChange={setPeriod} options={[{ value: 'dia', label: 'Día' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]} /></View>
    <Card className="mb-5">
      <Text className="text-sm text-muted">Gastaste {caption}</Text>
      <Text accessibilityRole="header" className="mb-5 mt-1 font-heavy text-[36px] leading-[44px] text-ink">{money(total)}</Text>
      <BarChart values={values} labels={labels} highlight={highlight} height={150} summary={summary} />
      {micro.length ? <View className="mt-5"><Callout title="Efecto hormiga">{micro.length} gastos de {money(MICRO_LIMIT)} o menos suman {money(sum(micro))}. Si se repiten cada semana, serían cerca de {money(sum(micro) * (period === 'mes' ? 1 : 4))} al mes.</Callout></View> : null}
    </Card>
    <Card>
      <CardHeading title="¿En qué se va tu dinero?" />
      {byCategory.length ? byCategory.map(item => <View key={item.name} className="mb-4">
        <View className="mb-2 flex-row items-center justify-between"><Text className="text-sm text-ink">{item.name}</Text><Text className="font-strong text-sm text-ink">{money(item.value)} · {Math.round(item.value / total * 100)}%</Text></View>
        <Progress value={item.value / total * 100} color={categoryStyle[item.name].bar} label={item.name} />
      </View>) : <Text className="py-2 text-sm text-muted">Sin gastos en este período.</Text>}
    </Card>
  </>;
}
