import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Share, Modal, TextInput, ScrollView, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function PostCard({ navigation, post, deletePost }) {
  const insets = useSafeAreaInsets();
  const [likeIcon, setLikeIcon] = useState(true);
  const [favoriteIcon, setFavoriteIcon] = useState(true);
  const [commentBox, setCommentBox] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollViewRef = useRef(null);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  const commentBoxSection = () => {
    setCommentBox(!commentBox);
  };

  const likeIconChange = () => {
    setLikeIcon(!likeIcon);
  };

  const favoriteIconChange = () => {
    setFavoriteIcon(!favoriteIcon);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImagePreviewVisible(true);
  };

  const closeImagePreview = () => {
    setIsImagePreviewVisible(false);
    setSelectedImage(null);
  };

  if (!post) {
    return <Text>Loading...</Text>;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(userData)
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <TouchableOpacity>
              <Image source={{ uri: user?.userImage }} style={{ width: 40, height: 40, borderRadius: 28 }} />

            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{user?.username}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('MenuBar', {post,deletePost})}>
            <Ionicons name="ellipsis-vertical" size={18} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollViewRef}
        >
          {post.imageUrls &&
            post.imageUrls.map((url, index) => (
              <TouchableOpacity key={index} onPress={() => handleImagePress(url)}>
                <Image source={{ uri: url }} style={styles.postImage} />
              </TouchableOpacity>
            ))}
        </ScrollView>

        <View style={styles.pagination}>
          {post.imageUrls &&
            post.imageUrls.map((_, index) => (
              <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
            ))}
        </View>

        <View style={styles.cardBody}>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={likeIconChange}>
              <Ionicons size={28} name={likeIcon ? 'heart-outline' : 'heart'} color={likeIcon ? '#000' : '#8C51D7'} />
            </TouchableOpacity>

            <Modal
              animationType="slide"
              visible={commentBox}
              presentationStyle="pageSheet"
              onRequestClose={() => setCommentBox(!commentBox)}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: 20,
                    paddingBottom: insets.bottom,
                  }}
                >
                  <TouchableOpacity style={{ marginTop: 20 }} onPress={commentBoxSection}>
                    <Ionicons name="close-circle-outline" size={35} />
                  </TouchableOpacity>
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextInput
                      placeholder="コメントを追加。。。"
                      style={{ borderWidth: 1, borderRadius: 15, width: '80%', paddingVertical: 15, paddingLeft: 15 }}
                    />
                    <Ionicons size={18} name="send" style={{ borderWidth: 1, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 15 }} />
                  </View>
                </View>
              </View>
            </Modal>

            <TouchableOpacity onPress={commentBoxSection}>
              <Ionicons size={25} name="chatbubble-outline" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onShare}>
              <Ionicons size={25} name="share-outline" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Ionicons size={25} name="person-outline" />
            </TouchableOpacity>
            <TouchableOpacity onPress={favoriteIconChange}>
              <Ionicons size={25} name={favoriteIcon ? 'star-outline' : 'star'} color={favoriteIcon ? '#000' : '#8C51D7'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{post.caption}</Text>
        </View>
      </View>

      <Modal visible={isImagePreviewVisible} transparent={true} onRequestClose={closeImagePreview}>
        <TouchableOpacity style={styles.imagePreviewContainer} onPress={closeImagePreview}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          <TouchableOpacity style={[styles.closeButton, { top: insets.top + 20,
    right: 20,}]} onPress={closeImagePreview}>
            <Ionicons name="close" size={30} color="#FFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F1FF',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 20
  },
  postImage: {
    width: width - 70,
    height: 350,
    borderRadius: 15,
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#8C51D7',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  cardFooter: {
    marginTop: 10,
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: width - 20,
    height: height / 2,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
   
  },
});
