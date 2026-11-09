import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text as RNText, TextInput, View, type TextProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDemo } from '@/context/DemoContext';
import { categoryStyle, dayStart, IconName, money, Transaction } from '@/lib/demo';

export const colors = {
  brand: '#0F766E', brandSoft: '#DDF3EF', brandDark: '#0B4F4A', ink: '#0F2E2B', muted: '#4A6361',
  line: '#D9E6E3', amber: '#B45309', amberSoft: '#FEF3C7', chart: '#5BB0A4',
};

/** Text with Plus Jakarta Sans regular by default; any `font-*` class in className replaces it. */
export function Text({ className = '', ...props }: TextProps & { className?: string }) {
  return <RNText {...props} className={/\bfont-/.test(className) ? className : `font-body ${className}`} />;
}

/* ---------- Layout ---------- */

export function Screen({ title, subtitle, fab, children }: { title: string; subtitle?: string; fab?: boolean; children: React.ReactNode }) {
  const { openExpense } = useDemo();
  return <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
    <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: fab ? 104 : 32 }} keyboardShouldPersistTaps="handled">
      <View className="mb-6 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text accessibilityRole="header" className="font-heavy text-[30px] leading-[36px] text-ink">{title}</Text>
          {subtitle ? <Text className="mt-1 text-sm leading-5 text-muted">{subtitle}</Text> : null}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Mi perfil" onPress={() => router.push('/perfil')} className="h-12 w-12 items-center justify-center rounded-full bg-brand-soft active:opacity-80">
          <Ionicons name="person" size={22} color={colors.brand} />
        </Pressable>
      </View>
      {children}
    </ScrollView>
    {fab ? <Pressable accessibilityRole="button" accessibilityLabel="Registrar gasto" onPress={openExpense} className="absolute bottom-4 right-5 h-14 flex-row items-center gap-2 rounded-full bg-brand px-5 shadow-lg active:opacity-85">
      <Ionicons name="add" size={24} color="#fff" /><Text className="font-strong text-base text-white">Gasto</Text>
    </Pressable> : null}
  </SafeAreaView>;
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <View className={`rounded-3xl border border-line bg-panel p-5 ${className}`}>{children}</View>;
}

export function CardHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <View className="mb-4 flex-row items-start justify-between gap-3">
    <View className="flex-1"><Text accessibilityRole="header" className="font-strong text-lg text-ink">{title}</Text>{subtitle ? <Text className="mt-1 text-sm leading-5 text-muted">{subtitle}</Text> : null}</View>
    {action}
  </View>;
}

export function SmallLink({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} className="min-h-11 justify-center active:opacity-70"><Text className="font-strong text-sm text-brand">{label}</Text></Pressable>;
}

/* ---------- Controls ---------- */

export function Button({ label, onPress, variant = 'primary', icon, className = '', disabled = false }: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; icon?: IconName; className?: string; disabled?: boolean }) {
  const box = variant === 'primary' ? 'bg-brand' : variant === 'secondary' ? 'bg-brand-soft' : 'bg-transparent';
  const text = variant === 'primary' ? 'text-white' : 'text-brand';
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} className={`min-h-12 flex-row items-center justify-center gap-2 rounded-2xl px-5 active:opacity-80 ${box} ${disabled ? 'opacity-50' : ''} ${className}`}>
    {icon ? <Ionicons name={icon} size={20} color={variant === 'primary' ? '#fff' : colors.brand} /> : null}
    <Text className={`font-strong text-[15px] ${text}`}>{label}</Text>
  </Pressable>;
}

export function Chip({ label, tone = 'brand' }: { label: string; tone?: 'brand' | 'green' | 'amber' }) {
  const box = tone === 'green' ? 'bg-mint' : tone === 'amber' ? 'bg-amber-soft' : 'bg-brand-soft';
  const text = tone === 'green' ? 'text-green' : tone === 'amber' ? 'text-amber' : 'text-brand';
  return <View className={`self-start rounded-full px-3 py-1.5 ${box}`}><Text className={`font-strong text-xs ${text}`}>{label}</Text></View>;
}

