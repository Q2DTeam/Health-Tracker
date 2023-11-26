// Display a full meal

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import global styles
import { globalColors } from '../global/styles';
import ItemCard from './ItemCard';


export default function MealItem({ type, kcal=0 }) {

    let color;
    let image;
    switch (type) {
        case 'breakfast':
            image = require('../assets/images/breakfast_img.jpg');
            break;
        case 'lunch':
            image = require('../assets/images/lunch_img.jpg');
            break;
        case 'dinner':
            image = require('../assets/images/dinner_img.jpg');
            break;
        case 'snack':
            image = require('../assets/images/snack_img.jpg');
            break;
    }

    const expandHandler = () => {
        setExpanded(old => !old);
    }

    const [foodList, setFoodList] = React.useState([]);

    return (
        <ImageBackground style={styles.mealContainer} source={image} alt='Background image' resizeMode='cover'>
            <View style={styles.titleContainer}>
                <View style={{marginLeft: 20}}>
                    <Text style={{ fontSize: 18, fontFamily: 'inter-semibold' }}>{type[0].toUpperCase() + type.slice(1)}</Text>
                    <Text>{kcal} kcal</Text>
                </View>
                <TouchableOpacity style={styles.detailBtn}>
                    <MaterialCommunityIcons name='pencil-box' size={30} />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    mealContainer: {
        width: 334,
        minHeight: 80,
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailBtn: {
        justifyContent: 'center',
        marginRight: 10,
    },
});