import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
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
import ActionButton from '../components/ActionButton';
import DatePicker from '../components/DatePicker';


export default function HomeMain({ navigation }) {
    const [user, setUser] = React.useState();

    const [totalKcal, setkcalTotal] = React.useState(0);
    const [totalCarb, setcarbTotal] = React.useState(0);
    const [totalProtein, setproteinTotal] = React.useState(0);
    const [totalFat, setfatTotal] = React.useState(0);

    const [kcalEaten, setkcalEaten] = React.useState(0);
    const [kcalBurned, setkcalBurned] = React.useState(0);
    const [carbEaten, setcarbEaten] = React.useState(0);
    const [proteinEaten, setProteinEaten] = React.useState(0);
    const [fatEaten, setFatEaten] = React.useState(0); 
    
    const [breakfast, setBreakfast] = React.useState([]);
    const [lunch, setLunch] = React.useState([]);
    const [dinner, setDinner] = React.useState([]);
    const [snack, setSnack] = React.useState([]);

    const [calenVisible, setCalenVisible] = React.useState(false);
    const [date, setDate] = React.useState(moment().format('YYYY-MM-DD'));

    const storeDataLocal = async(value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('userData', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const getDataLocal = async(key = 'userData') => {
        try {
            const value = await AsyncStorage.getItem(key);
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
            console.log("Document data:", userData);
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

    React.useEffect(() => {
        const subscriber = auth.onAuthStateChanged((val) => {setUser(val)});
        return subscriber;
    }, []);

    React.useEffect(() => {
        getDataLocal();
    }, [user]);

    const getNutriValue = (tdee, carbRatio, proteinRatio, fatRatio) => {
        let carb = Math.round(tdee * carbRatio / 400);
        let protein = Math.round(tdee * proteinRatio / 400);
        let fat = Math.round(tdee * fatRatio / 900);
        return { tdee, carb, protein, fat};
    }

    const handleNavigation = (name) => {
        navigation.navigate('AddMeal', {title: name});
    }

    function CalenModal() {
        const [selected, setSelected] = React.useState(date);

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
                    <View>
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
            <StatusBar barStyle="light-content" />
            <ScrollView 
                style={{
                    backgroundColor: globalColors.backgroundGray, 
                    flex: 1, 
                    marginBottom: 10,  
                }}
                contentContainerStyle={{ alignItems: 'center' }}
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
                    <MealItem type='breakfast' />
                    <MealItem type='lunch' />
                    <MealItem type='dinner' />
                    <MealItem type='snack' />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    topBar: {
        height: 400,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    kcalContainer: { 
        backgroundColor: globalColors.darkerCyan,
        width: 700,
        height: 700,
        borderRadius: 350,
        paddingTop: 320,
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
        fontSize: 12,
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
        marginTop: 22,
    },
    title: {
        fontFamily: 'inter-semibold',
        fontSize: 20,
        height: 30,
        textAlign: 'center',
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