import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { auth, firestore } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import PostCard from "./PostCard";
import Toast from "react-native-toast-message";
import { RefreshControl } from "react-native-gesture-handler";
import HomeHeader from "./HomeHeader";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function Home({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const user = auth.currentUser;
  if (!user) {
    console.error("User is not authenticated.");
    return;
  }


  // fetch user posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const postsRef = collection(firestore, "posts");
        const q = query(
          postsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(userPosts);
        setFilteredPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("User not authenticated");
    }
  }, []);
  

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Real-Time Update and other users' posts
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const postsRef = collection(firestore, "posts");
      const q = query(postsRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(userPosts);
        setFilteredPosts(userPosts);
      });

      return () => unsubscribe();
    }
  }, []);

  // Delete function
  const handleDeletePost = async (postId) => {
    try {
      Toast.show({
        type: "info",
        text1: "投稿が削除されました",
        position: "bottom",
      });
      setTimeout(async () => {
        await deleteDoc(doc(firestore, "posts", postId));
        setPosts(posts.filter((post) => post.id !== postId));
        setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
      }, 2000);
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  // Refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const user = auth.currentUser;
    setTimeout(async () => {
      if (user) {
        try {
          const postsRef = collection(firestore, "posts");
          const q = query(postsRef, orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const userPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const shuffledPosts = shuffleArray(userPosts);
          setPosts(shuffledPosts);
          setFilteredPosts(shuffledPosts);
        } catch (error) {
          console.error("Error refreshing posts:", error);
        } finally {
          setRefreshing(false);
        }
      }
    }, 2000);
  }, []);

  // Filter posts based on search text
  useEffect(() => {
    if (searchText === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          (post.caption?.toLowerCase() || "").includes(
            searchText?.toLowerCase()
          ) ||
          (post.username?.toLowerCase() || "").includes(
            searchText?.toLowerCase()
          )
      );
      setFilteredPosts(filtered);
    }
  }, [searchText, posts]);

  // scroll refresh
  const flatListRef = useRef(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
      onRefresh(); // Call the refresh function
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  // PostCard
  const renderItem = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        username={item.username}
        userImage={item.userImage}
        navigation={navigation}
        deletePost={() => handleDeletePost(item.id)}
        profileId={item.userId}
      />
    ),
    [navigation, filteredPosts]
  );

  // Loading
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={styles.loadingIndicator}
      />
    );
  }


  return (
    <View style={styles.container}>
      <HomeHeader setSearchText={setSearchText} />
      {filteredPosts.length === 0 ? (
        <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', marginBottom: 20}}>探している投稿は見つかりません！</Text>
          <Image source={{uri: 'https://imgcdn.sigstick.com/UtqnP5qfHci0PIzj0jgT/cover-1.thumb256.png'}} style={{width: 200, height: 200}}/>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F3F1FF",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
