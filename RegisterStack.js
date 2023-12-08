import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

// Import screens
import Register from './screens/Register';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Navigation from './Navigation';
import SignUpBMI from './sub_screens/SignUpBMI';


export default function RegisterStack() {
    const user = auth.currentUser;

    useEffect(() =>{
        if (user == null) {
            console.log("RUn this");
        }
    }, [])
    
    return (
        <Stack.Navigator 
            screenOptions={{headerShown: false}}
            initialRouteName={user ? 'Main' : 'Register'}
        >
            <Stack.Screen 
                name="Register" 
                component={Register} />
            <Stack.Screen 
                name="Login" 
                component={Login} />
            <Stack.Screen 
                name="Signup" 
                component={SignUp} />
            <Stack.Screen 
                name="SignUpBMI" 
                component={SignUpBMI} />
            <Stack.Screen 
                name="Main" 
                component={Navigation} />
        </Stack.Navigator>
    )
}