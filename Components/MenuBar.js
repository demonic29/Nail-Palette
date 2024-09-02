import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore } from '../firebase/firebase';

export default function MenuBar({ route, navigation }) {
  const { post, deletePost } = route.params;
  const [favoriteIcon, setFavoriteIcon] = useState(false);

  const user = getAuth().currentUser;

  useEffect(() => {
    // Check if the post is already saved when the component mounts
    const checkIfSaved = async () => {
      if (user) {
        const savedPostRef = doc(firestore, 'savedPosts', `${user.uid}_${post.id}`);
        const docSnap = await getDoc(savedPostRef);

        if (docSnap.exists()) {
          setFavoriteIcon(true);
        }
      }
    };

    checkIfSaved();
  }, [user, post.id]);

  const favoriteIconChange = async () => {
    if (user) {
      const savedPostRef = doc(firestore, 'savedPosts', `${user.uid}_${post.id}`);

      if (favoriteIcon) {
        // Unsave the post
        try {
          await deleteDoc(savedPostRef);
          console.log('Post unsaved successfully');
        } catch (err) {
          console.error('Error unsaving post', err);
        }
      } else {
        // Save the post
        try {
          await setDoc(savedPostRef, {
            userId: user.uid,
            postId: post.id,
            postData: post,
          });
          console.log('Post saved successfully');
        } catch (err) {
          console.error('Error saving post', err);
        }
      }
      setFavoriteIcon(!favoriteIcon);
    }
  };

  const infos = [
    { icon: favoriteIcon ? 'star' : 'star-outline', text: favoriteIcon ? 'お気に入りから削除' : 'お気に入りに追加', desc: favoriteIcon ? 'お気に入りから削除します' : 'お気に入りに追加します', action: favoriteIconChange },
    { icon: 'person-outline', text: 'プロフィール', desc: 'プロフィールに移動します', action: () => {} },
    { icon: 'bookmark-outline', text: '保存', desc: '保存済みのアイテムに追加します', action: () => {} },
    { icon: 'trash-outline', text: '削除', delete: true, desc: '削除アイテムに移動します', action: handleDelete },
  ];

  const handleDelete = () => {
    deletePost(post.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ paddingHorizontal: 20, backgroundColor: 'white' }}
        data={infos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: 'row', gap: 15, marginTop: 25, alignItems: 'center', borderBottomColor: '#0002', borderBottomWidth: 1, paddingBottom: 20 }}
            onPress={item.delete ? handleDelete : item.action}
          >
            <Ionicons name={item.icon} size={27} color="purple" />
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'purple' }}>{item.text}</Text>
              <Text style={{ color: '#0008', fontSize: 13 }}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