/** Tappable choice pill (category, preset amounts). */
export function Choice({ label, selected, onPress, icon }: { label: string; selected: boolean; onPress: () => void; icon?: IconName }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} className={`min-h-11 flex-row items-center gap-2 rounded-full px-4 active:opacity-80 ${selected ? 'bg-brand' : 'bg-brand-soft'}`}>
    {icon ? <Ionicons name={icon} size={18} color={selected ? '#fff' : colors.brand} /> : null}
    <Text className={`font-semi text-sm ${selected ? 'text-white' : 'text-brand'}`}>{label}</Text>
  </Pressable>;
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return <View accessibilityRole="tablist" className="flex-row rounded-2xl bg-[#E4EEEC] p-1">
    {options.map(option => <Pressable key={option.value} accessibilityRole="tab" accessibilityState={{ selected: value === option.value }} onPress={() => onChange(option.value)} className={`min-h-11 flex-1 items-center justify-center rounded-xl ${value === option.value ? 'bg-white' : ''}`}>
      <Text className={`text-sm ${value === option.value ? 'font-strong text-brand' : 'font-semi text-muted'}`}>{option.label}</Text>
    </Pressable>)}
  </View>;
}

export function Stepper({ value, min = 1, max = 7, onChange, label }: { value: number; min?: number; max?: number; onChange: (value: number) => void; label: string }) {
  return <View className="flex-row items-center justify-between rounded-2xl bg-canvas p-2">
    <Pressable accessibilityRole="button" accessibilityLabel={`Menos ${label}`} disabled={value <= min} onPress={() => onChange(value - 1)} className={`h-12 w-12 items-center justify-center rounded-xl bg-white active:opacity-70 ${value <= min ? 'opacity-40' : ''}`}><Ionicons name="remove" size={24} color={colors.brand} /></Pressable>
    <Text accessibilityLiveRegion="polite" className="font-strong text-base text-ink">{value} {value === 1 ? 'vez' : 'veces'} por semana</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={`Más ${label}`} disabled={value >= max} onPress={() => onChange(value + 1)} className={`h-12 w-12 items-center justify-center rounded-xl bg-white active:opacity-70 ${value >= max ? 'opacity-40' : ''}`}><Ionicons name="add" size={24} color={colors.brand} /></Pressable>
  </View>;
}

export function Field({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default', maxLength, prefix, helper, right }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; secureTextEntry?: boolean; keyboardType?: 'default' | 'numeric' | 'email-address'; maxLength?: number; prefix?: string; helper?: string; right?: React.ReactNode }) {
  return <View className="mb-4">
    <Text className="mb-2 font-semi text-sm text-ink">{label}</Text>
    <View className="min-h-12 flex-row items-center rounded-2xl border border-line bg-white px-4">
      {prefix ? <Text className="mr-1 font-semi text-base text-muted">{prefix}</Text> : null}
      <TextInput accessibilityLabel={label} className="min-h-12 flex-1 font-body text-base text-ink" placeholder={placeholder} placeholderTextColor="#7A908D" value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} keyboardType={keyboardType} maxLength={maxLength} autoCapitalize="none" />
      {right}
    </View>
    {helper ? <Text className="mt-1.5 text-xs leading-[18px] text-muted">{helper}</Text> : null}
  </View>;
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return <View accessibilityRole="alert" className="mb-4 flex-row items-start gap-2 rounded-2xl bg-amber-soft p-3"><Ionicons name="alert-circle" size={20} color={colors.amber} /><Text className="flex-1 text-sm leading-5 text-amber">{message}</Text></View>;
}

/* ---------- Feedback & data ---------- */

export function Progress({ value, color = colors.brand, track = '#E4EEEC', label }: { value: number; color?: string; track?: string; label?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }} style={{ backgroundColor: track }} className="h-2.5 overflow-hidden rounded-full"><View style={{ width: `${pct}%`, backgroundColor: color }} className="h-full rounded-full" /></View>;
}

