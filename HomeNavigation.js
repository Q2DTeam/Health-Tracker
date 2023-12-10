// The Home screen, used for navigation of screens
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


// Import Stack screens
import HomeMain from './screens/HomeMain';
import FoodInfo from './sub_screens/FoodInfo';
import MealInfo from './sub_screens/MealInfo';


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
                options={addMealOptions} 
            />
            <Stack.Screen
                name="FoodInfo"
                component={FoodInfo}
                options={addMealOptions} 
            />
        </Stack.Navigator>
    )
}

const homeOptions = {
    headerShown: false,
};

const addMealOptions = {
    animation: 'slide_from_bottom',
};