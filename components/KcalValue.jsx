// Display values of kcal burned or eaten

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function KcalValue({icon, title, value}) {
    return (
        <View style={styles.kcalWrapper}>
            <MaterialCommunityIcons 
                name={icon} 
                size={30}
                color={icon === 'fire' ? '#FFA935' : '#2ED12E'}
            />
            <Text style={styles.kcalValue}>{value}</Text>
            <Text style={styles.kcalText}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    kcalWrapper: {
        //borderWidth: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: 75,
    },
    kcalValue: {
        fontSize: 26,
        fontFamily: 'inter-semibold',
    },
    kcalText: {
        fontSize: 12,
        color: "#9DA8C3",
        fontFamily: 'inter-regular',
    }
});