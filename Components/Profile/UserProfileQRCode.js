import React from 'react';
import QRCode from 'qrcode'
import { View, Text, StyleSheet, Image } from 'react-native';

export default function UserProfileQRCode({ userQr }) {
  // const profileData = JSON.stringify({
  //   username: userQr.username,
  //   email: userQr.email,
  //   userImage: userQr.userImage,
  // });

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/imgs/profilesheet.png")} style={{}}/>
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
