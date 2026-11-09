import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';
import { colors } from '@/components/ui';
import type { IconName } from '@/lib/demo';

const icons = { hoy: 'home', gemelo: 'sparkles', comida: 'restaurant', movimientos: 'receipt' } as const;

export default function TabLayout() {
  const { ready, loggedIn } = useDemo();
  if (!ready) return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator color={colors.brand} /></View>;
  if (!loggedIn) return <Redirect href="/login" />;
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.brand, tabBarInactiveTintColor: '#5B706D',
    tabBarLabelStyle: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold' },
    tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: colors.line, paddingTop: 6 },
    tabBarIcon: ({ color, size, focused }) => {
      const base = icons[route.name as keyof typeof icons];
      return <Ionicons name={(focused ? base : `${base}-outline`) as IconName} size={size} color={color as string} />;
    },
  })}>
    <Tabs.Screen name="hoy" options={{ title: 'Hoy' }} />
    <Tabs.Screen name="gemelo" options={{ title: 'Gemelo' }} />
    <Tabs.Screen name="comida" options={{ title: 'Comida' }} />
    <Tabs.Screen name="movimientos" options={{ title: 'Movimientos' }} />
  </Tabs>;
}
