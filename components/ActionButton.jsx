import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingAction } from "react-native-floating-action";
import { globalColors } from '../global/styles';
const { vibrantBlue, breakfastGreen, lunchOrange, dinnerCyan, snackPurple } = globalColors;
import { globalStyles } from '../global/styles';
const { container } = globalStyles;
import { LoginButton } from 'react-native-fbsdk';
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
export default function NewActionButton({ navigation }) {
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState(false);
    useEffect(() => {
        console.log("ActionButton mounted");
        return () => console.log("ActionButton unmounted");
    }
    );
    useState(() => {
        console.log("ActionButton mounted");
        return () => console.log("ActionButton unmounted");
    }
    );
    constructor(params) {
        console.log("ActionButton mounted");
        super(params);
        this.state = {
            open: false,
            active: false
        };
        
    }
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            active: false
        };
    }

    return (
        <View style={styles.container}>
            <FloatingAction
                actions={actions}
                onPressItem={name => {
                    switch (name) {
                        case 'exercise':
                            navigation.navigate('Exercise');
                            break;
                        case 'breakfast':
                            navigation.navigate('Breakfast');
                            break;
                        case 'lunch':
                            navigation.navigate('Lunch');
                            break;
                        case 'dinner':
                            navigation.navigate('Dinner');
                            break;
                        case 'snack':
                            navigation.navigate('Snack');
                            break;
                    }


                }}
                color={globalColors.vibrantBlue}
                floatingIcon={<AntDesign name="plus" size={24} color="white" />}
                onPressMain={() => {
                    console.log("Pressed main action button");
                }}

            />
        </View>
    );
export default function ActionButton({ navigation }) {
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState(false);
    useEffect(() => {
        console.log("ActionButton mounted");
        return () => console.log("ActionButton unmounted");
    }
    );
    constructor(params) {
        console.log("ActionButton mounted");
        super(params);
        this.state = {
            open: false,
            active: false
        };
        
    }
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            active: false
        };
    }


    return (
        <View style={styles.container}>
            <FloatingAction
                actions={actions}
                onPressItem={name => {
                    switch (name) {
                        case 'exercise':
                            navigation.navigate('Exercise');
                            break;
                        case 'breakfast':
                            navigation.navigate('Breakfast');
                            break;
                        case 'lunch':
                            navigation.navigate('Lunch');
                            break;
                        case 'dinner':
                            navigation.navigate('Dinner');
                            break;
                        case 'snack':
                            navigation.navigate('Snack');
                            break;
                    }
                }}
                color={globalColors.vibrantBlue}
                floatingIcon={<AntDesign name="plus" size={24} color="white" />}
                onPressMain={() => {
                    console.log("Pressed main action button");
                }}
            />
            <View style={styles.button}>
                <TouchableOpacity onPress={() => setOpen(!open)}>
                    <AntDesign name="plus" size={24} color="white" />
                </TouchableOpacity>
                <LoginButton></LoginButton>
            </View>
        </View>
    );
}

//add new action button to the bottom right of the screen
//when clicked, a menu of options will appear
//each option will have a different color and icon

function ActionButton({ navigation }) {
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState(false);
    useEffect(() => {
        console.log("ActionButton mounted");
        return () => console.log("ActionButton unmounted");
    }
    );
    constructor(params) {
        console.log("ActionButton mounted");
        super(params);
        this.state = {
            open: false,
            active: false
        };
        
    }
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            active: false
        };
    }
}




const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: globalColors.vibrantBlue,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
});
