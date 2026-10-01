import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDemo } from '@/context/DemoContext';
import { Button, Field, GradientTile } from '@/components/ui';

export default function Login() {
  const { ready, loggedIn, login } = useDemo();
  const [email, setEmail] = useState('demo@xpense.app');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  if (!ready) return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator color="#6759d8" /></View>;
  if (loggedIn) return <Redirect href="/(tabs)/inicio" />;
  return <SafeAreaView className="flex-1 bg-canvas"><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1"><ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }} keyboardShouldPersistTaps="handled">
    <View className="mb-7 flex-row items-center gap-3"><View className="h-11 w-11 rotate-[-9deg] items-center justify-center rounded-2xl bg-purple"><Text className="text-3xl font-black text-white">x</Text></View><Text className="text-[27px] font-black tracking-[-1.3px] text-ink">Xpense</Text></View>
    <GradientTile colors={['#252443', '#5144bd']} className="mb-6"><View className="min-h-[190px] justify-between p-6"><View><Text className="text-[11px] font-extrabold uppercase tracking-[1.4px] text-[#c1c0df]">Tu dinero, con perspectiva</Text><Text className="mt-3 max-w-[260px] text-[27px] font-black leading-[32px] tracking-[-1px] text-white">Disfruta la U. Cuida tu futuro.</Text></View><View className="flex-row items-center gap-2"><Ionicons name="sparkles" size={16} color="#d5f5e7" /><Text className="text-xs text-[#dad9ee]">Un panorama claro de tus finanzas</Text></View></View></GradientTile>
    <View className="rounded-[23px] border border-[#edebe7] bg-panel p-5"><Text className="text-2xl font-black tracking-[-0.8px] text-ink">Hola de nuevo 👋</Text><Text className="mb-6 mt-2 text-xs leading-5 text-muted">Inicia sesión para explorar el demo de Xpense.</Text><Field label="Correo" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="demo@xpense.app" /><Field label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholder="demo1234" />{error ? <Text className="mb-3 text-xs font-semibold text-orange">{error}</Text> : null}<Button label="Entrar al demo" className="mt-1 w-full" onPress={() => { if (login(email, password)) router.replace('/(tabs)/inicio'); else setError('Usa el correo y la contraseña de prueba que aparecen abajo.'); }} /><View className="mt-5 rounded-xl bg-lavender p-4"><Text className="text-xs font-extrabold text-purple">Acceso de prueba</Text><Text className="mt-1 text-xs leading-[19px] text-[#6b688d]">Correo: demo@xpense.app{'\n'}Contraseña: demo1234</Text></View></View>
    <Text className="mt-6 text-center text-[11px] leading-[17px] text-muted">Demo local · Sin backend, pagos reales ni conexión bancaria</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
