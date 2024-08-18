import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, TouchableOpacity, ActivityIndicator, FlatList, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore, storage } from '../firebase/firebase'; // Assuming you have a firebaseConfig file set up
import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PostCard from './PostCard';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const Profile = ({navigation,}) => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [undoPost, setUndoPost] = useState(null);


  //safe area
  const insets = useSafeAreaInsets();

  // posts
  const [posts, setPosts] = useState([]);

  const currentUser = auth.currentUser;
  useEffect(() => {
    const q = query(collection(firestore, 'posts'),where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log(postsArray)
      setPosts(postsArray)
    })
    return () => unsubscribe();
  }, [])


  // user name and email
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // console.log(userData)
            setUser({
              ...userData,
              email: user.email,
            });
            setImage(userData.userImage);
          }
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const response = await fetch(uri);
      const blob = await response.blob();  // Ensure this is correct
      const imageRef = ref(storage, `userImages/${user.uid}`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
  
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        userImage: imageUrl,
      });
  
      setImage(imageUrl);
      alert('Profile image updated!');
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
   // delete-post
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

    loading ? <ActivityIndicator size="small" color="#0000ff"/> : 
    
    <ScrollView style={{marginBottom: insets.bottom, paddingTop: insets.top, backgroundColor: '#F3F1FF', height: '100%',}}>

      <View style={styles.header}>

        <Image
          source={{uri: user?.userImage}}
          style={styles.profileImg}
        />

        <Text style={{ fontSize: 18, marginBottom: 50 }}>{user?.username}</Text>

        {/* <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'blue' }}>Change Profile Image</Text>
        </TouchableOpacity> */}
      </View>
      
      {loading && <ActivityIndicator size="small" color="#0000ff" />}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <PostCard
            post={item}
            navigation={navigation}
            deletePost={deletePost}
          />
        )}
        contentContainerStyle={styles.flatlistContainer}
      />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create( {
  header: {
    justifyContent: 'center', alignItems: 'center'
  },
  profileImg:{
    width: 100, height: 100, borderRadius: 50, marginBottoms: 20
  },
  flatlistContainer: {
    marginBottom: 20
  }

})