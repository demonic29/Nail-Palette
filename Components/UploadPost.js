import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore, storage } from '../firebase/firebase'; // Adjust the path to your firebaseConfig file
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export default function UploadPost() {
  const insets = useSafeAreaInsets();
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState(''); // Tags as a comma-separated string
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [name, setName] = useState(null);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.username);
            setUserImage(userData.userImage);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        Alert.alert('Error', 'ユーザーデータの取得に失敗しました。');
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
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

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const uploadPost = async () => {
    if (!images.length || !caption || !tags) {
      Alert.alert('エラー', '最低 1 つの画像を選択し、キャプションとタグを入力してください。');
      return;
    }

    setUploading(true);

    try {
      let imageUrls = [];

      // image upload
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const blob = await response.blob();
        const filename = images[i].substring(images[i].lastIndexOf('/') + 1);
        const storageRef = ref(storage, `${auth.currentUser.uid}/posts/${filename}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }

      const tagsArray = tags.split(',').map(tag => tag.trim());

      await addDoc(collection(firestore, 'posts'), {
        userId: auth.currentUser.uid,
        username: name,
        userImage: userImage,
        imageUrls,
        caption,
        tags: tagsArray, // Store tags array in Firestore
        createdAt: serverTimestamp(),
      });

      setUploading(false);
      Alert.alert('完成', 'この投稿をアップロードしました。');
      setImages([]);
      setCaption('');
      setTags('');
    } catch (error) {
      setUploading(false);
      console.error('Error during upload process:', error.message);
      Alert.alert('Error', '投稿のアップロードに失敗しました。');
    }
  };

  return (
    <ScrollView keyboardDismissMode='on-drag' style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>画像を選択</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={styles.captionInput}
        placeholder="キャプションを入力。。。"
        value={caption}
        onChangeText={setCaption}
      />

      <TextInput
        style={styles.tagsInput}
        placeholder="タグを入力 (例: nature, travel)"
        value={tags}
        onChangeText={setTags}
      />

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
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  tagsInput: {
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
