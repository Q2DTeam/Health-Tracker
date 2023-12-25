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
        position: 1
    },
    {
        text: "Breakfast",
        icon: <MaterialCommunityIcons name='coffee' size={24} color='#fff' />,
        name: "breakfast",
        color: globalColors.breakfastGreen,
        position: 2
    },
    {
        text: "Lunch",
        icon: <MaterialCommunityIcons name='food-drumstick' size={24} color='#fff' />,
        name: "lunch",
        color: globalColors.lunchOrange,
        position: 3
    },
    {
        text: "Dinner",
        icon: <MaterialCommunityIcons name='food-turkey' size={24} color='#fff' />,
        name: "dinner",
        color: globalColors.dinnerCyan,
        position: 4
    },
    {
        text: "Snack",
        icon: <MaterialCommunityIcons name='food-apple' size={24} color='#fff' />,
        name: "snack",
        color: globalColors.snackPurple,
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
export default function ButtonFromAction () {
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
    return (
        <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => { }}>
                <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => { }}>
                <Icon name="md-done-all" style={styles.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
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

});