import { StyleSheet,View, Text, } from 'react-native';
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';

export default function SearchBar() {
    return (
        <View style={styles.container}>
            <Feather name="search" size={24} style={{ marginRight: 10 }} color="black" />
            <TextInput placeholder='Search' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})