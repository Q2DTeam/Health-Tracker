import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingAction } from "react-native-floating-action";
import { useNavigation } from '@react-navigation/native';
import { globalColors } from '../global/styles';
import { useNavigation } from '@react-navigation/native';
// Import global styles
import { globalStyles } from '../global/styles';
import { useNavigation } from '@react-navigation/native';
// Import global styles
import { globalStyles } from '../global/styles';

// Action buttons components
const actions = [

    {
        text: "Exercise",
        icon: <MaterialCommunityIcons name='dumbbell' size={24} color='#fff' />,
        name: "exercise",
        color: globalColors.vibrantBlue,
        textBackground: globalColors.vibrantBlue,
        textColor: '#fff',
        position: 1
    },
    {
        text: "Breakfast",
        icon: <MaterialCommunityIcons name='coffee' size={24} color='#fff' />,
        name: "breakfast",
        color: globalColors.breakfastGreen,
        textBackground: globalColors.breakfastGreen,
        textColor: '#fff',
        position: 2
    },
    {
        text: "Lunch",
        icon: <MaterialCommunityIcons name='food-drumstick' size={24} color='#fff' />,
        name: "lunch",
        color: globalColors.lunchOrange,
        textBackground: globalColors.lunchOrange,
        textColor: '#fff',
        position: 3
    },
    {
        text: "Dinner",
        icon: <MaterialCommunityIcons name='food-turkey' size={24} color='#fff' />,
        name: "dinner",
        color: globalColors.dinnerCyan,
        textBackground: globalColors.dinnerCyan,
        textColor: '#fff',
        position: 4
    },
    {
        text: "Snack",
        icon: <MaterialCommunityIcons name='food-apple' size={24} color='#fff' />,
        name: "snack",
        color: globalColors.snackPurple,
        textBackground: globalColors.snackPurple,
        textColor: '#fff',
        position: 5
    },
    
];
//Xu ly su kien
export default function ActionButton({ handleNavigation }) {
    const navigation = useNavigation();
    const handleActionPress = (name) => {
        if (name === 'exercise') {
            navigation.navigate('Exercise');
        } else if (name === 'breakfast') {
            navigation.navigate('Breakfast');
        } else if (name === 'lunch') {
            navigation.navigate('Lunch');
        } else if (name === 'dinner') {
            navigation.navigate('Dinner');
        } else if (name === 'snack') {
            navigation.navigate('Snack');
        }
    }
    useNavigation();
    useEffect(() => {

        handleNavigation();

    }, []);
    return (<TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
        <FloatingAction
          actions={actions}
          onPressItem={handleActionPress}
          color={globalColors.chillCyan}
          distanceToEdge={15}
          overlayColor='rgba(255, 255, 255, 0.75)'
          showBackground={true}
        />
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});