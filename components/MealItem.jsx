// Display a full meal

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Import global styles
import { globalColors } from '../global/styles';


// Sample item list, delete later



export default function MealItem({ type }) {
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

    const [isExpanded, setExpanded] = React.useState(false);

    return (
        <View style={styles.mealContainer}>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, color: color }}>Breakfast</Text>
                <Text style={styles.mealKcal}>537 kcal</Text>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    mealContainer: {
        width: 334,
        minHeight: 75,
        borderWidth: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
    },
    mealKcal: {
        fontSize: 20,
    },
});