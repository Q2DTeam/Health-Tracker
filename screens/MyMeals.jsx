import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Import components
import ItemCard from '../components/ItemCard';
import MealItem from '../components/MealItem';

export default function MyMeals() {
    return (
        <View style={{backgroundColor: '#F2F5FC', flex: 1, padding: 24,}}>
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1,}}>
                <MealItem type='breakfast' />
            </View>
        </View>
    )
}