import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Components
import Home from '../Components/Home';
import Favorite from '../Components/Favorite';
import UploadPost from '../Components/UploadPost';
import Profile from '../Components/Profile';
import FavoriteContext from '../Components/FavoriteContext';

// Icons
const homeIcon = require('../assets/imgs/home.png');
const favoriteIcon = require('../assets/imgs/favorite.png');
const postIcon = require('../assets/imgs/post.png');
const profileIcon = require('../assets/imgs/profile.png');

const Tabs = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#8C51D7',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 40,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          elevation: 5,
          marginHorizontal: 15,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'ホーム') {
            iconName = homeIcon;
          } else if (route.name === 'Favorite') {
            iconName = favoriteIcon;
          } else if (route.name === '投稿') {
            iconName = postIcon;
          } else if (route.name === 'マイページ') {
            iconName = profileIcon;
          }

          return <Image source={iconName} style={{ width: 50, height: 50, marginTop: 30 }} />;
        },
      })}
    >
      <Tabs.Screen
        name="ホーム"
        component={Home}
      />
      <Tabs.Screen
        name="Favorite"
        component={Favorite}
      />
      <Tabs.Screen
        name="投稿"
        component={UploadPost}
      />
      <Tabs.Screen
        name="マイページ"
        component={Profile}
      />
     
    </Tabs.Navigator>
  );
}
