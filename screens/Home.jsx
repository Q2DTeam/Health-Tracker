// The Home screen, used for navigation of screens

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


// Import Stack screens
import HomeMain from './HomeMain';
import AddMeal from './AddMeal';


export default function Home() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name="HomeMain" 
                component={HomeMain}
                options={homeOptions} />
            <Stack.Screen 
                name="AddMeal" 
                component={AddMeal}
                options={addMealOptions} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({

});

const homeOptions = {
    headerShown: false,
};

const addMealOptions = {
    animation: 'slide_from_bottom',
};