import { StyleSheet } from "react-native";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
//Create michellanious
export const michellanious = function KcalValue({icon, title, value}) {
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