// Display nutrients eaten (carbs, proteins, fats)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NutriValue({title, consumed, total}) {
    return (
        <View style={styles.kcalWrapper}>
            <Text style={styles.kcalValue}>{title}</Text>
            <Text style={styles.kcalText}>{consumed} / {total}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    kcalWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 100,
    },
    kcalValue: {
        fontSize: 16,
        color: "#fff",
        fontFamily: 'inter-regular',
    },
    kcalText: {
        fontSize: 12,
        color: "#fff",
        fontFamily: 'inter-semibold',
    }
});