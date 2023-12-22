import { StyleSheet } from "react-native";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment'; 
//Create michellanious
export const michellanious = StyleSheet.create({
    wheelContainer: {
        width: 334,
        height: 180,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    details: {
        justifyContent: 'space-around',
        height: 120,
    },
    infoItem: {
        minWidth: 100,
        flexDirection: 'row',
    },
    infoName: {
        marginLeft: 10,
        fontSize: 16,
    },
});