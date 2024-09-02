// Favorite.js
import React, { useState, useEffect } from "react";
import { View, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useNavigation } from '@react-navigation/native'; // Use navigation hook

const Favorite = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getAuth().currentUser;
  const navigation = useNavigation(); // Use navigation hook

  const numColumns = 3; 
  const screenWidth = Dimensions.get("window").width;
  const imageSize = (screenWidth - 10) / numColumns - 10;

  useEffect(() => {
    if (user) {
      const q = query(
        collection(firestore, "savedPosts"),
        where("userId", "==", user.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const favoriteData = [];
        querySnapshot.forEach((doc) => {
          favoriteData.push(doc.data());
        });
        setSavedPosts(favoriteData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching saved posts:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() =>
              navigation.navigate("FavoriteContext", { post: item.postData })
            }
            activeOpacity={0.7} // Add activeOpacity for feedback
          >
            <Image
              source={{ uri: item.postData.imageUrls[0] }}
              style={[styles.image, { width: imageSize, height: imageSize }]}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#F3F1FF",
  },
  imageContainer: {
    margin: 5,
    borderRadius: 10,
    overflow: "hidden", // Ensure corners are rounded
    elevation: 3, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    borderRadius: 10,
  },
});

export default Favorite;
