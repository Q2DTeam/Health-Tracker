import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { Formik } from 'formik';
import { auth } from '../utils/firebase';
import { db, setDoc, doc } from '../utils/firestore';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const foodSchema = yup.object({
    name: yup.string()
    .label('Food name')
    .required(),
    serving: yup.number()
    .label('Serving')
    .min(0),
    unit: yup.string()
    .label('Unit'),
    calorie: yup.number()
    .label('Calorie value')
    .min(0)
    .required(),
    fat: yup.number()
    .label('Fat value')
    .min(0)
    .required(),
    protein: yup.number()
    .label('Protein value')
    .min(0)
    .required(),
    carb: yup.number()
    .label('Carb value')
    .min(0)
    .required(),
});


export default function CreateFood({ cancelFunc, foods, setFoods }) {
    const user = auth.currentUser;
    const [measure, setMeasure] = useState('g');

    const saveFoodToLocal = async(newFood) => {
        const custom_food = {
            userID: user.uid,
            foods: [newFood, ...foods]
        }
        try {
            const jsonValue = JSON.stringify(custom_food);
            await AsyncStorage.setItem('custom_foods', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const saveFoodToDb = async(newFood) => {
        const custom_food = {
            userID: user.uid,
            foods: [newFood, ...foods]
        }
        const docID = user.uid;
        try {
            await setDoc(doc(db, "custom_foods", docID), custom_food, { merge: true });
        }
        catch(err) {
            console.log("Error saving custom food to firestore: ", err);
        }
    }

    const saveFood = (values) => {
        if (values.unit.length == 0 && values.serving.length == 0) {
            Alert.alert(
                'There is a problem with input',
                'Please enter at either serving unit, serving size, or both.'
            );
            return;
        }
        let serving = 1;
        let unit = '';
        if (values.unit.length > 0 && values.serving.length > 0) {
            unit = `${values.unit} (${values.serving} ${measure})`;
        }
        else if (values.unit.length > 0) {
            unit = values.unit;
        }
        else {
            serving = values.serving;
            unit = measure;
        }
        const newFood = {
            id: Math.floor(Math.random() * 1001) + 21,
            name: values.name,
            serving: Number(serving),
            unit: unit,
            calorie: Number(values.calorie),
            fat: Number(values.fat),
            protein: Number(values.protein),
            carb: Number(values.carb),
        }
        saveFoodToLocal(newFood);
        saveFoodToDb(newFood);
        cancelFunc();
        setFoods(old => [newFood, ...old]);
    }

    function Header() {
        return (
            <View style={[globalStyles.header, {paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                <TouchableOpacity onPress={cancelFunc}>
                    <MaterialCommunityIcons name='close' color='#fff' size={30} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create new food</Text>
                <View style={{width: 30}} />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView style={globalStyles.container}
            behavior='padding'
        >
            <StatusBar style='light' />
            <Header />
            <View style={{alignItems: 'center', flex: 1}}>
            <Formik
                initialValues={{
                    name: '',
                    serving: '',
                    unit: '',
                    calorie: '',
                    fat: '',
                    protein: '',
                    carb: ''
                }}
                validationSchema={foodSchema}
                onSubmit={(values) => {
                    saveFood(values);
                }}
            >
            {
                ({handleChange, handleSubmit, values}) => (
                <ScrollView style={{width: '100%', paddingTop: 20,}}>
                    <Text style={styles.sectionHeader}>Basic Information</Text>
                    <View style={[styles.basicContainer, {padding: 20, paddingBottom: 20,}]}>
                        <TextInput
                            placeholder='Name of Food'
                            style={inputStyles.name}
                            value={values.name}
                            onChangeText={handleChange('name')}
                        />
                    </View>

                    <Text style={styles.sectionHeader}>Serving</Text>
                    <View style={styles.basicContainer}>
                        <View style={styles.servingContainer}>
                            <Text style={styles.servingTitle}>Serving unit</Text>
                            <TextInput
                                placeholder='e.g. bát, đĩa, hộp'
                                style={inputStyles.serving}
                                value={values.unit}
                                onChangeText={handleChange('unit')}
                            />
                        </View>
                        <View style={[styles.servingContainer, {justifyContent: 'space-between', marginBottom: 20}]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.servingTitle}>Serving size</Text>
                                <TextInput
                                    placeholder='100'
                                    style={[inputStyles.serving, {width: 40}]}
                                    value={values.serving}
                                    onChangeText={handleChange('serving')}
                                />
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity style={[inputStyles.measureBtn, {backgroundColor: measure == 'g' ? globalColors.breakfastGreen : '#dedede'}]}
                                    onPress={() => {setMeasure('g')}}
                                >
                                    <Text style={[inputStyles.measureText, {color: measure == 'g' ? '#fff' : '#000'}]}>g</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[inputStyles.measureBtn, {backgroundColor: measure == 'ml' ? globalColors.breakfastGreen : '#dedede'}]}
                                    onPress={() => {setMeasure('ml')}}
                                >
                                    <Text style={[inputStyles.measureText, {color: measure == 'ml' ? '#fff' : '#000'}]}>ml</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionHeader}>Nutritional values</Text>
                    <View style={[styles.basicContainer, {alignItems: 'center'}]}>
                        <View style={{width: '100%'}}>
                            <View style={styles.nutriContainer}>
                                <Text style={inputStyles.nutriText}>Calorie</Text>
                                <TextInput
                                    placeholder='required'
                                    style={inputStyles.nutriInput}
                                    value={values.calorie}
                                    onChangeText={handleChange('calorie')}
                                />
                            </View>
                            <View style={styles.nutriContainer}>
                                <Text style={inputStyles.nutriText}>Fat</Text>
                                <TextInput
                                    placeholder='required'
                                    style={inputStyles.nutriInput}
                                    value={values.fat}
                                    onChangeText={handleChange('fat')}
                                />
                            </View>
                            <View style={styles.nutriContainer}>
                                <Text style={inputStyles.nutriText}>Protein</Text>
                                <TextInput
                                    placeholder='required'
                                    style={inputStyles.nutriInput}
                                    value={values.protein}
                                    onChangeText={handleChange('protein')}
                                />
                            </View>
                            <View style={styles.nutriContainer}>
                                <Text style={inputStyles.nutriText}>Carb</Text>
                                <TextInput
                                    placeholder='required'
                                    style={inputStyles.nutriInput}
                                    value={values.carb}
                                    onChangeText={handleChange('carb')}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 25,
                            width: 200,
                            height: 40,
                            backgroundColor: globalColors.breakfastGreen
                        }} onPress={handleSubmit}>
                            <Text style={{color: '#fff', fontSize: 20,}}>Create</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 40}} />
                </ScrollView>
                )
            }
            </Formik>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'inter-semibold',
        marginVertical: 10,
        marginHorizontal: 10,
        flex: 1,
        textAlign: 'center',
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sectionHeader: {
        marginHorizontal: 20,
        fontFamily: 'inter-semibold',
        fontSize: 24,
        marginBottom: 15,
    },
    basicContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 10,
        paddingBottom: 0,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingHorizontal: 20
    },
    servingContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginVertical: 10,
    },
    servingTitle: {
        fontFamily: 'inter-regular', 
        fontSize: 16, 
        marginRight: 20
    },
    nutriContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    }
});

const inputStyles = StyleSheet.create({
    name: {
        fontSize: 16,
        borderBottomWidth: 1,
        height: 40,
        padding: 10,
    },
    serving: {
        fontSize: 16,
        borderBottomWidth: 1,
        padding: 5,
        width: 130,
    },
    measureBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 10,
    },
    measureText: {
        fontFamily: 'inter-regular',
        fontSize: 14,
    },
    nutriText: {
        fontSize: 20,
    },
    nutriInput: {
        fontSize: 18,
        width: 100,
        padding: 5,
        borderBottomWidth: 1,
    }
});