import React, { useState } from 'react';
import { View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { freeBudget, money, safeDaily } from '@/lib/demo';
import { Button, Callout, Card, CardHeading, Field, Progress, Screen, Stepper, Text } from '@/components/ui';

export default function Gemelo() {
  const { data, openSheet } = useDemo();
  const [habitCost, setHabitCost] = useState('6000');
  const [frequency, setFrequency] = useState(3);
  const daily = safeDaily(data);
  const gap = Math.max(0, data.goal - data.saved);
  const monthly = Math.max(0, Number(habitCost) || 0) * frequency * 4;
  const closes = gap ? Math.min(100, Math.round(monthly / gap * 100)) : 100;
  return <Screen title="Tu gemelo" subtitle="Una simulación de tus finanzas para decidir mejor hoy.">
    <View className="mb-5 rounded-[28px] bg-brand-soft p-6">
      <Text className="font-semi text-sm text-brand">Tu plan de esta semana</Text>
      <Text accessibilityRole="header" className="mt-2 font-heavy text-[26px] leading-[32px] text-ink">Puedes gastar {money(daily)} al día</Text>
      <Text className="mt-2 text-[15px] leading-6 text-ink">Reservando {money(gap)} para tu meta, te quedan {money(freeBudget(data))} para repartir en siete días.</Text>
      <View className="mt-5"><Progress value={data.goal ? data.saved / data.goal * 100 : 100} track="#B9E3DC" label="Progreso de tu meta de ahorro" /><Text className="mt-2 text-xs text-muted">Ahorrado {money(data.saved)} de {money(data.goal)}</Text></View>
      <View className="mt-5 flex-row gap-3">
        <Button label="Aportar" icon="arrow-up-circle-outline" onPress={() => openSheet('saving')} className="flex-1" />
        <Button label="Ajustar plan" variant="secondary" onPress={() => openSheet('plan')} className="flex-1 bg-white" />
      </View>
    </View>

    <Card>
      <CardHeading title="¿Y si cambias un hábito?" subtitle="Mira cuánto sumaría reducir un gasto frecuente." />
      <Field label="¿Cuánto cuesta cada vez?" prefix="$" value={habitCost} onChangeText={setHabitCost} keyboardType="numeric" />
      <Text className="mb-2 font-semi text-sm text-ink">¿Cuántas veces por semana?</Text>
      <View className="mb-5"><Stepper value={frequency} onChange={setFrequency} label="veces por semana" /></View>
      <Callout title={`Podrías ahorrar ${money(monthly)} al mes`}>{gap ? `Eso cubre cerca del ${closes}% de lo que te falta para tu meta. ` : ''}Tú decides qué vale la pena.</Callout>
    </Card>
    <Text className="mt-4 text-xs leading-[18px] text-muted">Las recomendaciones son orientativas y se calculan con los datos de este demo.</Text>
  </Screen>;
}
