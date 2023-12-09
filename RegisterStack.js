import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Import screens
import Register from './screens/Register';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Navigation from './Navigation';
import SignUpBMI from './sub_screens/SignUpBMI';


export default function RegisterStack() {
    return (
        <Stack.Navigator 
            screenOptions={{headerShown: false}}
            initialRouteName='Register'
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