import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'

export default function Loading() {
  return (
    <View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8C51D7" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})