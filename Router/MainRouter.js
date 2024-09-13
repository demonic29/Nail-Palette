import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PostCard from "../Components/PostCard";
import MenuBar from "../Components/MenuBar";
import Toast from "react-native-toast-message";
import SignUp from "../Components/UserAuth/SignUp";
import Login from "../Components/UserAuth/Login";
import SignUpInfos from "../Components/UserAuth/SignUpInfos";
import FavoriteContext from "../Components/Favorite/FavoriteContext";
import HomeHeader from "../Components/HomeHeader";
import UserProfile from "../Components/Profile/UserProfile";
import UserProfileQRCode from "../Components/Profile/UserProfileQRCode";
const Stack = createNativeStackNavigator();

export default function MainRouter() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='User Info'
            component={SignUpInfos}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name='SignUp'
            component={SignUp}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BottomTabs"
            component={BottomTabs}
            options={{
              headerTintColor: "white",
              headerShadowVisible: false,
              headerShown: false,
            }}
          />


          <Stack.Screen name="PostCard" component={PostCard} />

          <Stack.Screen
            name="MenuBar"
            component={MenuBar}
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: "all",
              sheetLargestUndimmedDetent: "all",
              sheetCornerRadius: 20,
              sheetGrabberVisible: true,
              sheetExpandsWhenScrolledToEdge: false,
              headerTitle: "投稿設定",
            }}
          />


<Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{
              presentation: "modal",
            }}
          />

          <Stack.Screen
            name="FavoriteContext"
            component={FavoriteContext}
            options={{
              presentation: "modal",
              // sheetAllowedDetents: 'all',
              // sheetAllowedDetents: 'medium',
              sheetLargestUndimmedDetent: "all",
              sheetCornerRadius: 20,
              sheetGrabberVisible: true,
              headerTitle: "保存",
              sheetExpandsWhenScrolledToEdge: false,
            }}
          />

          <Stack.Screen
            name="HomeHeader"
            component={HomeHeader}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="UserProfileQRCode"
            component={UserProfileQRCode}
            options={{
              presentation: "modal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
