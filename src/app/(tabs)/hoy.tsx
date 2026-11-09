import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { dayStart, MICRO_LIMIT, money, periodTransactions, safeDaily, sorted, sum } from '@/lib/demo';
import { BarChart, Callout, Card, CardHeading, colors, Progress, Screen, SmallLink, Text, TransactionList } from '@/components/ui';

export default function Hoy() {
  const { data, setupDone, ready, openSheet, openLink } = useDemo();
  const [bankPromptHidden, hideBankPrompt] = useState(false);
  useEffect(() => { if (ready && !setupDone) openSheet('plan'); }, [ready, setupDone, openSheet]);

  const week = periodTransactions(data.transactions, 'semana');
  const micro = week.filter(item => item.amount <= MICRO_LIMIT);
  const daily = safeDaily(data);
  const pct = data.goal ? Math.min(100, Math.round(data.saved / data.goal * 100)) : 100;
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i));
  const values = days.map(day => sum(week.filter(item => dayStart(item.at) === dayStart(day))));
  const labels = days.map(day => day.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '').slice(0, 3));
  const summary = `Gasto de los últimos 7 días: ${labels.map((label, i) => `${label} ${money(values[i])}`).join(', ')}.`;

  return <Screen title="Hoy" subtitle="Hola, Sam. Así va tu semana." fab>
    <View className="mb-5 rounded-[28px] bg-brand p-6">
      <Text className="font-semi text-sm text-brand-soft">Hoy puedes gastar</Text>
      <Text accessibilityRole="header" className="mt-1 font-heavy text-[44px] leading-[52px] text-white">{money(daily)}</Text>
      <Text className="mt-1 text-sm leading-5 text-brand-soft">y seguir en camino a tu meta. Saldo: {money(data.balance)}</Text>
      <View className="mt-5">
        <View className="mb-2 flex-row items-center justify-between"><Text className="font-semi text-sm text-white">Meta de ahorro · {pct}%</Text><Text className="font-semi text-sm text-white">{money(data.saved)} / {money(data.goal)}</Text></View>
        <Progress value={pct} color="#FFFFFF" track="#2F9188" label="Progreso de tu meta de ahorro" />
      </View>
      <Pressable accessibilityRole="button" onPress={() => openSheet('saving')} className="mt-4 min-h-11 flex-row items-center gap-1 self-start active:opacity-80"><Ionicons name="arrow-up-circle-outline" size={20} color="#fff" /><Text className="font-strong text-sm text-white">Aportar a mi meta</Text></Pressable>
    </View>

    <Card className="mb-5">
      <CardHeading title="Esta semana" subtitle={`Gastaste ${money(sum(week))}`} action={<SmallLink label="Ver todo" onPress={() => router.push('/(tabs)/movimientos')} />} />
      <BarChart values={values} labels={labels} highlight={6} summary={summary} />
      {micro.length ? <View className="mt-5"><Callout title="Efecto hormiga">{micro.length} gastos pequeños suman {money(sum(micro))} esta semana.</Callout></View> : null}
    </Card>

    <Card className="mb-5">
      <CardHeading title="Últimos movimientos" action={<SmallLink label="Ver todo" onPress={() => router.push('/(tabs)/movimientos')} />} />
      <TransactionList items={sorted(data.transactions).slice(0, 3)} />
    </Card>

    {!data.linkedBank && !bankPromptHidden ? <Card className="flex-row items-center gap-3">
      <Ionicons name="card-outline" size={28} color={colors.brand} />
      <View className="flex-1"><Text className="font-strong text-[15px] text-ink">Registra gastos solo</Text><Text className="text-sm leading-5 text-muted">Vincula tu banco y se anotan automáticamente.</Text></View>
      <View><SmallLink label="Vincular" onPress={openLink} /><SmallLink label="Luego" onPress={() => hideBankPrompt(true)} /></View>
    </Card> : null}
  </Screen>;
}
