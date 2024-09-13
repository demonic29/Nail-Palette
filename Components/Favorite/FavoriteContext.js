import React, { useEffect, useState } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import PostCard from '../PostCard';

const FavoriteContext = ({ route, navigation }) => {
  const { post } = route.params; 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PostCard
        post={post}
        username={post.username}
        userImage={post.userImage}
        navigation={navigation}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
});

export default FavoriteContext;
