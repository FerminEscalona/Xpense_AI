import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDemo } from '@/context/DemoContext';
import { categoryStyle, dayStart, money, Transaction } from '@/lib/demo';

export function Screen({ title, children }: { title: string; children: React.ReactNode }) {
  const { notify, logout } = useDemo();
  return <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
    <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-9 w-9 rotate-[-9deg] items-center justify-center rounded-xl bg-purple"><Text className="text-2xl font-black text-white">x</Text></View>
          <View><Text className="text-lg font-black tracking-[-0.8px] text-ink">Xpense</Text><Text className="text-[10px] font-semibold text-muted">{title}</Text></View>
        </View>
        <View className="flex-row gap-2">
          <Pressable accessibilityLabel="Notificaciones" onPress={() => notify('Todo al día. Tu gemelo está cuidando tu meta.')} className="h-9 w-9 items-center justify-center rounded-xl border border-line bg-panel"><Ionicons name="notifications-outline" size={19} color="#7e8091" /></Pressable>
          <Pressable accessibilityLabel="Cerrar sesión" onPress={() => { logout(); router.replace('/login'); }} className="h-9 w-9 items-center justify-center rounded-xl border border-line bg-panel"><Ionicons name="log-out-outline" size={19} color="#7e8091" /></Pressable>
        </View>
      </View>
      {children}
    </ScrollView>
  </SafeAreaView>;
}

export function Heading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <View className="mb-6"><Text className="mb-2 text-[11px] font-extrabold uppercase tracking-[1.3px] text-purple">✳ {eyebrow}</Text><Text className="text-[31px] font-black leading-[36px] tracking-[-1.5px] text-ink">{title}</Text><Text className="mt-2 text-[13px] leading-5 text-muted">{subtitle}</Text></View>;
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <View className={`rounded-[23px] border border-[#edebe7] bg-panel p-[19px] ${className}`}>{children}</View>;
}

export function CardHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <View className="mb-5 flex-row items-start justify-between gap-2"><View className="flex-1"><Text className="text-[17px] font-extrabold tracking-[-0.5px] text-ink">{title}</Text>{subtitle ? <Text className="mt-1 text-xs leading-[18px] text-muted">{subtitle}</Text> : null}</View>{action}</View>;
}

export function Button({ label, onPress, secondary = false, className = '', disabled = false }: { label: string; onPress: () => void; secondary?: boolean; className?: string; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} className={`min-h-11 items-center justify-center rounded-xl px-4 ${secondary ? 'bg-lavender' : 'bg-purple'} ${disabled ? 'opacity-50' : ''} ${className}`}><Text className={`text-[13px] font-extrabold ${secondary ? 'text-purple' : 'text-white'}`}>{label}</Text></Pressable>;
}

export function SmallLink({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress}><Text className="text-xs font-extrabold text-purple">{label}</Text></Pressable>;
}

export function Chip({ label, tone = 'purple' }: { label: string; tone?: 'purple' | 'green' | 'orange' }) {
  const style = tone === 'green' ? 'bg-mint text-green' : tone === 'orange' ? 'bg-peach text-orange' : 'bg-lavender text-purple';
  return <View className={`self-start rounded-full px-3 py-[7px] ${style.split(' ')[0]}`}><Text className={`text-[10px] font-extrabold ${style.split(' ')[1]}`}>{label}</Text></View>;
}

export function Progress({ value, color = '#6759d8' }: { value: number; color?: string }) {
  return <View className="h-2 overflow-hidden rounded-full bg-[#eeedf3]"><View style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} className="h-full rounded-full" /></View>;
}

export function Insight({ title, children }: { title: string; children: React.ReactNode }) {
  return <View className="flex-row gap-3 rounded-[17px] border border-[#e9e5ff] bg-[#f2f0ff] p-4"><View className="h-8 w-8 items-center justify-center rounded-[10px] bg-purple"><Text className="text-lg font-bold text-white">✦</Text></View><View className="flex-1"><Text className="text-xs font-extrabold text-ink">{title}</Text><Text className="mt-1 text-xs leading-[18px] text-[#6b688d]">{children}</Text></View></View>;
}

export function TransactionList({ items, empty = 'Aún no hay movimientos.' }: { items: Transaction[]; empty?: string }) {
  if (!items.length) return <Text className="py-4 text-xs text-muted">{empty}</Text>;
  return <View>{items.map((item, index) => {
    const style = categoryStyle[item.category] || categoryStyle.Otros;
    const date = dayStart(item.at) === dayStart(new Date()) ? 'Hoy' : new Date(item.at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    return <View key={item.id} className={`flex-row items-center gap-3 py-3 ${index < items.length - 1 ? 'border-b border-[#f1f0ed]' : ''}`}>
      <View style={{ backgroundColor: style.background }} className="h-[38px] w-[38px] items-center justify-center rounded-xl"><Text className="text-lg">{style.emoji}</Text></View>
      <View className="flex-1"><Text numberOfLines={1} className="text-xs font-bold text-ink">{item.name}</Text><Text className="mt-1 text-[10px] text-muted">{item.category} · {date}{item.source === 'auto' ? ' · Auto' : ''}</Text></View>
      <Text className="text-xs font-extrabold text-ink">− {money(item.amount)}</Text>
    </View>;
  })}</View>;
}

export function BarChart({ values, labels, highlight, height = 160 }: { values: number[]; labels: string[]; highlight: number; height?: number }) {
  const max = Math.max(...values, 40000);
  return <View className="flex-row gap-2" style={{ height: height + 25 }}>
    <View className="w-8 justify-between pb-6"><Text className="text-[10px] text-[#aaa9b5]">{Math.round(max / 1000)}k</Text><Text className="text-[10px] text-[#aaa9b5]">{Math.round(max / 2000)}k</Text><Text className="text-[10px] text-[#aaa9b5]">0</Text></View>
    <View className="flex-1"><View className="absolute left-0 right-0 top-1 border-t border-dashed border-line" /><View className="absolute left-0 right-0 border-t border-dashed border-line" style={{ top: height / 2 }} /><View className="absolute left-0 right-0 border-t border-dashed border-line" style={{ top: height }} />
      <View className="flex-1 flex-row items-end justify-around gap-1 pb-6">{values.map((value, index) => <View key={index} className="h-full flex-1 items-center justify-end"><View className="w-[24px] max-w-full rounded-t-md" style={{ height: Math.max(4, Math.min(height, value / max * height)), backgroundColor: index === highlight ? '#6759d8' : '#cac5f3' }} /><Text className={`absolute -bottom-[21px] text-[10px] ${index === highlight ? 'font-extrabold text-purple' : 'text-[#aaa9b5]'}`}>{labels[index]}</Text></View>)}</View>
    </View>
  </View>;
}

export function Field({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default', maxLength }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; secureTextEntry?: boolean; keyboardType?: 'default' | 'numeric' | 'email-address'; maxLength?: number }) {
  return <View className="mb-3"><Text className="mb-2 text-[11px] font-extrabold text-[#6c6d80]">{label}</Text><TextInput accessibilityLabel={label} className="min-h-11 rounded-xl border border-line bg-white px-3 text-[14px] text-ink" placeholder={placeholder} placeholderTextColor="#aaa8b4" value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} keyboardType={keyboardType} maxLength={maxLength} autoCapitalize="none" /></View>;
}

export function GradientTile({ children, colors, className = '' }: { children: React.ReactNode; colors: [string, string, ...string[]]; className?: string }) {
  return <View className={`overflow-hidden rounded-[23px] ${className}`}><LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>{children}</LinearGradient></View>;
}
