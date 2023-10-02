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
        //borderWidth: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: 100,
    },
    kcalValue: {
        fontSize: 16,
        color: "#9DA8C3",
        fontFamily: 'inter-regular',
    },
    kcalText: {
        fontSize: 12,
        fontFamily: 'inter-semibold',
    }
});