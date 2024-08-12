import { Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Components
import Home from '../Components/Home';
import Favorite from '../Components/Favorite';
import UploadPost from '../Components/UploadPost';
import Profile from '../Components/Profile';

// Icons
const homeIcon = require('../assets/imgs/home.png');
const favoriteIcon = require('../assets/imgs/favorite.png');
const postIcon = require('../assets/imgs/post.png');
const profileIcon = require('../assets/imgs/profile.png');

const Tabs = createBottomTabNavigator();

export default function BottomTabs({fresh}) {
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#8C51D7',
        tabBarShowLabel : false,

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

          if (route.name === 'Home') {
            iconName = homeIcon;
          } else if (route.name === 'Favorite') {
            iconName = favoriteIcon;
          } else if (route.name === 'UploadPost') {
            iconName = postIcon;
          } else if (route.name === 'Profile') {
            iconName = profileIcon;
          }

          return <Image source={iconName} style={{ width: 50, height: 50, borderRadius : '50%', marginTop : 30 }} />;
        },
      })}
    >
      <Tabs.Screen
        fresh={fresh}
        name="Home"
        component={Home}
      />
      <Tabs.Screen
        
        name="Favorite"
        component={Favorite}
      />
      <Tabs.Screen
        name="UploadPost"
        component={UploadPost}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
      />
    </Tabs.Navigator>
  );
}
