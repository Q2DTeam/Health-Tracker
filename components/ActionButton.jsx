import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingAction } from "react-native-floating-action";

// Import global styles
import { globalColors } from '../global/styles';

// Action buttons components
const actions = [
    createAction("Exercise", 'dumbbell', 'exercise', globalColors.vibrantBlue, 1),
    createAction("Breakfast", 'coffee', 'breakfast', globalColors.breakfastGreen, 2),
    createAction("Lunch", 'food-drumstick', 'lunch', globalColors.lunchOrange, 3),
    createAction("Dinner", 'food-turkey', 'dinner', globalColors.dinnerCyan, 4),
    createAction("Brunch", 'food-turkey', 'brunch', globalColors.dinnerCyan, 4),
    createAction("Snack", 'food-apple', 'snack', globalColors.snackPurple, 5),
    createAction("BimBim", 'food-apple', 'snack', globalColors.snackPurple, 5),
];

function createAction(text, iconName, name, color, position) {
    return {
        text: text,
        icon: <MaterialCommunityIcons name={iconName} size={24} color='#fff' />,
        name: name,
        color: color,
        textBackground: color,
        textColor: '#fff',
        position: position
    };
}

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