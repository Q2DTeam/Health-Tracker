// The Home screen, used for navigation of screens
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


// Import Stack screens
import HomeMain from './screens/HomeMain';
import MealInfo from './sub_screens/MealInfo';
import ActivityInfo from './sub_screens/ActivityInfo';


export default function HomeNavigation() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name="HomeMain" 
                component={HomeMain}
                options={homeOptions} 
            />
            <Stack.Screen 
                name="MealInfo" 
                component={MealInfo}
                options={{
                    animation: 'simple_push'
                }}
            />
            <Stack.Screen 
                name="ActivityInfo" 
                component={ActivityInfo}
                options={{
                    animation: 'simple_push'
                }}
            />
        </Stack.Navigator>
    )
}

const homeOptions = {
    headerShown: false,
};