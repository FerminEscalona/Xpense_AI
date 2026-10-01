import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { freeBudget, money, safeDaily } from '@/lib/demo';
import { Button, Card, CardHeading, Chip, Field, Heading, Screen } from '@/components/ui';

export default function Gemelo() {
  const { data, updatePlan, addSaving } = useDemo();
  const [goal, setGoal] = useState(String(data.goal));
  const [income, setIncome] = useState(String(data.income));
  const [saving, setSaving] = useState('');
  const [habitCost, setHabitCost] = useState('6000');
  const [frequency, setFrequency] = useState(3);
  const daily = safeDaily(data);
  const gap = Math.max(0, data.goal - data.saved);
  return <Screen title="Gemelo IA"><Heading eyebrow="Tu copiloto financiero" title="Conoce a tu gemelo" subtitle="Una simulación de tus finanzas para elegir mejor hoy." />
    <View className="mb-4 min-h-[205px] overflow-hidden rounded-[24px] border border-[#e7e2ff] bg-[#eeeaff] p-6"><View className="absolute -bottom-8 -right-4 h-[110px] w-[110px] rotate-[-11deg] items-center justify-center rounded-[35px] bg-[#9f91f7] opacity-60"><Text className="text-[60px] text-white">✦</Text></View><Chip label="GEMELO DIGITAL · DEMO" /><Text className="mt-3 max-w-[260px] text-[23px] font-black leading-[28px] tracking-[-0.8px] text-ink">Tu yo del futuro te lo agradece.</Text><Text className="mt-3 max-w-[260px] text-xs leading-[19px] text-[#737092]">Con tu saldo actual, separar {money(gap)} para la meta deja un margen sugerido de {money(daily)} al día durante siete días.</Text></View>
    <View className="mb-4 flex-row flex-wrap justify-between gap-y-2">{[
      { label: 'Hoy puedes gastar', value: daily, text: 'Estimación diaria para llegar a tu meta.' },
      { label: 'Disponible tras reservar tu meta', value: freeBudget(data), text: 'Lo que puedes repartir durante la semana.' },
      { label: 'Te falta para tu meta', value: gap, text: 'Tu ahorro sigue creciendo.' },
    ].map((stat, index) => <View key={stat.label} className={`rounded-[20px] border border-line bg-panel p-4 ${index === 2 ? 'w-full' : 'w-[49%]'}`}><Text className="text-[11px] text-muted">{stat.label}</Text><Text className="my-2 text-[20px] font-extrabold tracking-[-0.8px] text-ink">{money(stat.value)}</Text><Text className="text-[11px] leading-[17px] text-muted">{stat.text}</Text></View>)}</View>
    <Card className="mb-4"><CardHeading title="Tu plan de ahorro" subtitle="Ajusta la meta y prueba escenarios" /><Field label="Meta de ahorro" value={goal} onChangeText={setGoal} keyboardType="numeric" /><Field label="Ingreso semanal estimado" value={income} onChangeText={setIncome} keyboardType="numeric" /><Button label="Actualizar mi plan" className="mb-6 self-start" onPress={() => updatePlan(Number(goal), Number(income))} /><Field label="Aportar a mi meta (COP)" value={saving} onChangeText={setSaving} keyboardType="numeric" placeholder="Ej. 20000" /><Button label="Mover a ahorro" secondary className="self-start" onPress={() => { if (addSaving(Number(saving))) setSaving(''); }} /><Text className="mt-4 text-[11px] leading-[17px] text-muted">La recomendación es orientativa y se calcula con los datos de este demo.</Text></Card>
    <Card className="mb-4"><CardHeading title="Si cambias un hábito..." subtitle="Prueba el impacto de un microgasto" /><Field label="¿Cuánto cuesta ese gasto frecuente?" value={habitCost} onChangeText={setHabitCost} keyboardType="numeric" /><Text className="mb-2 text-[11px] font-extrabold text-[#6c6d80]">¿Cuántas veces por semana?</Text><View className="mb-4 flex-row flex-wrap gap-2">{Array.from({ length: 7 }, (_, i) => i + 1).map(value => <Pressable key={value} onPress={() => setFrequency(value)} className={`h-9 w-9 items-center justify-center rounded-lg ${frequency === value ? 'bg-purple' : 'bg-lavender'}`}><Text className={`text-xs font-extrabold ${frequency === value ? 'text-white' : 'text-purple'}`}>{value}</Text></Pressable>)}</View><View className="rounded-[18px] border border-[#ffe1d0] bg-[#fff1e9] p-4"><Text className="text-[13px] font-extrabold text-[#a75836]">Podrías ahorrar {money(Math.max(0, Number(habitCost) || 0) * frequency * 4)} al mes</Text><Text className="mt-2 text-xs leading-[19px] text-[#9b705f]">Si reduces ese gasto, el dinero puede ir a tu meta. Tú decides qué vale la pena.</Text></View></Card>
    <Card><View className="mb-5 flex-row items-start justify-between gap-2"><View className="flex-1"><Text className="text-[17px] font-extrabold text-ink">Comer bien, gastar mejor</Text><Text className="mt-1 text-xs leading-[18px] text-muted">Opciones ilustrativas de comida nutritiva y económica</Text></View><Chip label="Ideas para hoy" tone="green" /></View>{[
      { emoji: '🥗', title: 'Bowl de arroz, lentejas y vegetales', text: 'Proteína vegetal, fibra y energía para clases.', saving: 'Estimado $9.000 · Ahorra $7.000 frente a un combo de $16.000' },
      { emoji: '🥪', title: 'Sándwich integral, huevo y fruta', text: 'Una opción sencilla y completa para media jornada.', saving: 'Estimado $8.000 · Ahorra $6.000 frente a un almuerzo de $14.000' },
    ].map(item => <View key={item.title} className="mb-3 flex-row gap-3 rounded-[18px] border border-line p-4"><View className="h-12 w-12 items-center justify-center rounded-[13px] bg-[#f4f7e8]"><Text className="text-2xl">{item.emoji}</Text></View><View className="flex-1"><Text className="text-xs font-extrabold text-ink">{item.title}</Text><Text className="my-1 text-[11px] leading-[17px] text-muted">{item.text}</Text><Text className="text-[11px] font-extrabold leading-[17px] text-green">{item.saving}</Text></View></View>)}<Text className="text-[11px] leading-[17px] text-muted">Precios ilustrativos. Confirma precios, disponibilidad e ingredientes en tu cafetería.</Text></Card>
  </Screen>;
}
