import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { auth, firestore } from '../firebase/firebase';
import { collection, query, where, getDocs, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import PostCard from './PostCard';
import Toast from 'react-native-toast-message';

export default function Home ({navigation}){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const postsRef = collection(firestore, 'posts');
        const q = query(postsRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
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
      const q = query(postsRef, user.uid, orderBy('createdAt', 'desc'));
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

  const handleDeletePost = async (postId) => {
    try {
      Toast.show({
        type: 'info',
        text1: '投稿が削除されました',
        position: 'bottom'
      });
      setTimeout(async () => {
        await deleteDoc(doc(firestore, 'posts', postId));
        setPosts(posts.filter(post => post.id !== postId));
      }, 2000);
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        username={item.username}
        userImage={item.userImage}
        navigation={navigation}
        deletePost={() => handleDeletePost(item.id)}
      />
    ),
    [navigation, posts]
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text>あなたの投稿をシェアしよう！</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={10} // Number of items to render initially
          maxToRenderPerBatch={5} // Number of items rendered at a time
          windowSize={10} // Number of items to keep in memory outside of the visible area
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F3F1FF',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// export default Home;
