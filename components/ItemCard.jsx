// Card to display food and meal items

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function ItemCard({ title, info, color }) {
    return (
        <View style={styles.card}>
            <View style={{ backgroundColor: {color}, width: 10, height: '100%' }}></View>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtext}>{info}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn}>
                <AntDesign name='close' size={18} color='#fff'/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: 334,
        minHeight: 75,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    cardBody: {
        padding: 10,
        paddingLeft: 20,
        width: 280,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'inter-semibold',
        marginBottom: 5,
    },
    cardSubtext: {
        fontFamily: 'inter-regular',
        color: '#9DA8C3',
    },
    deleteBtn: {
        width: 30, 
        height: 30,
        borderRadius: 15,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
    },
});