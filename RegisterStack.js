import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Import screens
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Navigation from './Navigation';


export default function RegisterStack() {
    return (
        <Stack.Navigator 
            screenOptions={{headerShown: false}}
            initialRouteName='Welcome'
        >
            <Stack.Screen 
                name="Welcome" 
                component={Welcome} />
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
    )
}