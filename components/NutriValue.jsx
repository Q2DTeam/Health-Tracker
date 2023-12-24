// Display nutrients eaten (carbs, proteins, fats)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function NutriValue({ title, consumed, total }) {
    return (
        <div className="kcalWrapper">
            <span className="kcalValue">{title}</span>
            <span className="kcalText">{consumed} / {total}</span>
        </div>
    );
}

export default NutriValue;

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