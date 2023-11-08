// The Home screen, used for navigation of screens
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


// Import Stack screens
import HomeMain from './screens/HomeMain';
import AddMeal from './screens/AddMeal';
import FoodInfo from './sub_screens/FoodInfo';


export default function HomeNavigation() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name="HomeMain" 
                component={HomeMain}
                options={homeOptions} 
            />
            <Stack.Screen 
                name="AddMeal" 
                component={AddMeal}
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