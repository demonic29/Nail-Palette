import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, FlatList, Button } from 'react-native';
import React, { useState, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FavoriteContext } from './FavoriteContext';

export default function Favorite() {
  const insets = useSafeAreaInsets();
  const { favoriteAlbums } = useContext(FavoriteContext);
  const [favoriteModal, setFavoriteModal] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Modal
        presentationStyle='pageSheet'
        animationType='slide'
        visible={favoriteModal}
        onRequestClose={() => {
          setFavoriteModal(false);
        }}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Favorite Albums</Text>
            <TouchableOpacity onPress={() => setFavoriteModal(false)}>
              <Ionicons name='close-circle' size={30} color='#8C51D7' />
            </TouchableOpacity>
          </View>
          <FlatList
            data={favoriteAlbums}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.albumCard}>
                <Text style={styles.albumName}>{item.name}</Text>
                {/* Add more details or actions if needed */}
              </View>
            )}
            contentContainerStyle={styles.flatListContent}
          />
          <View style={styles.modalFooter}>
            <Button title="Close" onPress={() => setFavoriteModal(false)} color='#8C51D7' />
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setFavoriteModal(true)} style={styles.favoriteButton}>
        <Image source={require('../assets/imgs/addFavorite.png')} style={styles.favoriteImage} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F3F1FF',
  },
  favoriteButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteImage: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  albumCard: {
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600',
  },
  flatListContent: {
    flexGrow: 1,
    marginBottom: 20,
  },
  modalFooter: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});
