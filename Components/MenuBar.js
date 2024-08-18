
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

export default function MenuBar({ route, navigation}) {

    const {post, deletePost} = route.params

    const infos = [
      { icon: 'star', text: 'お気に入りに追加', desc: 'お気に入りに追加します' },
      { icon: 'person', text: 'プロフィール', desc: 'プロフィールに移動します'},
      { icon: 'bookmark', text: '保存' , desc: '保存済みのアイテムに追加します'},
      { icon: 'trash', text: '削除', delete: true, desc: '削除アイテムに移動します' },
    ];

   

    const handleDelete = () => {
      deletePost(post.id)
      navigation.goBack();
    }
  
    return (
      <View style={styles.container}>
        <FlatList
          style={{ paddingHorizontal: 20 , backgroundColor: 'white' }}
          data={infos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
                style={{ flexDirection: 'row', gap: 15, marginTop: 25, alignItems: 'center', borderBottomColor: '#0002', borderBottomWidth: 1 , paddingBottom: 20}}
                onPress={item.delete ? handleDelete : () => {}}
              >
                <Ionicons name={item.icon} size={27} color="purple" />
                <View>
                  <Text style={{fontWeight: 'bold', fontSize: 20, color: 'purple'}}>{item.text}</Text>
                  <Text style={{color: '#0008', fontSize: 13}}>{item.desc}</Text>
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
    }
});
