import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

export default function MealInfo({ navigation, route }) {
    const { title } = route.params;
    const [meals, setMeals] = React.useState([]);

    function Header() {
        const handleGoBack = () => {
            navigation.goBack();
        }

        return (
            <View style={globalStyles.header}>
                <View style={styles.top}>
                    <TouchableOpacity style={globalStyles.backButton} onPress={handleGoBack}>
                        <MaterialCommunityIcons name='chevron-left' size={40} color='#fff' />
                    </TouchableOpacity>
                    <Text style={globalStyles.headerTitle}>{title[0].toUpperCase() + title.slice(1)}</Text>
                    <Text style={styles.kcalText}>{0} kcal</Text>
                </View>
            </View>
        )
    }

    function AddButton() {
        return (
            <TouchableOpacity style={styles.addBtn}>
                <MaterialCommunityIcons name='plus' size={20} />
                <Text style={styles.addText}>Add food to this meal</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={[globalStyles.container, {alignItems: 'center'}]}>
            <Header />
            <AddButton />
            <ScrollView>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    top: {
        margin: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    kcalText: {
        color: '#fff',
        fontSize: 16,
    },
    addBtn: {
        width: 300,
        padding: 10,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'dashed'
    },
    addText: {
        fontSize: 18,
        marginLeft: 10,
    },
});