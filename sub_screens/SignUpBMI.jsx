// Second screen of SignUp screen, navigated to after clicking the Sign up button


import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { Formik } from 'formik';
import { auth, db, setDoc, doc } from '../utils/firebase';
import * as yup from 'yup';
import Slider from "react-native-a11y-slider";

// Import icons
import { MaterialCommunityIcons } from '@expo/vector-icons';


function Header({ backFunc }) {
    return (
        <View style={[globalStyles.header, {height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,}]}>
            <TouchableOpacity style={globalStyles.backButton} onPress={backFunc}>
                <MaterialCommunityIcons name='chevron-left' size={30} />
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={globalStyles.headerTitle}>Update your BMI</Text>
            </View>
        </View>
    )
}

function GenderButton({ value, setValue }) {
    return (
        <View style={styles.genderContainer}>
            <TouchableOpacity 
                style={[styles.genderBtn, {backgroundColor: value ? '#2ED12E' : '#E0E6F3'}]}
                onPress={() => {setValue(true)}}>
                <MaterialCommunityIcons 
                    name='gender-male' 
                    size={50}
                    color={value ? '#FFF' : '#9EA9C3'}/>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.genderBtn, {backgroundColor: value ? '#E0E6F3' : '#2ED12E'}]}
                onPress={() => {setValue(false)}}>
                <MaterialCommunityIcons 
                    name='gender-female' 
                    size={50}
                    color={value ? '#9EA9C3' : '#FFF'} />
            </TouchableOpacity>
        </View>
    )
}

function HeightSlider({ value, setValue }) {
    const setProps = (data) => {
        setValue(data[0]);
    }

    return (
        <View style={heightStyles.container}>
            <View style={heightStyles.title}>
                <Text style={{fontSize: 16, fontFamily: 'inter-bold', marginLeft: 10}}>Height</Text>
                <Text style={{fontSize: 16, color: globalColors.textGray, marginRight: 10}}>{value} cm</Text>
            </View>
            <Slider 
                min={100} max={250} 
                values={[175]} 
                onChange={setProps}
                showLabel={false}
                labelStyle={heightStyles.label}
                labelTextStyle={heightStyles.labelText}
                markerColor={globalColors.breakfastGreen} />
        </View>
    )
}

