import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingAction } from "react-native-floating-action";
// Import global styles
import { globalColors } from '../global/styles';
const { vibrantBlue, breakfastGreen, lunchOrange, dinnerCyan, snackPurple } = globalColors;
import { globalStyles } from '../global/styles';
const { container } = globalStyles;
import { LoginButton } from 'react-native-fbsdk';
import { LoginManager } from 'react-native-fbsdk';
import { AccessToken } from 'react-native-fbsdk';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';


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
