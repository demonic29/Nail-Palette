// Album.js
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { FavoriteContext } from './Favorite/FavoriteContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Album({ navigation }) {
  const { favoriteAlbums } = useContext(FavoriteContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Albums</Text>
      <FlatList
        data={favoriteAlbums}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.albumCard}>
            <Text style={styles.albumName}>{item.name}</Text>
            {/* Additional details or actions can be added here */}
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Favorite')} style={styles.button}>
        <Ionicons name="star-outline" size={30} color="#8C51D7" />
        <Text style={styles.buttonText}>View Favorites</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F1FF',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  albumCard: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600',
  },
  flatListContent: {
    flexGrow: 1,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#8C51D7',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
});
