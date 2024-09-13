import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUpInfos({ navigation }) {

  const insets = useSafeAreaInsets();
  const [inputs, setInputs] = useState({
    address: '',
    phone: '',
    account: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
    setErrors({ ...errors, [name]: value.trim() ? '' : '入力してください' });
  };

  const handleNextPress = () => {
    // Check if any input is empty
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      if (!inputs[key].trim()) {
        newErrors[key] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      Alert.alert('エラー', 'すべてのフィールドを入力してください！');
    } else {
      navigation.navigate('SignUp');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <ScrollView keyboardDismissMode='on-drag' contentContainerStyle={styles.inputInfo} >

        <Text style={styles.title}>情報入力</Text>

        <View>
          <Text style={styles.label}>住所</Text>
          <TextInput
            style={[styles.input, errors.address && { borderColor: 'red' }]}
            onChangeText={(value) => handleInputChange('address', value)}
            autoCapitalize='none'
          />
          {errors.address && <Text style={styles.error}>{errors.address}</Text>}
        </View>

        <View>
          <Text style={styles.label}>電話番号</Text>
          <TextInput
            style={[styles.input, errors.phone && { borderColor: 'red' }]}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType='numeric'
          />
          {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
        </View>

        <View>
          <Text style={styles.label}>口座番号</Text>
          <TextInput
            style={[styles.input, errors.account && { borderColor: 'red' }]}
            onChangeText={(value) => handleInputChange('account', value)}
            keyboardType='numeric'
          />
          {errors.account && <Text style={styles.error}>{errors.account}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="戻る" onPress={() => navigation.navigate('Login')} color={'#000'} />
          </View>

          <View style={styles.nextButtonWrapper}>
            <Button 
              title='次へ' 
              color={'#fff'} 
              onPress={handleNextPress} 
              disabled={Object.values(errors).some(error => error)} 
            />
          </View>
        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F1FF',
    flex: 1,
  },
  inputInfo: {
    justifyContent: 'center',
    gap: 15,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#8C51D7',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 40,
  },
  buttonWrapper: {
    borderWidth: 1,
    paddingHorizontal: 50,
    borderRadius: 50,
    borderColor: '#8C51D7',
  },
  nextButtonWrapper: {
    backgroundColor: '#8C51D7',
    paddingHorizontal: 50,
    borderRadius: 50,
  },
});
