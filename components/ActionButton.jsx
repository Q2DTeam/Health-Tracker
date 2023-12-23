import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingAction } from "react-native-floating-action";

// Import global styles
import { globalColors } from '../global/styles';

// Action buttons components
const actions = [   
    {
        style: addButton,
        text: "Exercise",
        icon: <AntDesign name="plus" color={globalColors.chillCyan} size={20} />,
        name: "exercise",
        position: 1
    },
    {
        style: addButton,
        text: "Breakfast",
        icon: <AntDesign name="plus" color={globalColors.chillCyan} size={20} />,
        name: "breakfast",
        position: 2
    },
    {
        style: addButton,
        text: "Lunch",
        icon: <AntDesign name="plus" color={globalColors.chillCyan} size={20} />,
        name: "lunch",
        position: 3
    },
    {
        style: addButton,
        text: "Dinner",
        icon: <AntDesign name="plus" color={globalColors.chillCyan} size={20} />,
        name: "dinner",
        position: 4
    },
    {
        style: addButton,
        text: "Snack",
        icon: <AntDesign name="plus" color={globalColors.chillCyan} size={20} />,
        name: "snack",
        position: 5
    },
    {
        style: addButton,
        text: "Water",
        icon: <MaterialCommunityIcons name="cup-water" color={globalColors.chillCyan} size={20} />,
        name: "water",
        position: 6
    },
    {
        style: addButton,
        text: "Weight",
        icon: <MaterialCommunityIcons name="weight-kilogram" color={globalColors.chillCyan} size={20} />,
        name: "weight",
        position: 7

    },
    {
        style: addButton,
        text: "Sleep",
        icon: <MaterialCommunityIcons name="sleep" color={globalColors.chillCyan} size={20} />,
        name: "sleep",
        position: 8
    },
    {
        style: addButton,
        text: "Mood",
        icon: <MaterialCommunityIcons name="emoticon-happy" color={globalColors.chillCyan} size={20} />,
        name: "mood",
        position: 9
    },
    {
        styles: addButton,
        text: "Notes",
        icon: <MaterialCommunityIcons name="note-text" color={globalColors.chillCyan} size={20} />,
        name: "notes",
        position: 10

    },
    {
        style: addButton,
        text: "Medication",
        icon: <MaterialCommunityIcons name="pill" color={globalColors.chillCyan} size={20} />,
        name: "medication",
        position: 11
    },
    {
        style: addButton,
        text: "Symptoms",
        icon: <MaterialCommunityIcons name="emoticon-sad" color={globalColors.chillCyan} size={20} />,
        name: "symptoms",
        position: 12
        
    }

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
