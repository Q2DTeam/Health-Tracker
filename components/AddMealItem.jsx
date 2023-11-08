// Display food items in AddMeal screen

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { globalColors, globalStyles } from '../global/styles';

export default function AddMealItem( { serving = '100g', name = 'Sample Food', kcal} ) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.infoWrapper}>
                <Text style={styles.foodName}>{name[0].toUpperCase() + name.slice(1)}</Text>
                <Text style={styles.foodKcal}>{serving} - {kcal} kcal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.addButton}>
                <AntDesign name='plus' size={28} color='#fff' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 20,
        minHeight: 80,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoWrapper: {
        flex: 1,
        marginRight: 20,
    },
    foodName: {
        fontSize: 18,
        marginBottom: 5,
    },
    foodKcal: {
        color: globalColors.textGray,
    },
});