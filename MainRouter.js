import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './Router/BottomTabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PostCard from './Components/PostCard';
import MenuBar from './Components/MenuBar';
import Toast from 'react-native-toast-message';
const Stack = createNativeStackNavigator();

export default function MainRouter() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='BottomTabs'
            component={BottomTabs}
            options={{
              headerTintColor: 'white',
              headerShadowVisible: false,
              headerShown: false,
          }}
          />
          <Stack.Screen
            name='PostCard'
            component={PostCard}
          />
           <Stack.Screen
            name='MenuBar'
            component={MenuBar}
            options={
              {
                presentation: 'formSheet',
                sheetAllowedDetents: 'all',
                sheetLargestUndimmedDetent: 'all',
                sheetCornerRadius: 20,
                sheetGrabberVisible: true,
                sheetExpandsWhenScrolledToEdge: false,
                headerTitle : '投稿設定'
              }
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
      
    </GestureHandlerRootView>
  );
}
