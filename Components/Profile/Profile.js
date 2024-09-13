// Core Components
import { View, Text, Image, Button, TouchableOpacity, ActivityIndicator, FlatList, Alert, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import PostCard from '../PostCard';

// hooks
import React, { useState, useEffect, useRef } from 'react';

// functions
import { ScrollView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// firebase
import { auth, firestore, storage } from '../../firebase/firebase';
import { deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';


const Profile = ({ userId, navigation}) => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [undoPost, setUndoPost] = useState(null);

const [follower, setFollower] = useState([
  { count: 112, text: "フォロー" },
  { count: 123, text: "フォロワー" },
  { count: 321, text: "いいね" }
]);

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
      // console.log(postsArray)
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

  // undo-post
  const handleUndo = () => {
    if (undoPost) {
      setPosts((prevPosts) => [undoPost, ...prevPosts]);
      setUndoPost(null);
      Toast.hide();
    }
  };


  // loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8C51D7" />
      </View>
    );
  }

  // Qrcode
  // const qrCodeRef = useRef()
  // const handleShare = async () => {
  //   try {
  //     const uri = await captureRef(qrCodeRef, {
  //       format: 'png',
  //       quality: 1,
  //     });
  //     await Sharing.shareAsync(uri);
  //   } catch (error) {
  //     console.error('Error sharing QR code:', error.message);
  //   }
  // };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', userId); // Use the passed userId
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            ...userData,
            email: userDoc.data().email, // Fetch and set user email
          });
          setImage(userData.userImage);
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchUserData();
  }, [userId]);

    // Fetch user's posts based on the passed userId
    useEffect(() => {
      if (userId) {
        const q = query(collection(firestore, 'posts'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const postsArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(postsArray);
        });
        return () => unsubscribe();
      }
    }, [userId]);
    
  

  return (

    loading ? <ActivityIndicator size="small" color="#0000ff"/> : 
    
    <ScrollView style={{marginBottom: insets.bottom, paddingTop: insets.top, backgroundColor: '#F3F1FF', height: '100%', padding: 10}}>

      <View style={styles.header}>

        <Image
          source={{uri: user?.userImage}}
          style={styles.profileImg}
        />

        <Text style={{ fontSize: 18, marginBottom: 20, fontWeight: 'bold', marginTop: 10 }}>{user?.username}</Text>

        {/* <View ref={qrCodeRef}>
          <QRCode value='https://example.com/profile/username' />
        </View> */}

        {/* <Button title='Share Profile' onPress={handleShare}/> */}

        <FlatList
          data={follower}
          keyExtractor={(item, index) => `${item.text}-${index}`}
          renderItem={({ item }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 5, marginRight: 20}}>

              <View style={{borderWidth:1, width:50, height: 50, borderRadius: 25, justifyContent: 'center', borderColor: '#8C51D7',}}>
                <Text style={{ fontWeight: 'bold',textAlign: 'center',}}>{item.count}</Text>
              </View>

              <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>{item.text}</Text>
            </View>
          )}
          horizontal={true}
          contentContainerStyle={{ marginBottom: 20 }}
        />


        <View style={{flexDirection: 'row',gap: 20, paddingHorizontal: 80}}>
          <TouchableOpacity style={styles.followBtn} onPress={() => navigation.navigate('UserProfileQRCode')}>
            <Text style={{color: 'white', fontSize: 12}}>プロフィールシートを見る</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followBtn}  onPress={() => navigation.navigate('UserProfileQRCode')}>
            <Text style={{color: 'white', fontSize: 12}}>フォローを外す</Text>
          </TouchableOpacity>
        </View>


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
  },
  followBtn: {
    backgroundColor: '#8C51D7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius:10,
    marginBottom: 20
  }
})