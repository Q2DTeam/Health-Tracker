import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal } from 'react-native';
import { auth } from '../utils/firebase';
import { db, doc, getDoc } from '../utils/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PieChart from 'react-native-pie-chart';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

// Import components
import UpdateBMR from '../sub_screens/UpdateBMR';


export default function Me({ navigation }) {
    const [user, setUser] = useState();
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);
    const [bmi, setBMI] = useState(0.0);
    let ratio = [40, 30, 30];

    const [totalKcal, setkcalTotal] = useState(0);
    const [totalCarb, setcarbTotal] = useState(0);
    const [totalProtein, setproteinTotal] = useState(0);
    const [totalFat, setfatTotal] = useState(0);

    const [bmrModal, setBMRModal] = useState(false);

    const getNutriValue = (tdee, carbRatio, proteinRatio, fatRatio) => {
        let carb = Math.round(tdee * carbRatio / 400);
        let protein = Math.round(tdee * proteinRatio / 400);
        let fat = Math.round(tdee * fatRatio / 900);
        setkcalTotal(tdee);
        setfatTotal(fat);
        setcarbTotal(carb);
        setproteinTotal(protein);
    }

    const getDataLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('userData');
            if (value !== null) {
                // value previously stored
                const userData = JSON.parse(value);
                if (user.uid == userData.id) {
                    setWeight(userData.weight);
                    setHeight(userData.height);
                    let bmiValue = bmiCalculation(weight, height);
                    setBMI(bmiValue);
                    ratio = [userData.carbRatio, userData.proteinRatio, userData.fatRatio];
                    getNutriValue(userData.tdee, userData.carbRatio, userData.proteinRatio, userData.fatRatio);
                }
                else {
                    console.log("ID not matched");
                    await getUserData();
                }
            }
            else {
                await getUserData();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getUserData = async() => {
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
            //console.log("Document data:", userData);
            setWeight(userData.weight);
            setHeight(userData.height);
            let bmiValue = bmiCalculation(weight, height);
            setBMI(bmiValue);
            ratio = [userData.carbRatio, userData.proteinRatio, userData.fatRatio];
            getNutriValue(userData.tdee, userData.carbRatio, userData.proteinRatio, userData.fatRatio);
        } 
        else {
            console.log("No such document!");
        }
    }

    const bmiCalculation = (weight, height) => {
        let bmi = weight / ((height * height) / 10000);
        return bmi.toFixed(1);
    }

    const removeDataLocal = async() => {
        try {
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('foodsAPI');
            await AsyncStorage.removeItem('breakfast');
            await AsyncStorage.removeItem('lunch');
            await AsyncStorage.removeItem('dinner');
            await AsyncStorage.removeItem('snack');
            await AsyncStorage.removeItem('custom_foods');
            await AsyncStorage.removeItem('exercisesAPI');
            await AsyncStorage.removeItem('activities');
            console.log("REMOVED");
        }
        catch (err) {
            console.log("ERROR removing user data");
        }
    }

    const handleSignOut = () => {
        Alert.alert('Log Out', 'Do you want to log out?', [
        {
            text: 'Yes',
            onPress: () => {
                auth.signOut()
                .then(() => {
                    removeDataLocal();
                    navigation.navigate('RegisterStack');
                })
            },
        },
        {
            text: 'Cancel',
        },
        ]);
    }

    const handleUpdateBMI = () => {
        setBMRModal(true);
    }

    const handleHideBMIModal = () => {
        setBMRModal(false);
        getDataLocal();
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((val) => {setUser(val)});
        return subscriber;
    }, []);

    useEffect(() => {
        if (user !== undefined)
            getDataLocal();
    }, [user]);

    function UpdateBMIModal() {
        return (
            <Modal
                animationType="slide"
                visible={bmrModal}
            >
                <View style={{flex: 1, backgroundColor: globalColors.backgroundGray}}>
                    <UpdateBMR 
                        hideModal={handleHideBMIModal}
                    />
                </View>
            </Modal>
        )
    }
    
    function Header() {
        return (
            <View style={[globalStyles.header, styles.profileHeader]}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={handleUpdateBMI}>
                        <MaterialCommunityIcons name='account-circle' size={40} color='#fff' />
                        {
                            user !== undefined && <Text style={{color: '#fff'}}>{user.displayName}</Text>
                        }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={handleSignOut}>
                    <MaterialCommunityIcons name='exit-to-app' size={30} color='#fff' />
                    <Text style={{color: '#fff'}}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function BMI() {
        let status = "";
        let statusColor = "";
        if (bmi < 18.6) {
            status = "Under Weight";
            statusColor = globalColors.lunchOrange;
        }
        else if (bmi >= 18.6 && bmi < 24.9) {
            status = "Healthy";
            statusColor = globalColors.breakfastGreen;
        }
        else {
            status = "Over Weight";
            statusColor = globalColors.snackPurple;
        }
    
        return (
            <View style={styles.bmiContainer}>
                <View style={styles.bmiHalf}>
                    <View>
                        <Text style={{fontSize: 18, fontFamily: 'inter-regular'}}>BMI</Text>
                        <Text style={{fontSize: 20, fontFamily: 'inter-bold', color: '#E61313'}}>{bmi}</Text>
                    </View>
                    <Text style={{fontSize: 20, color: statusColor, fontFamily: 'inter-semibold'}}>
                        {status}
                    </Text>
                </View>
                <View style={{borderWidth: 1, width: '100%', borderColor: globalColors.textGray}} />
                <View style={styles.bmiHalf}>
                    <View>
                        <Text style={{fontSize: 16, textAlign: 'left'}}>{height} cm</Text> 
                        <Text style={{fontSize: 16, color: globalColors.textGray}}>Height</Text>
                    </View>
                    <View>
                        <Text style={{fontSize: 16, textAlign: 'right'}}>{weight} kg</Text> 
                        <Text style={{fontSize: 16, color: globalColors.textGray}}>Weight</Text>
                    </View>
                </View>
            </View>
        );
    }
    
    function NutritionWheel() {
        return (
            <View style={nutriRatioStyles.wheelContainer}>
                <PieChart 
                    widthAndHeight={150} 
                    series={ratio} 
                    sliceColor={[globalColors.vibrantBlue, globalColors.lunchOrange, globalColors.snackPurple]}
                    coverRadius={0.001} 
                />
                <View style={nutriRatioStyles.details}>
                    <Text style={nutriRatioStyles.kcalTitle}>{totalKcal} kcal</Text>
                    <View style={nutriRatioStyles.infoItem}>
                        <FontAwesome name='circle' color={globalColors.vibrantBlue} size={18} />
                        <Text style={nutriRatioStyles.infoName}>Carbs: {totalCarb} g</Text>
                    </View>
                    <View style={nutriRatioStyles.infoItem}>
                        <FontAwesome name='circle' color={globalColors.lunchOrange} size={18} />
                        <Text style={nutriRatioStyles.infoName}>Protein: {totalProtein} g</Text>
                    </View>
                    <View style={nutriRatioStyles.infoItem}>
                        <FontAwesome name='circle' color={globalColors.snackPurple} size={18} />
                        <Text style={nutriRatioStyles.infoName}>Fats: {totalFat} g</Text>
                    </View>
                </View>
            </View>
        );
    }
    
    return (
        <View style={globalStyles.container}>
            <StatusBar barStyle="light-content" />
            <UpdateBMIModal />
            <Header signOutFunc={handleSignOut} bmiFunc={handleUpdateBMI} />
            <View style={styles.profileBody}>
                <View style={{marginVertical: 20,}}>
                    <Text style={styles.bmiTitle}>Your BMI</Text>
                    <BMI />
                </View>

                <View style={{marginVertical: 20,}}>
                    <Text style={styles.bmiTitle}>Macro Information</Text>
                    <NutritionWheel />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 32,
        paddingBottom: 10,
    },
    profileBody: {
        flex: 1, 
        marginTop: 24,
        alignItems: 'center',
    },
    bmiTitle: {
        fontSize: 24,
        fontFamily: 'inter-semibold',
        marginBottom: 10,
    },
    bmiContainer: {
        width: 334,
        minHeight: 140,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    bmiHalf: {
        width: '100%',
        minHeight: 60,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bmiText: {
        fontSize: 18,
    },
});

const nutriRatioStyles = StyleSheet.create({
    wheelContainer: {
        width: 334,
        height: 180,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    details: {
        justifyContent: 'space-around',
        height: 170,
    },
    infoItem: {
        minWidth: 100,
        flexDirection: 'row',
    },
    infoName: {
        marginLeft: 10,
        fontSize: 16,
    },
    kcalTitle: {
        fontFamily: 'inter-semibold',
        fontSize: 18,
        textAlign: 'center',
        color: globalColors.calmRed
    },
});