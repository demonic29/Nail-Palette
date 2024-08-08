import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainRouter from './MainRouter';
import Album from './Components/Album';
import { FavoriteProvider } from './Components/FavoriteContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoriteProvider>
        <MainRouter/>
      </FavoriteProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
