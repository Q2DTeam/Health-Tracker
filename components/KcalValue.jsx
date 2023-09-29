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
            <Text>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    kcalWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    kcalValue: {
        fontSize: 26,

    }
});