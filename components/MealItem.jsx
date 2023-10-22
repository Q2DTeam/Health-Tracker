// Display a full meal

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Import global styles
import { globalColors } from '../global/styles';
import ItemCard from './ItemCard';


// Sample item list, delete later
const foodList = [
    {
        id: 1,
        title: 'Rice',
        info: '2 bowl x 100g - 260kcal',
    },
    {
        id: 2,
        title: 'Rice',
        info: '2 bowl x 100g - 260kcal',
    },
    {
        id: 3,
        title: 'Rice',
        info: '2 bowl x 100g - 260kcal',
    },
]


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

    const expandHandler = () => {
        setExpanded(old => !old);
    }

    return (
        <View style={styles.mealContainer}>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, color: color }}>Breakfast</Text>
                <TouchableOpacity onPress={expandHandler}>
                    <Text style={styles.mealKcal}>537 kcal</Text>
                </TouchableOpacity>
            </View>
            {
                isExpanded ? 
                <FlatList 
                    keyExtractor={(item) => item.id}
                    data={foodList}
                    renderItem={({item}) => (
                        <ItemCard title={item.title} info={item.info} type={type} />
                    )}
                />
                :
                <View/>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mealContainer: {
        width: 334,
        minHeight: 75,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,

    },
    mealKcal: {
        fontSize: 20,
    },
});