import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Share, Modal, TextInput, ScrollView, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// firebase settings
import { getAuth } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db, firestore } from '../firebase/firebase';

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

  const commentBoxSection = () => {
    setCommentBox(!commentBox);
  };

  const likeIconChange = () => {
    setLikeIcon(!likeIcon);
  };

  const favoriteIconChange = async () => {
    const user = getAuth().currentUser;
    
    if (user) {
      const savedPostRef = doc(firestore, 'savedPosts', `${user.uid}_${post.id}`);
  
      if (favoriteIcon) {
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
      } else {
        // Unsave the post
        try {
          await deleteDoc(savedPostRef);
          console.log('Post unsaved successfully');
        } catch (err) {
          console.error('Error unsaving post', err);
        }
      }
    }
  
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

  // Text Expansion
  const [isExpanded, setIsExpanded] = useState(false); 

  // toogle expand
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // toogle function
  const renderCaption = () => {
    if (post.caption.length > 50) {
      return (
        <Text style={styles.caption}>
          {isExpanded ? post.caption : `${post.caption.substring(0, 50)}...`}
          <TouchableOpacity onPress={toggleExpand}>
            <Text style={styles.seeMoreText}>{isExpanded ? ' see less' : ' see more'}</Text>
          </TouchableOpacity>
        </Text>
      );
    }
    return <Text style={styles.caption}>{post.caption}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <TouchableOpacity>
              <Image source={{ uri: post.userImage }} style={{ width: 40, height: 40, borderRadius: 28 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{post.username}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('MenuBar', { post, deletePost })}>
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
          {renderCaption()}
        </View>
      </View>

      <Modal visible={isImagePreviewVisible} transparent={true} onRequestClose={closeImagePreview}>
        <TouchableOpacity style={styles.imagePreviewContainer} onPress={closeImagePreview}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          <TouchableOpacity
            style={[
              styles.closeButton,
              { top: insets.top + 20, right: 20 },
            ]}
            onPress={closeImagePreview}
          >
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postImage: {
    width: width - 40,
    height: 300,
    borderRadius: 15,
    marginVertical: 10,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 10,
  },
  likeCount: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 25,
    // letterSpacing: 0.7
  },
  seeMoreText: {
    color: '#8C51D7',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#8C51D7',
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: width * 1,
    height: height * 0.5,
    borderRadius: 15,
  },
  imagePreviewCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
