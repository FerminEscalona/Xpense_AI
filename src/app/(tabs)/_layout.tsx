import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';

const icons = {
  inicio: 'home-outline', analisis: 'stats-chart-outline', gemelo: 'sparkles-outline',
  pagos: 'wallet-outline', vincular: 'card-outline',
} as const;

export default function TabLayout() {
  const { ready, loggedIn } = useDemo();
  if (!ready) return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator color="#6759d8" /></View>;
  if (!loggedIn) return <Redirect href="/login" />;
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: '#6759d8', tabBarInactiveTintColor: '#7e8091',
    tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
    tabBarStyle: { backgroundColor: '#fffefa', borderTopColor: '#e9e7e2', height: 64, paddingTop: 7, paddingBottom: 8 },
    tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name as keyof typeof icons]} size={size} color={color} />,
  })}>
    <Tabs.Screen name="inicio" options={{ title: 'Inicio' }} />
    <Tabs.Screen name="analisis" options={{ title: 'Análisis' }} />
    <Tabs.Screen name="gemelo" options={{ title: 'Gemelo IA' }} />
    <Tabs.Screen name="pagos" options={{ title: 'Pagos' }} />
    <Tabs.Screen name="vincular" options={{ title: 'Vincular' }} />
  </Tabs>;
}
