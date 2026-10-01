import '../../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoProvider } from '@/context/DemoContext';
import { ExpenseModal, LinkModal, Toast } from '@/components/overlays';

export default function RootLayout() {
  return <SafeAreaProvider><DemoProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false }} />
    <ExpenseModal /><LinkModal /><Toast />
  </DemoProvider></SafeAreaProvider>;
}
