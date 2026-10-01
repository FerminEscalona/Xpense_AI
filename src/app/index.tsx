import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useDemo } from '@/context/DemoContext';

export default function Index() {
  const { ready, loggedIn } = useDemo();
  if (!ready) return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator color="#6759d8" /></View>;
  return <Redirect href={loggedIn ? '/(tabs)/inicio' : '/login'} />;
}
