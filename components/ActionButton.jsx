import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingAction } from "react-native-floating-action";

// Import global styles
import { globalColors } from '../global/styles';

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
});
export const handleActionPress = (name) => {
    switch (name) {
        case "exercise":
            console.log("Exercise");
            break;
        case "breakfast":
            console.log("Breakfast");
            break;
        case "lunch":
            console.log("Lunch");
            break;
        case "dinner":
            console.log("Dinner");
            break;
        case "snack":
            console.log("Snack");
            break;
        default:
            console.log("Default");
    }
}
const itemStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
});

const addButton = [ 
    styles.container,
    {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
    }
];
