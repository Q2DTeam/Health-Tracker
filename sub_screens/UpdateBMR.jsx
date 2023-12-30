import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, RefreshControl, Platform } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { Formik } from 'formik';
import { auth } from '../utils/firebase';
import { db, setDoc, doc } from '../utils/firestore';
import * as yup from 'yup';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import icons
import { MaterialCommunityIcons } from '@expo/vector-icons';


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


export default function UpdateBMR({ hideModal }) {
    const [user, setUser] = React.useState(auth.currentUser);

    const [gender, setGender] = React.useState(true);
    const [height, setHeight] = React.useState(175);
    const [weight, setWeight] = React.useState(70);
    const [age, setAge] = React.useState(18);

    // 0 = lose weight, 1 = maintain, 2 = gain
    const [goal, setGoal] = React.useState(1);


    const getTDEE = (gender, weight, height, age, activity, goal) => {
        let bmr = 10 * weight + 6.25 * height + 5 * age;
        if (gender == true)
            bmr += 5;
        else bmr -= 161;

        let kcal = Math.round(bmr*activity);
        if (goal == 0) 
            return kcal - 500;
        else if (goal == 1)
            return kcal;
        else return kcal + 500;
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
                R = 1.9;
            else R = 1.725;
        }
        else {
            R = 1.2;
        }
        return R;
    }

    const getDataLocal = async(key = 'userData') => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // value previously stored
                const userData = JSON.parse(value);
                if (user.uid == userData.id) {
                    setAge(userData.age);
                    setWeight(userData.weight);
                    setHeight(userData.height);
                    setGender(userData.gender);
                }
                else {
                    console.log("ID not matched");
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const storeDataLocal = async(value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('userData', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const saveUserData = async(values) => {
        let level = getActivityLevel(values.minPerDay, values.dayPerWeek);
        let tdee = getTDEE(gender, weight, height, age, level, goal);

        try {
            const newData = {
                id: user.uid,
                gender: gender,
                age: age,
                weight: weight,
                height: height,
                goal: goal,
                tdee: tdee,
                carbRatio: 40,
                proteinRatio: 30,
                fatRatio: 30
            };
            // Save data to database
            await setDoc(doc(db, "users", user.uid), newData, { merge: true });
            // Save data to local
            await storeDataLocal(newData);
            hideModal();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    React.useEffect(() => {
        const subscriber = auth.onAuthStateChanged((val) => {setUser(val)});
        return subscriber;
    }, []);

    React.useEffect(() => {
        if (user !== undefined)
            getDataLocal();
    }, [user]);

    function Header() {
        
        return (
            <View style={[globalStyles.header, {
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                paddingHorizontal: 20, 
                paddingBottom: 15, 
                paddingTop: Platform.OS === 'android' ? 0 : 20,
            }]}>
                <TouchableOpacity onPress={hideModal}>
                    <MaterialCommunityIcons name='chevron-left' size={40} color='#fff' />
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={globalStyles.headerTitle}>Update your BMR</Text>
                </View>
                <View style={{width: 30}} />
            </View>
        )
    }
    
    function GoalButton({desireVal, title, subtitle}) {
        return (
            <TouchableOpacity 
                style={[goalStyles.btn, { borderColor: goal == desireVal ? globalColors.breakfastGreen : '#fff' }]} 
                onPress={() => {setGoal(desireVal);}}
            >
                <Text style={[goalStyles.title, {color: goal == desireVal ? globalColors.breakfastGreen : '#000'}]}>{title}</Text>
                <Text style={goalStyles.subtitle}>{subtitle}</Text>
            </TouchableOpacity>
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
    
    function HeightSlider() {
        const [temp, setTemp] = useState(height);
    
        return (
            <View style={heightStyles.container}>
                <View style={heightStyles.title}>
                    <Text style={{fontSize: 16, fontFamily: 'inter-bold', marginLeft: 10}}>Height</Text>
                    <Text style={{fontSize: 16, color: globalColors.textGray, marginRight: 10}}>{temp} cm</Text>
                </View>
                <Slider
                    style={{height: 40}}
                    minimumValue={100}
                    maximumValue={250}
                    value={temp}
                    onValueChange={(value) => setTemp(value)}
                    onSlidingComplete={(value) => setHeight(value)}
                    step={1}
                    minimumTrackTintColor={globalColors.breakfastGreen}
                    thumbTintColor={globalColors.breakfastGreen}
                />
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

    // Main return
    return (
        <View style={globalStyles.container}>
            <Header />
            <Formik
                initialValues={{
                    minPerDay: '', 
                    dayPerWeek: '',
                }}
                validationSchema={bmiSchema}
                onSubmit={(values) => {
                    saveUserData(values);
                }}
            >
            {
                ({handleChange, handleSubmit, values}) => (
                <ScrollView style={{padding: 20,}}
                    contentContainerStyle={{alignItems: 'center'}}>
                    <View style={goalStyles.container}>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'inter-bold',
                            color: globalColors.breakfastGreen,
                        }}>
                            What is your goal?
                        </Text>
                        <View>
                            <GoalButton
                                desireVal={0}
                                title='Lose Weight'
                                subtitle='Manage your weight by eating smarter'
                            />
                            <GoalButton
                                desireVal={1}
                                title='Maintain Weight'
                                subtitle='Optimizes your well-being'
                            />
                            <GoalButton
                                desireVal={2}
                                title='Gain Weight'
                                subtitle='Build strength with high-protein food'
                            />
                        </View>
                    </View>
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
                        <HeightSlider />
                        <View style={{flexDirection: 'row', width: 250, justifyContent: 'space-between'}}>
                            <WeightAgeButton title='Weight' value={weight} setValue={setWeight} />
                            <WeightAgeButton title='Age' value={age} setValue={setAge} />
                        </View>
                    </View>
                    <TouchableOpacity style={[globalStyles.submitBtn, {marginBottom: 30,}]} onPress={handleSubmit}>
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

const goalStyles = StyleSheet.create({
    container: {
        marginBottom: 20,
        alignItems: 'center',
        padding: 10,
    },
    btn: {
        marginTop: 15,
        backgroundColor: '#fff',
        width: 300,
        padding: 10,
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontFamily: 'inter-semibold'
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'inter-regular',
        color: globalColors.textGray,
    }
});