import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, SafeAreaView, Alert } from 'react-native';
import { firestore } from '../firebase';
import PostCard from '../Components/PostCard';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import Loading from './Loading';

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [undoPost, setUndoPost] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deletePost = (postId) => {
    Alert.alert(
      '投稿削除',
      'この投稿を本当に削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除', style: 'destructive', onPress: () => {

            // Optimistically remove the post from the UI
            const postToDelete = posts.find((post) => post.id === postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            setUndoPost(postToDelete); // Store the post for possible undo
  
            // Show a Toast message with Undo option
            Toast.show({
              type: 'info',
              text1: '投稿を削除しました。',
              // text2: '削除しない',
              position: 'bottom',
              onPress: () => handleUndo(),
              visibilityTime: 3000, // Display for 3 seconds
            });
  
            // Start the deletion process after a delay
            setTimeout(async () => {
              if (!undoPost) { // If undo hasn't been triggered
                try {
                  await deleteDoc(doc(firestore, 'posts', postId));
                } catch (error) {
                  console.error('Error deleting post:', error);
                  Alert.alert('Error', 'Could not delete post. Please try again later.');
                }
              } else {
                setUndoPost(null); // Clear the undo state after the delay
              }
            }, 3000);
          }
        }
      ]
    );
  };
  
  const handleUndo = () => {
    if (undoPost) {
      setPosts((prevPosts) => [undoPost, ...prevPosts]);
      setUndoPost(null);
      Toast.hide();
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8C51D7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            navigation={navigation}
            deletePost={deletePost}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;