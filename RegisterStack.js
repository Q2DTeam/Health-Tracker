import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './utils/firebase';

const Stack = createNativeStackNavigator();

// Import screens
import Register from './screens/Register';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Navigation from './Navigation';


export default function RegisterStack() {
    const user = auth.currentUser;
    
    return (
        <NavigationContainer>
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
                    name="Main" 
                    component={Navigation} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}