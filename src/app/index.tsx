import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';

export default function Index() {
  const { ready, loggedIn } = useDemo();
  if (!ready) return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator color="#0F766E" /></View>;
  return <Redirect href={loggedIn ? '/(tabs)/hoy' : '/login'} />;
}
