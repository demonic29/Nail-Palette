import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './Router/BottomTabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PostCard from './Components/PostCard';

const Stack = createStackNavigator();

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
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
