import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image } from 'react-native';
import { auth, firestore, storage } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userImage, setUserImage] = useState(null); // New state for the user image
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false); // New state to manage uploading state

  // Function to pick an image from the device
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserImage(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    if (username === '' || email === '' || password === '' || !userImage) {
      Alert.alert('All fields including image are required.');
      return;
    }

    try {
      setUploading(true); // Start uploading state
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload image to Firebase Storage
      const response = await fetch(userImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      // Monitor the upload process
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can implement upload progress feedback here if needed
        },
        (error) => {
          console.error('Image upload failed:', error);
          setUploading(false);
        },
        async () => {
          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save user info to Firestore including the image URL
          await setDoc(doc(firestore, 'users', user.uid), {
            username,
            email,
            id: user.uid,
            userImage: downloadURL, // Save the image URL to Firestore
          });

          setUploading(false); // End uploading state
          Alert.alert('User registered successfully!');
          navigation.navigate('Login');
          setUsername('');
          setEmail('');
          setPassword('');
          setUserImage(null);
          setError('');
        }
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>情報入力</Text>

      <View style={{ gap: 10 }}>
        <View>
          <Text>名前</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text>メール</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text>パスワード</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View>
          <Text>画像</Text>
          <TouchableOpacity onPress={pickImage}>
            {userImage ? (
              <Image source={{ uri: userImage }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>画像を選択</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={{ flexDirection: 'row', gap: 30, marginTop: 40 }}>
        <View style={{ borderWidth: 1, paddingHorizontal: 50, borderRadius: 50, borderColor: '#8C51D7' }}>
          <Button title="戻る" onPress={() => navigation.navigate('Login')} color={'#000'} />
        </View>

        <View style={{ backgroundColor: '#8C51D7', paddingHorizontal: 50, borderRadius: 50 }}>
          <Button title={uploading ? "登録中..." : "次へ"} onPress={handleSignUp} color={'#fff'} disabled={uploading} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#8C51D7',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SignUp;
