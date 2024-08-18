// UploadPost.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore, storage } from '../firebase/firebase'; // Adjust the path to your firebaseConfig file
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export default function UploadPost() {
  const insets = useSafeAreaInsets();
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null)

  const pickImage = async () => {

    // image-picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // upload-post
  const uploadPost = async () => {
    if (!images.length || !caption) {
      Alert.alert('エラー', '最低 1 つの画像を選択し、キャプションを入力してください。');
      return;
    }
  
    setUploading(true);
    console.log('Starting upload process...');
  
    try {
      let imageUrls = [];
  
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          setUser({
            ...userData,
            email: user.email,
          });
        }
      }
  
      // image upload
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const blob = await response.blob();
        const filename = images[i].substring(images[i].lastIndexOf('/') + 1);
        const storageRef = ref(storage, `${user.uid}/posts/${filename}`);
  
        console.log('Uploading image to storage...');
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }
  
      console.log('Image(s) uploaded successfully, saving to Firestore...');
      await addDoc(collection(firestore, 'posts'), {
        userId: user.uid,          // Store the user ID
        username: user.displayName, // Store the username (if available)
        userImage: user.photoURL,   // Store the user image (if available)
        imageUrls,                  // Store the image URLs
        caption,                    // Store the caption
        createdAt: serverTimestamp(), // Store the timestamp
      });
  
      console.log('Post saved to Firestore successfully.');
      setUploading(false);
      Alert.alert('完成', 'この投稿をアプロードしました。');
      setImages([]);
      setCaption('');
    } catch (error) {
      setUploading(false);
      console.error('Error during upload process:', error);
      Alert.alert('Error', error.message);
    }
  };
  

  return (
    <ScrollView keyboardDismissMode='on-drag' style={[styles.container, { paddingTop: insets.top }]}>

      {/* image-picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>画像を選択</Text>
      </TouchableOpacity>

      {/* image-preview */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePreview} />
        ))}
      </ScrollView>

      {/* text */}
      <TextInput
        style={styles.captionInput}
        placeholder="テキストを入力。。。"
        value={caption}
        onChangeText={setCaption}
      />

      {/* uploading */}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadPost} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.uploadButtonText}>投稿をアップロード</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F1FF',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3E1FF',
    height: 50,
    borderRadius: 15,
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#7C7C7C',
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 10,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#8C51D7',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
