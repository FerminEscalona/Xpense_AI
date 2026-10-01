import React from 'react';
import { Text, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { money, sorted } from '@/lib/demo';
import { Button, Card, CardHeading, Chip, Heading, Screen, TransactionList } from '@/components/ui';

export default function Vincular() {
  const { data, openLink, unlinkBank, reset } = useDemo();
  const linked = !!data.linkedBank;
  return <Screen title="Vincular banco"><Heading eyebrow="Lista para la U" title="Vincula tu banco" subtitle="Vincula tu banco para que Xpense traiga tus movimientos automáticamente y los analice por ti." />
    {!linked ? <><Card className="mb-4"><View className="mb-5 flex-row items-start justify-between gap-2"><View className="flex-1"><Text className="text-[17px] font-extrabold text-ink">Aún no tienes una cuenta vinculada</Text><Text className="mt-1 text-xs leading-[18px] text-muted">Sin conexión, sigues registrando tus gastos a mano</Text></View><Chip label="Sin vincular" tone="orange" /></View><View className="rounded-[13px] bg-[#f8f7f3] p-4"><Text className="text-xs leading-[19px] text-muted">Al vincular tu cuenta, Xpense recibe automáticamente tus movimientos (con tu autorización) y los clasifica por ti, sin que tengas que anotarlos uno por uno.</Text></View><Button label="Vincular banco" className="mt-4 w-full" onPress={openLink} /></Card>
      <Card><CardHeading title="¿Cómo funciona la vinculación?" subtitle="El mismo modelo que usan las apps de finanzas personales" />{['1. Eliges tu banco', '2. Inicias sesión de forma segura con tu banco', '3. Autorizas qué datos compartir con Xpense'].map(item => <Text key={item} className="border-b border-line py-3 text-xs text-ink">{item}</Text>)}<View className="mt-4 rounded-[13px] bg-[#f8f7f3] p-4"><Text className="text-xs leading-[19px] text-muted">En una versión real, Xpense no vería ni guardaría tus credenciales bancarias: la conexión la manejaría un proveedor autorizado. Este demo no se conecta a ningún banco.</Text></View></Card></> : <><Card className="mb-4"><View className="mb-5 flex-row items-start justify-between gap-2"><View className="flex-1"><Text className="text-[17px] font-extrabold text-ink">{data.linkedBank} vinculado</Text><Text className="mt-1 text-xs text-muted">Sincronización simulada activa</Text></View><Chip label="Vinculada" tone="green" /></View>{[
        ['Cuenta', data.linkedMask || ''], ['Saldo detectado', money(data.balance)],
        ['Última sincronización', data.linkedAt ? new Date(data.linkedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 'Hace un momento'],
      ].map(([label, value]) => <View key={label} className="flex-row items-center justify-between border-b border-line py-3"><Text className="text-xs text-ink">{label}</Text><Text className="text-xs font-extrabold text-ink">{value}</Text></View>)}<View className="mt-4 rounded-[13px] bg-[#f8f7f3] p-4"><Text className="text-xs leading-[19px] text-muted">Estos movimientos son datos de ejemplo añadidos automáticamente. No se ha accedido a una cuenta bancaria real.</Text></View><Button label="Desvincular cuenta" secondary className="mt-4 w-full" onPress={unlinkBank} /></Card><Card><CardHeading title="Movimientos sincronizados" subtitle="Traídos automáticamente en el demo" /><TransactionList items={sorted(data.transactions).filter(item => item.source === 'auto').slice(0, 6)} empty="Aún no hay movimientos sincronizados." /></Card></>}
    <Button label="Restaurar datos de ejemplo" secondary className="mt-5 self-center" onPress={reset} />
  </Screen>;
}
