import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingAction } from "react-native-floating-action";
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
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
    const handleActionPress = (name) => {
        handleNavigation(name);
    }
    const handleAddPress = () => {
        handleNavigation('add');
    }
    const handleEditPress = () => {
        handleNavigation('edit');
    }

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
export const AddButton = ({ handleNavigation }) => {
    return (
        <TouchableOpacity style={styles.actionButton} onPress={handleNavigation}>
            <AntDesign name="plus" style={styles.actionButtonIcon} />
        </TouchableOpacity>
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
    actionButton: {
        backgroundColor: globalColors.chillCyan,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
    },
});