// Card to display food and meal items

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { globalColors } from '../global/styles';


export default function ItemCard({ title, info, type }) {
    let color;
    switch (type) {
        case 'breakfast':
            color = globalColors.breakfastGreen;
            break;
        case 'lunch':
            color = globalColors.lunchOrange;
            break;
        case 'dinner':
            color = globalColors.dinnerCyan;
            break;
        case 'snack':
            color = globalColors.snackPurple;
            break;
        default:
            color = globalColors.vibrantBlue;
            break;
    }
    return (
        <View style={styles.card}>
            <View style={{
                backgroundColor: color,
                width: 10, 
                height: '100%' 
            }}/>
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
        marginVertical: 7,
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