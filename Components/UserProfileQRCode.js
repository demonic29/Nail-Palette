import React from 'react';
import QRCode from 'qrcode'
import { View, Text, StyleSheet } from 'react-native';

export default function UserProfileQRCode({ userQr }) {
  const profileData = JSON.stringify({
    username: userQr.username,
    email: userQr.email,
    userImage: userQr.userImage,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{userQr.username}</Text>
      <QRCode
        value={profileData}
        size={200}
        backgroundColor='white'
        color='black'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  username: {
    fontSize: 20,
    marginBottom: 10,
  },
});
