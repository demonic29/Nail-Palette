// FavoriteContext.js
import React, { createContext, useState } from 'react';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);

  const addAlbum = (album) => {
    setFavoriteAlbums((prevAlbums) => [...prevAlbums, album]);
  };

  return (
    <FavoriteContext.Provider value={{ favoriteAlbums, addAlbum }}>
      {children}
    </FavoriteContext.Provider>
  );
};
