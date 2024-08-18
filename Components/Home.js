import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { auth, firestore } from '../firebase/firebase';
import { collection, query, where, getDocs, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import PostCard from './PostCard';
import Toast from 'react-native-toast-message';

export default function Home({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const postsRef = collection(firestore, 'posts');
        const q = query(postsRef, where('userId', '==', user.uid, orderBy('createdAt', 'desc')));
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const postsRef = collection(firestore, 'posts');
      const q = query(postsRef, where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(userPosts);
      });

      return () => unsubscribe();
    }
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleDeletePost = async (postId) => {
    try {
      Toast.show({
        type: 'info',
        text1: '投稿が削除されました',
        position: 'bottom'
      })
      // Update the state to remove the deleted post from the list
      setTimeout(async() => {
        await deleteDoc(doc(firestore, 'posts', postId));
        setPosts(posts.filter(post => post.id !== postId));
      }, 2000)
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text>あなたの投稿をシェーアしよう！</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              navigation={navigation}
              deletePost={() => handleDeletePost(item.id)} // Optional
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F3F1FF',
  },
});