function WeightAgeButton({ title, value, setValue }) {
    return (
        <View style={weightAgeStyles.container}>
            <Text style={weightAgeStyles.title}>{title}</Text>
            <Text style={weightAgeStyles.value}>{value}</Text>
            <View style={{width: 100, flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={weightAgeStyles.button} onPress={() => {setValue(old => old-1)}}>
                    <MaterialCommunityIcons name='minus' size={20} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity style={weightAgeStyles.button} onPress={() => {setValue(old => old+1)}}>
                    <MaterialCommunityIcons name='plus' size={20} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const bmiSchema = yup.object({
    minPerDay: yup.number()
    .label('Minutes per day')
    .min(0)
    .required(),
    dayPerWeek: yup.number()
    .label('Days per week')
    .min(0)
    .max(7)
    .required()
});


export default function SignUpBMI({ navigation, route }) {
    const userID = auth.currentUser.uid;

    const { iGender, iHeight, iWeight, iAge } = route.params; 
    // True = male, false = female
    const [gender, setGender] = React.useState(iGender);
    const [height, setHeight] = React.useState(iHeight);
    const [weight, setWeight] = React.useState(iWeight);
    const [age, setAge] = React.useState(iAge);

    // 0 = lose weight, 1 = maintain, 2 = gain
    const [goal, setGoal] = React.useState(1);


    const getTDEE = (gender, weight, height, age, activity) => {
        let bmr = 10 * weight + 6.25 * (height/100) + 5 * age;
        if (gender == true)
            bmr += 5;
        else bmr -= 161;
        return Math.round(bmr*activity);
    }

    const getActivityLevel = (minPerDay, dayPerWeek) => {
        let R;
        if (dayPerWeek >= 1 && dayPerWeek <= 3) {
            R = 1.375;
        }
        else if (dayPerWeek >= 4 && dayPerWeek <= 5) {
            R = 1.55;
        }
        else if (dayPerWeek >= 6 && dayPerWeek <=7) {
            if (minPerDay >= 120) 
                R = 1.725;
            else R = 1.9;
        }
        else {
            R = 1.2;
        }
        return R;
    }


    const saveUserData = async(values) => {
        let level = getActivityLevel(values.minPerDay, values.dayPerWeek);
        let tdee = getTDEE(gender, weight, height, age, level);

        try {
            const docRef = await setDoc(doc(db, "users", userID), {
                id: userID.toString(),
                gender: gender,
                age: age,
                weight: weight,
                height: height,
                tdee: tdee,
                carbRatio: 40,
                proteinRatio: 30,
                fatRatio: 30,
            }, { merge: true });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const goBack = () => {
        navigation.goBack();
    }

    return (
        <View style={globalStyles.container}>
            <Header backFunc={goBack} />
            <Formik
                initialValues={{
                    minPerDay: '', 
                    dayPerWeek: '',
                }}
                validationSchema={bmiSchema}
                onSubmit={(values) => {
                    saveUserData(values);
                    navigation.navigate('Main');
                }}
            >
            {
                ({handleChange, handleSubmit, values, errors}) => (
                <ScrollView style={{padding: 20,}}
                    contentContainerStyle={{alignItems: 'center'}}>
                    <View style={styles.activityContainer}>
                        <Text style={styles.title}>Your activity per week *</Text>
                        <View>
                            <View style={styles.inputLine}>
                                <TextInput 
                                    style={styles.inputActivity}
                                    value={values.minPerDay}
                                    onChangeText={handleChange('minPerDay')} 
                                />
                                <Text style={styles.inputTitle}>minutes / day</Text>
                            </View>
                            <View style={styles.inputLine}>
                                <TextInput 
                                    style={styles.inputActivity}
                                    value={values.dayPerWeek}
                                    onChangeText={handleChange('dayPerWeek')}
                                />
                                <Text style={styles.inputTitle}>days / week</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.bodyScaleContainer}>
                        <GenderButton value={gender} setValue={setGender} />
                        <HeightSlider value={height} setValue={setHeight} />
                        <View style={{flexDirection: 'row', width: 250, justifyContent: 'space-between'}}>
                            <WeightAgeButton title='Weight' value={weight} setValue={setWeight} />
                            <WeightAgeButton title='Age' value={age} setValue={setAge} />
                        </View>
                    </View>
                    <TouchableOpacity style={globalStyles.submitBtn} onPress={handleSubmit}>
                        <Text style={{color: '#fff', fontSize: 20,}}>Update</Text>
                    </TouchableOpacity>
                </ScrollView>
                )
            }
            </Formik>
        </View>
    )
}


// Styles definition
const styles = StyleSheet.create({
    title: {
        fontFamily: 'inter-bold',
        fontSize: 18,
    },
    activityContainer: {
        backgroundColor: '#fff',
        width: 300,
        height: 184,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bodyScaleContainer: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputLine: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    inputActivity: {
        width: 75,
        fontSize: 16,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderColor: globalColors.textGray
    },
    inputTitle: {
        fontSize: 16,
        color: globalColors.textGray,
        marginLeft: 15,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 230,
    },
    genderBtn: {
        width: 100,
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const heightStyles = StyleSheet.create({
    container: {
        marginVertical: 20,
        width: 250,
        height: 75,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    label: {
        backgroundColor: 'transparent',
    },
    labelText: {
        fontFamily: 'inter-regular',
        fontSize: 16,
    },
});

const weightAgeStyles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: 120,
        height: 100,
        alignItems: "center",
    },
    title: {
        fontFamily: 'inter-bold',
        fontSize: 16,
    },
    value: {
        fontFamily: 'inter-semibold',
        fontSize: 18,
    },
    button: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: globalColors.breakfastGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
});