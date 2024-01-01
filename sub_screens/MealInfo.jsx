import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { auth } from '../utils/firebase';
import { db } from '../utils/firestore';
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import AddMeal from './AddMeal';


export default function MealInfo({ navigation, route }) {
    const { title, date } = route.params;
    const uid = auth.currentUser.uid;
    const [meal, setMeal] = useState([]);
    const [addModal, setAddModal] = useState(false);
    const [modified, setModified] = useState(false);

    class Record {
        constructor (userID, type, date, meal) {
            this.userID = userID;
            this.type = type;
            this.date = date;
            this.meal = meal;
        }
    }

    const recordConverter = {
        toFirestore: (data) => {
            return {
                userID: uid,
                type: title,
                date: date,
                meal: meal
            };
        },
        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options);
            return new Record(data.userID, data.type, data.date, data.meal);
        }
    }

    const saveMealToDb = async() => {
        const rec = new Record(uid, title, date, meal);
        const docID = `${uid}-${date}-${title}`;
        try {
            await setDoc(doc(db, "user_records", docID).withConverter(recordConverter), rec);
        }
        catch(err) {
            console.log("Error saving meal to firestore");
        }
    }

    const saveMealToLocal = async() => {
        const rec = new Record(uid, title, date, meal);
        const recObj = recordConverter.toFirestore(rec);
        try {
            const jsonValue = JSON.stringify(recObj);
            await AsyncStorage.setItem(title, jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const getMealLocal = async(type) => {
        try {
            const value = await AsyncStorage.getItem(type);
            if (value !== null) {
                const meal = JSON.parse(value);
                if (meal.date == date && meal.userID == uid) {
                    setMeal(meal.meal);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    function Header() {
        const sumNutrition = (meal) => {
            let kcal = 0;
            meal.map((item) => {
                kcal += item.kcal;
            })
            return kcal
        }

        const mealKcal = sumNutrition(meal);

        const handleGoBack = () => {
            if (modified == true) {
                saveMealToDb();
                saveMealToLocal();
            }
            navigation.goBack();
        }

        return (
            <View style={globalStyles.header}>
                <View style={styles.top}>
                    <TouchableOpacity style={globalStyles.backButton} onPress={handleGoBack}>
                        <MaterialCommunityIcons name='chevron-left' size={40} color='#fff' />
                    </TouchableOpacity>
                    <Text style={globalStyles.headerTitle}>{title[0].toUpperCase() + title.slice(1)}</Text>
                    <Text style={styles.kcalText}>{Math.round(mealKcal)} kcal</Text>
                </View>
            </View>
        )
    }

    function AddButton() {
        return (
            <TouchableOpacity 
                style={styles.addBtn} 
                onPress={() => {
                    setAddModal(true);
                }}
            >
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
                style={{margin: 0}}
            >
                <View style={{flex: 1}}>
                    <AddMeal 
                        title={title} 
                        closeModal={() => {
                            setAddModal(false)
                        }} 
                        meal={meal}
                        setMeal={setMeal}
                        modified={() => {setModified(true)}}
                    />
                </View>
            </Modal>
        )
    }

    function ItemCard({ type, id, name, serving, unit, kcal }) {
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

        const handleDelete = () => {
            Alert.alert('Confirm delete', 'Do you want to delete this food?', [
                {
                    text: 'Yes',
                    onPress: () => {
                        setModified(true);
                        const newMeal = meal.filter((item) => item.id != id);
                        setMeal(newMeal);
                        Toast.show({
                            type: 'success',
                            text1: 'Food was deleted from your diary',
                        });
                    },
                },
                {
                    text: 'Cancel',
                },
            ]);
        }

        return (
            <View style={cardStyles.card}>
                <View style={{
                    backgroundColor: color,
                    width: 10, 
                    height: '100%' 
                }}/>
                <View style={cardStyles.cardBody}>
                    <Text style={cardStyles.cardTitle}>{name}</Text>
                    <Text style={cardStyles.cardSubtext}>{serving} {unit} - {kcal} kcal</Text>
                </View>
                <TouchableOpacity style={cardStyles.deleteBtn} onPress={handleDelete}>
                    <AntDesign name='close' size={18} color='#fff'/>
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(() => {
        getMealLocal(title);
    }, []);

    return (
        <View style={[globalStyles.container, {alignItems: 'center'}]}>
            <AddModal />
            <Header />
            <AddButton />
            <FlatList 
                data={meal}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <ItemCard
                        type={title}
                        id={item.id} 
                        name={item.name} 
                        serving={item.serving}
                        unit={item.unit}
                        kcal={item.kcal}
                    />
                )}
            />
            <Toast />
        </View>
    )
}

const styles = StyleSheet.create({
    top: {
        margin: 10,
        marginTop: 20,
        padding: 5,
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