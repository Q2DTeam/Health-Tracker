import React, {useState, useEffect, useReducer} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Alert, Modal, TouchableOpacity, RefreshControl } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { auth } from '../utils/firebase';
import { db, doc, getDoc } from '../utils/firestore';
import ProgressCircle from 'react-native-progress-circle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import moment from 'moment'; 

// Import components
import KcalValue from '../components/KcalValue';
import NutriValue from '../components/NutriValue';
import MealItem from '../components/MealItem';
import DatePicker from '../components/DatePicker';


export default function HomeMain({ navigation }) {
    const [user, setUser] = useState();

    const [totalKcal, setkcalTotal] = useState(0);
    const [totalCarb, setcarbTotal] = useState(0);
    const [totalProtein, setproteinTotal] = useState(0);
    const [totalFat, setfatTotal] = useState(0);

    const [kcalEaten, setkcalEaten] = useState(0);
    const [kcalBurned, setkcalBurned] = useState(0);
    const [carbEaten, setcarbEaten] = useState(0);
    const [proteinEaten, setProteinEaten] = useState(0);
    const [fatEaten, setFatEaten] = useState(0); 
    
    const [breakfast, setBreakfast] = useState();
    const [lunch, setLunch] = useState();
    const [dinner, setDinner] = useState();
    const [snack, setSnack] = useState();

    const [calenVisible, setCalenVisible] = useState(false);
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [refreshing, setRefreshing] = useState(false);

    const storeDataLocal = async(value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('userData', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const getDataLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('userData');
            if (value !== null) {
                // value previously stored
                const userData = JSON.parse(value);
                if (user.uid == userData.id) {
                    console.log("Data fetched, id matched: ", userData);
                    let {tdee, carb, protein, fat} = getNutriValue(userData.tdee, userData.carbRatio, userData.proteinRatio, userData.fatRatio);
                    setkcalTotal(tdee);
                    setcarbTotal(carb);
                    setproteinTotal(protein);
                    setfatTotal(fat);
                }
                else {
                    console.log("ID not matched");
                    await getData();
                }
            }
            else {
                await getData();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const resetNutrition = () => {
        setkcalEaten(0);
        setcarbEaten(0);
        setFatEaten(0);
        setProteinEaten(0);
    }

    const sumNutrition = (meal) => {
        let [kcal, carb, fat, pro] = [0, 0, 0, 0];
        meal.map((item) => {
            kcal += item.kcal;
            carb += item.carb;
            fat += item.fat;
            pro += item.protein;
        })
        return { kcal, carb, fat, pro };
    }

    const updateNutrition = (meal) => {
        const { kcal, carb, fat, pro } = sumNutrition(meal);
        setkcalEaten(old => old + Math.round(kcal));
        setcarbEaten(old => old + Math.round(carb));
        setFatEaten(old => old + Math.round(fat));
        setProteinEaten(old => old + Math.round(pro));
    }

    const saveMealToLocal = async(type, meal) => {
        try {
            const jsonValue = JSON.stringify(meal);
            await AsyncStorage.setItem(type, jsonValue);
            console.log(`${type} saved to local!`);
        } catch (error) {
            console.log(error);
        }
    }

    const getMealLocal = async(type) => {
        try {
            const value = await AsyncStorage.getItem(type);
            if (value !== null) {
                const meal = JSON.parse(value);
                if (meal.date == date && meal.userID == user.uid) {
                    //console.log("Meal matched date and id");
                    switch (type) {
                        case 'breakfast':
                            setBreakfast(meal);
                            break;
                        case 'lunch':
                            setLunch(meal);
                            break;
                        case 'dinner':
                            setDinner(meal);
                            break;
                        case 'snack':
                            setSnack(meal);
                            break;
                    }
                    if (meal !== undefined) 
                        updateNutrition(meal.meal);
                }
                else {
                    console.log("ID or meal not matched");
                    await getMeal(type);
                }
            }
            else {
                await getMeal(type);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getMeal = async(type) => {
        let docRef, docSnap;
        const mealID = `${user.uid}-${date}-${type}`;
        try {
            docRef = doc(db, "user_records", mealID);
            docSnap = await getDoc(docRef);
        }
        catch (error) {
            Alert.alert('Oops, we cannot retrieve your data', 'Due inconsistent internet connection, we cannot fetch the data you need. Please refresh the screen to try again.');
        }

        if (docSnap) {
            let meal = docSnap.data();
            console.log("Meal from database", meal);
            switch (type) {
                case 'breakfast':
                    setBreakfast(meal);
                    break;
                case 'lunch':
                    setLunch(meal);
                    break;
                case 'dinner':
                    setDinner(meal);
                    break;
                case 'snack':
                    setSnack(meal);
                    break;
            }
            if (meal !== undefined) {
                updateNutrition(meal.meal);
                saveMealToLocal(type, meal);
            }
        } 
        else {
            console.log("No such document!");
        }
    }
    
    const getData = async () => {
        let docRef, docSnap;
        try {
            docRef = doc(db, "users", user.uid);
            docSnap = await getDoc(docRef);
        }
        catch (error) {
            Alert.alert('Oops, we cannot retrieve your data', 'Due inconsistent internet connection, we cannot fetch the data you need. Please refresh the screen to try again.');
        }

        if (docSnap) {
            let userData = docSnap.data();
            console.log("Document from DB:", userData);
            let {tdee, carb, protein, fat} = getNutriValue(userData.tdee, userData.carbRatio, userData.proteinRatio, userData.fatRatio);
            setkcalTotal(tdee);
            setcarbTotal(carb);
            setproteinTotal(protein);
            setfatTotal(fat);
            // Save data to local
            storeDataLocal(userData);
        } 
        else {
            console.log("No such document!");
        }
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((val) => {setUser(val)});
        return subscriber;
    }, []);

    useEffect(() => {
        // Reset all value
        resetNutrition();
        if (user !== undefined) {
            // Get user data
            getDataLocal();
    
            //Get meal data
            getMealLocal('breakfast');
            getMealLocal('lunch');
            getMealLocal('dinner');
            getMealLocal('snack');
        }
    }, [user, date]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        resetNutrition();
        getMealLocal('breakfast');
        getMealLocal('lunch');
        getMealLocal('dinner');
        getMealLocal('snack');
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);

    const getNutriValue = (tdee, carbRatio, proteinRatio, fatRatio) => {
        let carb = Math.round(tdee * carbRatio / 400);
        let protein = Math.round(tdee * proteinRatio / 400);
        let fat = Math.round(tdee * fatRatio / 900);
        return { tdee, carb, protein, fat};
    }

    const handleNavigation = (name) => {
        navigation.navigate('MealInfo', {
            title: name,
            date: date,
        });
    }

    function CalenModal() {
        const [selected, setSelected] = useState(date);

        const handleOK = () => {
            setDate(selected);
            setCalenVisible(false);
        }

        const handleCancel = () => {
            setCalenVisible(false);
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={calenVisible}
            >
                <View style={calenStyles.centeredView}>
                    <View style={calenStyles.container}>
                        <Text style={calenStyles.title}>Select date</Text>
                        <Calendar
                            onDayPress={day => {
                                setSelected(day.dateString);
                            }}
                            markedDates={{
                                [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                            }}
                            style={{
                                borderColor: 'gray',
                                width: 350,
                            }}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#b6c1cd',
                                selectedDayBackgroundColor: '#00adf5',
                                selectedDayTextColor: '#fff',
                                todayTextColor: '#00adf5',
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#dedede',
                            }}
                        />
                        <View style={calenStyles.bottom}>
                            <TouchableOpacity onPress={handleOK}>
                                <Text style={calenStyles.btnText}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancel}>
                                <Text style={calenStyles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    
    function handleSetCalen() {
        setCalenVisible(true);
    }

    function TopBar() {
        return (
            <View style={styles.topBar}>
                <View style={styles.kcalContainer}> 
                    <DatePicker currentDate={date} setShowCalendar={handleSetCalen} />
                    <View style={styles.infoContainer}>
                        <View style={styles.kcalWrapper}>
                            <KcalValue icon='fire' title='burned' value={kcalBurned} />
                            <ProgressCircle 
                                percent={Math.round(kcalEaten / (totalKcal + kcalBurned) * 100)}
                                radius={90}
                                borderWidth={8}
                                color="#fff"
                                shadowColor={globalColors.backgroundCyan}
                                bgColor={globalColors.darkerCyan}
                            >
                                <View style={{alignItems: 'center'}}>
                                    <Text style={styles.remainKcalValue}>{totalKcal + kcalBurned - kcalEaten}</Text>
                                    <Text style={styles.remainKcalText}>Kcal remaining</Text>
                                </View>
                            </ProgressCircle>
                            <KcalValue icon='silverware-variant' title='eaten' value={kcalEaten} />
                        </View>
                        <View style={styles.nutriWrapper}>
                            <NutriValue title="Carbs" total={totalCarb} consumed={carbEaten} />
                            <NutriValue title="Proteins" total={totalProtein} consumed={proteinEaten} />
                            <NutriValue title="Fats" total={totalFat} consumed={fatEaten} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={globalStyles.container}>
            <StatusBar style='light' />
            <ScrollView 
                style={{
                    backgroundColor: globalColors.backgroundGray, 
                    flex: 1, 
                    marginBottom: 10,  
                }}
                contentContainerStyle={{ alignItems: 'center' }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <CalenModal />
                <TopBar />
                <View>
                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'inter-bold',
                        marginVertical: 10
                    }}>
                        Daily meals
                    </Text>
                    <MealItem 
                        type='breakfast' 
                        handleNav={() => {handleNavigation('breakfast')}}
                        meal={breakfast}
                    />
                    <MealItem 
                        type='lunch' 
                        handleNav={() => {handleNavigation('lunch')}}
                        meal={lunch}
                    />
                    <MealItem 
                        type='dinner' 
                        handleNav={() => {handleNavigation('dinner')}}
                        meal={dinner}
                    />
                    <MealItem 
                        type='snack' 
                        handleNav={() => {handleNavigation('snack')}}
                        meal={snack}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    topBar: {
        height: 420,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    kcalContainer: { 
        backgroundColor: globalColors.darkerCyan,
        width: 700,
        height: 700,
        borderRadius: 350,
        paddingTop: 310,
        alignItems: 'center',
    },
    kcalWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 175,
        width: 375,
    },
    remainKcalValue: {
        fontSize: 36,
        color: "#fff",
        fontFamily: 'inter-bold',
    },
    remainKcalText: {
        fontSize: 14,
        color: "#fff",
        fontFamily: 'inter-regular',
    },

    // Nutrients Values
    nutriWrapper: {
        marginTop: 30,
        width: 375,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    homeBody: {
        flex: 1,
        marginVertical: 10,
        height: '100%',
    },
});


const calenStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    title: {
        fontFamily: 'inter-semibold',
        fontSize: 20,
        height: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: '#00adf5',
        color: '#fff',
    },
    bottom: {
        height: 40,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',        
    },
    btnText: {
        fontSize: 16,
        color: '#00adf5'
    },
});