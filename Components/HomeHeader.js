import { View, Text, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function HomeHeader({ setSearchText }) {
    const insets = useSafeAreaInsets();
    const [showSearch, setShowSearch] = useState(false);

    return (
        <View style={{ paddingTop: insets.top }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#8C51D7' }}>Nail Palette</Text>

                <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
                    <Image source={require('../assets/imgs/search.png')} />
                </TouchableOpacity>
            </View>
            {showSearch && (
                <TextInput
                    style={{
                        height: 40,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        marginBottom: 20
                    }}
                    placeholder="テキスト入力。。。"
                    onChangeText={text => setSearchText(text)}
                />
            )}
        </View>
    )
}
