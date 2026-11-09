import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDemo } from '@/context/DemoContext';
import { Button, colors, Field, FormError, GradientTile, Text } from '@/components/ui';

export default function Login() {
  const { ready, loggedIn, login } = useDemo();
  const [email, setEmail] = useState('demo@xpense.app');
  const [password, setPassword] = useState('demo1234');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  if (!ready) return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator color={colors.brand} /></View>;
  if (loggedIn) return <Redirect href="/(tabs)/hoy" />;
  return <SafeAreaView className="flex-1 bg-canvas"><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1"><ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }} keyboardShouldPersistTaps="handled">
    <GradientTile colors={['#0B4F4A', '#0F766E']} className="mb-6">
      <View className="min-h-[200px] justify-between p-6">
        <View className="flex-row items-center gap-3"><View className="h-11 w-11 items-center justify-center rounded-2xl bg-white"><Ionicons name="wallet" size={24} color={colors.brand} /></View><Text className="font-heavy text-2xl text-white">Xpense</Text></View>
        <Text accessibilityRole="header" className="font-heavy text-[28px] leading-[34px] text-white">Disfruta la U.{'\n'}Cuida tu futuro.</Text>
      </View>
    </GradientTile>
    <Field label="Correo" value={email} onChangeText={setEmail} keyboardType="email-address" />
    <Field label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry={!show} right={<Pressable accessibilityRole="button" accessibilityLabel={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} onPress={() => setShow(!show)} className="h-11 w-11 items-center justify-center"><Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.muted} /></Pressable>} />
    <FormError message={error} />
    <Button label="Entrar" className="w-full" onPress={() => { if (login(email, password)) router.replace('/(tabs)/hoy'); else setError('Correo o contraseña incorrectos. Prueba con los datos que ya aparecen.'); }} />
    <Text className="mt-5 text-center text-xs leading-[18px] text-muted">Demo con datos de ejemplo · Sin conexión bancaria real</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
