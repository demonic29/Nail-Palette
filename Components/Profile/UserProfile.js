import React from "react";
import { View } from "react-native";
import Profile from "./Profile";
import { useRoute } from '@react-navigation/native'; // To get the userId

export default function UserProfile() {
  const route = useRoute();
  const { userId } = route.params; // Access the userId from the navigation params

  return (
    <View>
      <Profile userId={userId} /> {/* Pass userId to the Profile component */}
    </View>
  );
}
