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
                color={icon === 'fire' ? '#FFA935' : '#B575E7'}
            />
            <Text style={styles.kcalValue}>{value}</Text>
            <Text style={styles.kcalText}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    kcalWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 75,
    },
    kcalValue: {
        fontSize: 24,
        color: "#fff",
        fontFamily: 'inter-semibold',
    },
    kcalText: {
        fontSize: 16,
        color: "#fff",
        fontFamily: 'inter-regular',
    }
});