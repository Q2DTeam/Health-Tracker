import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import AddMeal from './AddMeal';


export default function MealInfo({ navigation, route }) {
    const { title } = route.params;
    const [meals, setMeals] = React.useState([]);
    const [addModal, setAddModal] = React.useState(false);

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
            <TouchableOpacity style={styles.addBtn} onPress={() => {setAddModal(true)}}>
                <MaterialCommunityIcons name='plus' size={20} />
                <Text style={styles.addText}>Add food to this meal</Text>
            </TouchableOpacity>
        )
    }

    function AddModal() {
        return (
            <Modal
                animationType="slide"
                visible={addModal}
            >
                <View style={{
                    flex: 1
                }}>
                    <AddMeal title={title} goBack={() => {setAddModal(false)}} />
                </View>
            </Modal>
        )
    }

    function ItemCard({ title, info, type }) {
        let color;
        switch (type) {
            case 'breakfast':
                color = globalColors.breakfastGreen;
                break;
            case 'lunch':
                color = globalColors.lunchOrange;
                break;
            case 'dinner':
                color = globalColors.dinnerCyan;
                break;
            case 'snack':
                color = globalColors.snackPurple;
                break;
            default:
                color = globalColors.vibrantBlue;
                break;
        }
        return (
            <View style={cardStyles.card}>
                <View style={{
                    backgroundColor: color,
                    width: 10, 
                    height: '100%' 
                }}/>
                <View style={cardStyles.cardBody}>
                    <Text style={cardStyles.cardTitle}>{title}</Text>
                    <Text style={cardStyles.cardSubtext}>{info}</Text>
                </View>
                <TouchableOpacity style={cardStyles.deleteBtn}>
                    <AntDesign name='close' size={18} color='#fff'/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[globalStyles.container, {alignItems: 'center'}]}>
            <Header />
            <AddButton />
            <AddModal />
            <ScrollView>
                {
                    meals.map(item => (
                        <ItemCard title='sample item' info='sample info' type='breakfast' />
                    ))
                }
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

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: 334,
        minHeight: 75,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginVertical: 7,
    },
    cardBody: {
        padding: 10,
        paddingLeft: 20,
        width: 280,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'inter-semibold',
        marginBottom: 5,
    },
    cardSubtext: {
        fontFamily: 'inter-regular',
        color: '#9DA8C3',
    },
    deleteBtn: {
        width: 30, 
        height: 30,
        borderRadius: 15,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
    },
});