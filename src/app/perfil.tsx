import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDemo } from '@/context/DemoContext';
import { money, sorted } from '@/lib/demo';
import { Button, Card, CardHeading, Chip, colors, Text, TransactionList } from '@/components/ui';

export default function Perfil() {
  const { data, openLink, unlinkBank, reset, logout } = useDemo();
  const linked = !!data.linkedBank;
  return <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <View className="mb-6 flex-row items-center gap-3">
        <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={() => router.back()} className="h-12 w-12 items-center justify-center rounded-full bg-white active:opacity-70"><Ionicons name="arrow-back" size={22} color={colors.ink} /></Pressable>
        <Text accessibilityRole="header" className="font-heavy text-[26px] text-ink">Mi perfil</Text>
      </View>
      <Card className="mb-5 flex-row items-center gap-4">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-brand"><Text className="font-heavy text-2xl text-white">S</Text></View>
        <View><Text className="font-strong text-lg text-ink">Sam</Text><Text className="text-sm text-muted">demo@xpense.app</Text></View>
      </Card>
      <Card className="mb-5">
        <CardHeading title="Cuenta bancaria" subtitle={linked ? 'Tus movimientos se anotan solos.' : 'Vincula tu banco para registrar gastos automáticamente.'} action={linked ? <Chip label="Vinculada" tone="green" /> : undefined} />
        {linked ? <>
          {[['Banco', data.linkedBank || ''], ['Cuenta', data.linkedMask || ''], ['Saldo detectado', money(data.balance)]].map(([label, value]) => <View key={label} className="flex-row items-center justify-between border-b border-line py-3"><Text className="text-sm text-muted">{label}</Text><Text className="font-strong text-sm text-ink">{value}</Text></View>)}
          <Text className="mb-1 mt-4 font-strong text-sm text-ink">Movimientos sincronizados</Text>
          <TransactionList items={sorted(data.transactions).filter(item => item.source === 'auto').slice(0, 4)} empty="Aún no hay movimientos sincronizados." />
          <Button label="Desvincular cuenta" variant="secondary" onPress={unlinkBank} className="mt-3 w-full" />
        </> : <Button label="Vincular mi banco" icon="link-outline" onPress={openLink} className="w-full" />}
      </Card>
      <Card>
        <CardHeading title="Sesión y demo" />
        <Button label="Restaurar datos de ejemplo" variant="secondary" onPress={reset} className="mb-3 w-full" />
        <Button label="Cerrar sesión" variant="ghost" icon="log-out-outline" onPress={() => { logout(); router.replace('/login'); }} className="w-full" />
      </Card>
    </ScrollView>
  </SafeAreaView>;
}