export function Callout({ icon = 'bulb-outline', tone = 'amber', title, children }: { icon?: IconName; tone?: 'amber' | 'brand'; title: string; children: React.ReactNode }) {
  const box = tone === 'amber' ? 'bg-amber-soft' : 'bg-brand-soft';
  const color = tone === 'amber' ? colors.amber : colors.brand;
  return <View className={`flex-row gap-3 rounded-2xl p-4 ${box}`}>
    <Ionicons name={icon} size={22} color={color} />
    <View className="flex-1"><Text className="font-strong text-sm text-ink">{title}</Text><Text className="mt-1 text-sm leading-5 text-ink">{children}</Text></View>
  </View>;
}

export function IconTile({ icon, background, color, size = 44 }: { icon: IconName; background: string; color: string; size?: number }) {
  return <View style={{ backgroundColor: background, width: size, height: size }} className="items-center justify-center rounded-2xl"><Ionicons name={icon} size={size * 0.5} color={color} /></View>;
}

export function TransactionList({ items, empty = 'Aún no hay movimientos.' }: { items: Transaction[]; empty?: string }) {
  if (!items.length) return <Text className="py-4 text-sm text-muted">{empty}</Text>;
  return <View>{items.map((item, index) => {
    const style = categoryStyle[item.category] || categoryStyle.Otros;
    const date = dayStart(item.at) === dayStart(new Date()) ? 'Hoy' : new Date(item.at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    return <View key={item.id} accessible accessibilityLabel={`${item.name}, ${item.category}, ${date}, ${money(item.amount)}`} className={`flex-row items-center gap-3 py-3 ${index < items.length - 1 ? 'border-b border-line' : ''}`}>
      <IconTile icon={style.icon} background={style.background} color={style.color} />
      <View className="flex-1"><Text numberOfLines={1} className="font-semi text-[15px] text-ink">{item.name}</Text><Text className="mt-0.5 text-xs text-muted">{item.category} · {date}{item.source === 'auto' ? ' · Banco' : ''}</Text></View>
      <Text className="font-strong text-[15px] text-ink">− {money(item.amount)}</Text>
    </View>;
  })}</View>;
}

export function BarChart({ values, labels, highlight, height = 120, summary }: { values: number[]; labels: string[]; highlight: number; height?: number; summary: string }) {
  const max = Math.max(...values, 40000);
  return <View accessible accessibilityRole="image" accessibilityLabel={summary} style={{ height: height + 26 }}>
    <View className="flex-1 flex-row items-end justify-around gap-1.5 pb-6">
      {values.map((value, index) => <View key={index} className="h-full flex-1 items-center justify-end">
        <View className="w-full max-w-[28px] rounded-t-lg" style={{ height: Math.max(4, Math.min(height, value / max * height)), backgroundColor: index === highlight ? colors.brand : colors.chart }} />
        <Text className={`absolute -bottom-[22px] text-xs ${index === highlight ? 'font-strong text-brand' : 'text-muted'}`}>{labels[index]}</Text>
      </View>)}
    </View>
    <View className="absolute bottom-6 left-0 right-0 border-t border-line" />
  </View>;
}

export function GradientTile({ children, colors: stops, className = '' }: { children: React.ReactNode; colors: [string, string, ...string[]]; className?: string }) {
  return <View className={`overflow-hidden rounded-3xl ${className}`}><LinearGradient colors={stops} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>{children}</LinearGradient></View>;
}

/* ---------- Bottom sheet ---------- */

export function Sheet({ visible = true, close, title, children }: { visible?: boolean; close: () => void; title: string; children: React.ReactNode }) {
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={close} statusBarTranslucent>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end bg-[#0B2523AA]">
      <Pressable onPress={close} className="absolute inset-0" accessibilityLabel="Cerrar" />
      <View className="max-h-[92%] rounded-t-[28px] bg-panel px-5 pb-8 pt-3">
        <View className="mb-3 h-1.5 w-10 self-center rounded-full bg-line" />
        <View className="mb-4 flex-row items-center justify-between gap-3">
          <Text accessibilityRole="header" className="flex-1 font-heavy text-xl text-ink">{title}</Text>
          <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="Cerrar" className="h-11 w-11 items-center justify-center rounded-full bg-canvas active:opacity-70"><Ionicons name="close" size={22} color={colors.muted} /></Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}
