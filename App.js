
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import MainRouter from './Router/MainRouter';


export default function App() {
  // LogBox.ignoreAllLogs();
  // registerNNPushToken(22761, "ec7mjQoE4RdofW06bQj1bp");

  return (
    <SafeAreaProvider>
     <MainRouter/>
     <Toast/> 
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
