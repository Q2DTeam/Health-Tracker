import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { auth } from '../utils/firebase';
import { db, doc, getDoc } from '../utils/firestore';
import ProgressCircle from 'react-native-progress-circle';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Import components
import KcalValue from '../components/KcalValue';
import NutriValue from '../components/NutriValue';
import MealItem from '../components/MealItem';
import ActionButton from '../components/ActionButton';
import { globalColors, globalStyles } from '../global/styles';


function TopBar({ totalKcal, totalCarb, totalProtein, totalFat, kcalBurned, kcalEaten, carbEaten, proteinEaten, fatEaten }) {
    return (
        <View style={styles.topBar}>
            <View style={styles.kcalContainer}> 
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

function ActivityBar() {

}


export default function HomeMain({ navigation }) {
    const [user, setUser] = React.useState(auth.currentUser);

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

    const getAuth = async () => {
        try {
            const value = await AsyncStorage.getItem('auth');
            if (value !== null) {
                const userAuth = JSON.parse(value);
                setUser(userAuth.currentUser);
                console.log('User data fetched');
            }
        } catch (e) {
            console.log("Can't fetch user auth");
        }
    };


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
        getAuth();
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


    return (
        <View style={globalStyles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView 
                style={{
                    backgroundColor: globalColors.backgroundGray, 
                    flex: 1, 
                    marginBottom: 10,  
                }}
                contentContainerStyle={{
                    alignItems: 'center'
                }}
            >
                <TopBar totalKcal={totalKcal} totalCarb={totalCarb} totalProtein={totalProtein} totalFat={totalFat} kcalEaten={kcalEaten}
                        kcalBurned={kcalBurned} carbEaten={carbEaten} proteinEaten={proteinEaten} fatEaten={fatEaten}  
                />
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
            <ActionButton handleNavigation={handleNavigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    topBar: {
        height: 400,
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    kcalContainer: { 
        backgroundColor: globalColors.darkerCyan,
        width: 700,
        height: 700,
        borderRadius: 350,
        paddingTop: 400,
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
        marginTop: 20,
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