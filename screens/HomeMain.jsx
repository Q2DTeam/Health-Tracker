import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Alert, Modal, TouchableOpacity, RefreshControl, ImageBackground } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { auth } from '../utils/firebase';
import { db, doc, getDoc } from '../utils/firestore';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import moment from 'moment'; 
import { BlurView } from 'expo-blur';

// Import components
import KcalValue from '../components/KcalValue';
import NutriValue from '../components/NutriValue';
import MealItem from '../components/MealItem';
import DatePicker from '../components/DatePicker';


export default function HomeMain({ navigation }) {
    const [user, setUser] = useState(auth.currentUser);

    const [totalKcal, setkcalTotal] = useState(0);
    const [totalCarb, setcarbTotal] = useState(0);
    const [totalProtein, setproteinTotal] = useState(0);
    const [totalFat, setfatTotal] = useState(0);

    const [kcalEaten, setkcalEaten] = useState(0);
    const [kcalBurned, setkcalBurned] = useState(0);
    const [carbEaten, setcarbEaten] = useState(0);
    const [proteinEaten, setProteinEaten] = useState(0);
    const [fatEaten, setFatEaten] = useState(0); 
    
    const [b, setB] = useState([]);
    const [l, setL] = useState([]);
    const [d, setD] = useState([]);
    const [s, setS] = useState([]);
    let breakfast, lunch, dinner, snack;

    // Exercises
    const [exercises, setExercises] = useState();
    const [exTime, setExTime] = useState(0);
    const [exCount, setExCount] = useState(0);

    const [calenVisible, setCalenVisible] = useState(false);
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [refreshing, setRefreshing] = useState(false);
    
    //store data to local
    const storeDataLocal = async(value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('userData', jsonValue);
        } catch (error) {
            console.log(error);
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

    const getDataLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('userData');
            if (value !== null) {
                // value previously stored
                const userData = JSON.parse(value);
                if (user.uid == userData.id) {
                    //console.log("Data fetched, id matched: ", userData);
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

    const updateNutrition = () => {
        meals = [breakfast, lunch, dinner, snack];
        let k = 0, c = 0, f = 0, p = 0;
        meals.map((item) => {
            if (item !== undefined) {
                const { kcal, carb, fat, pro } = sumNutrition(item);
                k += kcal;
                c += carb;
                f += fat;
                p += pro;
            }
        })
        setkcalEaten(Math.round(k));
        setcarbEaten(Math.round(c));
        setFatEaten(Math.round(f));
        setProteinEaten(Math.round(p));
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
            if (value !== null && value !== undefined) {
                const meal = JSON.parse(value);
                if (meal.date == date && meal.userID == user.uid) {
                    switch (type) {
                        case 'breakfast':
                            breakfast = meal.meal;
                            setB(meal.meal);
                            break;
                        case 'lunch':
                            lunch = meal.meal;
                            setL(meal.meal);
                            break;
                        case 'dinner':
                            dinner = meal.meal;
                            setD(meal.meal);
                            break;
                        case 'snack':
                            snack = meal.meal;
                            setS(meal.meal);
                            break;
                    }
                }
                else {
                    console.log("ID or date not matched");
                    switch (type) {
                        case 'breakfast':
                            breakfast = [];
                            setB([]);
                            break;
                        case 'lunch':
                            lunch = [];
                            setL([]);
                            break;
                        case 'dinner':
                            dinner = [];
                            setD([]);
                            break;
                        case 'snack':
                            snack = [];
                            setS([]);
                            break;
                    }
                    await getMeal(type);
                }
            }
            else {
                switch (type) {
                    case 'breakfast':
                        breakfast = [];
                        setB([]);
                        break;
                    case 'lunch':
                        lunch = [];
                        setL([]);
                        break;
                    case 'dinner':
                        dinner = [];
                        setD([]);
                        break;
                    case 'snack':
                        snack = [];
                        setS([]);
                        break;
                }
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
            if (meal !== undefined) {
                switch (type) {
                    case 'breakfast':
                        setB(meal.meal);
                        break;
                    case 'lunch':
                        setL(meal.meal);
                        break;
                    case 'dinner':
                        setD(meal.meal);
                        break;
                    case 'snack':
                        setS(meal.meal);
                        break;
                }
                saveMealToLocal(type, meal);
            }
        } 
        else {
            console.log("No such document!");
        }
    }

    const updateExercises = (exs) => {
        let time = 0;
        let count = exs.length;
        let burned = 0;
        exs.map((item) => {
            time += item.duration;
            burned += item.kcal;
        })
        setExCount(count);
        setExTime(time);
        setkcalBurned(burned);
    }

    const saveExerciseToLocal = async(value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('activities', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const getExercisesLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('activities');
            if (value !== null) {
                const activity = JSON.parse(value);
                if (activity.date == date && activity.userID == user.uid) {
                    if (activity !== null && activity !== undefined) {
                        setExercises(activity.exercises);
                        updateExercises(activity.exercises);
                    }
                    else {
                        setExercises([]);
                        updateExercises([]);
                    }
                }
                else {
                    await getExercises();
                }
            }
            else {
                await getExercises();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getExercises = async() => {
        let docRef, docSnap;
        const activityID = `${user.uid}-${date}`;
        try {
            docRef = doc(db, "user_activities", activityID);
            docSnap = await getDoc(docRef);
        }
        catch (error) {
            Alert.alert('Oops, we cannot retrieve your data', 'Due inconsistent internet connection, we cannot fetch the data you need. Please refresh the screen to try again.');
        }

        if (docSnap) {
            let activity = docSnap.data();
            if (activity !== null && activity !== undefined) {
                setExercises(activity.exercises);
                updateExercises(activity.exercises);
                saveExerciseToLocal(activity);
            }
            else {
                setExercises([]);
                updateExercises([]);
            }
        } 
        else {
            console.log("No such document!");
        }
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((val) => {setUser(val)});
        return subscriber;
    }, []);

    // Run after app opens
    useEffect(() => {
        if (user !== undefined) {
            // Get user data
            getDataLocal();
    
            //Get meal data
            getMealLocal('breakfast');
            getMealLocal('lunch');
            getMealLocal('dinner');
            getMealLocal('snack');
            getExercisesLocal();
        }
    }, [user, date]);
    

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Get user data
        getDataLocal();
        // Get Nutrition
        getMealLocal('breakfast');
        getMealLocal('lunch');
        getMealLocal('dinner');
        getMealLocal('snack');
        // Fetch exercise
        getExercisesLocal();

        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (b.length > 0) {
            breakfast = b;
        }
        if (l.length > 0) {
            lunch = l;
        }
        if (d.length > 0) {
            dinner = d;
        }
        if (s.length > 0) {
            snack = s;
        }
        updateNutrition();
    }, [b, l, d, s]);


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
                <BlurView intensity={20} style={calenStyles.centeredView}>
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
                </BlurView>
            </Modal>
        )
    }

    function ActivityTracker() {
        const bg = require('../assets/images/activity_bg.png');

        const handleActivityInfo = () => {
            navigation.navigate('ActivityInfo', {
                date: date
            });
        }

        return (
            <ImageBackground source={bg} alt='Background image' style={activityStyles.activity} resizeMode='contain'>
                <View style={activityStyles.container}>
                    <Text style={activityStyles.exercises}>{exCount} Exercises</Text>
                    <Text style={activityStyles.duration}>{exTime} Minutes</Text>
                    <View>
                        <TouchableOpacity style={activityStyles.button} onPress={handleActivityInfo}>
                            <Text style={{color: globalColors.calmRed}}>View all</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
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
                            <AnimatedCircularProgress
                                size={200}
                                width={10}
                                rotation={0}
                                fill={Math.round(kcalEaten / (totalKcal + kcalBurned) * 100)}
                                tintColor="#fff"
                                backgroundColor={globalColors.backgroundCyan}>
                                {
                                    (fill) => (
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.remainKcalValue}>{totalKcal + kcalBurned - kcalEaten}</Text>
                                        <Text style={styles.remainKcalText}>Kcal remaining</Text>
                                    </View>
                                    )
                                }
                            </AnimatedCircularProgress>
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
                        meal={b}
                    />
                    <MealItem 
                        type='lunch' 
                        handleNav={() => {handleNavigation('lunch')}}
                        meal={l}
                    />
                    <MealItem 
                        type='dinner' 
                        handleNav={() => {handleNavigation('dinner')}}
                        meal={d}
                    />
                    <MealItem 
                        type='snack' 
                        handleNav={() => {handleNavigation('snack')}}
                        meal={s}
                    />
                </View>
                <View>
                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'inter-bold',
                        marginTop: 20
                    }}>
                        Your Activities
                    </Text>
                    <ActivityTracker />
                </View>
                <View style={{height: 20}} />
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

const activityStyles = StyleSheet.create({
    activity: {
        width: 334,
        height: 196,
        marginTop: 5,
        paddingTop: 40,
        paddingRight: 180,
        overflow: 'hidden'
    },
    container: {
        height: 130,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    exercises: {
        fontFamily: 'inter-semibold',
        fontSize: 18,
        color: '#fff',
    },
    duration: {
        fontFamily: 'inter-bold',
        fontSize: 20,
        color: '#fff',
    },
    button: {
        height: 30,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    }
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