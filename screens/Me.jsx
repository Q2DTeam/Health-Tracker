import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { auth, db, doc, getDoc } from '../utils/firebase';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import components
import NutritionWheel from '../components/NutritionWheel';


function BMI({ bmi, height, weight }) {
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
                    <Text style={{fontSize: 18}}>BMI</Text>
                    <Text style={{fontSize: 18, color: '#E61313'}}>{bmi}</Text>
                </View>
                <Text style={{fontSize: 20, color: statusColor}}>
                    {status}
                </Text>
            </View>
            <View style={{borderWidth: 1, width: '100%', borderColor: globalColors.textGray}} />
            <View style={styles.bmiHalf}>
                <View>
                    <Text>{height} cm</Text> 
                    <Text style={{color: globalColors.textGray}}>Height</Text>
                </View>
                <View>
                    <Text style={{textAlign: 'right'}}>{weight} kg</Text> 
                    <Text style={{color: globalColors.textGray}}>Weight</Text>
                </View>
            </View>
        </View>
    );
}

function Header({ signOutFunc, bmiFunc }) {
    const user = auth.currentUser;

    return (
        <View style={[globalStyles.header, styles.profileHeader]}>
            <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={bmiFunc}>
                    <MaterialCommunityIcons name='account-circle' size={40} />
                    {
                        user !== null && <Text>{user.displayName}</Text>
                    }
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={signOutFunc}>
                <MaterialCommunityIcons name='exit-to-app' size={30} />
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}


export default function Me({ navigation }) {
    const user = auth.currentUser;
    const [age, setAge] = React.useState(18);
    const [weight, setWeight] = React.useState(70);
    const [height, setHeight] = React.useState(175);
    const [bmi, setBMI] = React.useState(0.0);

    const getUserData = async() => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let userData = docSnap.data();
            console.log("Document data:", userData);
            setAge(userData.age);
            setWeight(userData.weight);
            setHeight(userData.height);
            let bmiValue = bmiCalculation(weight, height);
            setBMI(bmiValue);
        } 
        else {
            console.log("No such document!");
        }
    }

    const bmiCalculation = (weight, height) => {
        let bmi = weight / ((height * height) / 10000);
        return bmi.toFixed(1);
    }

    const handleSignOut = () => {
        Alert.alert('Log Out', 'Do you want to log out?', [
        {
            text: 'Yes',
            onPress: () => {
                auth.signOut()
                .then(() => {
                    navigation.navigate('RegisterStack', { screen: 'Register' });
                })
            },
        },
        {
            text: 'Cancel',
        },
        ]);
    }

    const handleUpdateBMI = () => {
        navigation.navigate('RegisterStack', { screen: 'SignUpBMI' });
    }

    React.useEffect(() => {
        if (user !== null) {
            getUserData();
        }
    }, [])
    
    return (
        <View style={globalStyles.container}>
            <StatusBar barStyle="light-content" />
            <Header signOutFunc={handleSignOut} bmiFunc={handleUpdateBMI} />
            <View style={styles.profileBody}>
                <View style={{marginVertical: 20,}}>
                    <Text style={styles.bmiTitle}>BMI</Text>
                    <BMI bmi={bmi} age={age} height={height} weight={weight} />
                </View>

                <View style={{marginVertical: 20,}}>
                    <Text style={styles.bmiTitle}>Daily Intake</Text>
                    <NutritionWheel />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    profileHeader: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    profileBody: {
        flex: 1, 
        marginTop: 24,
        alignItems: 'center',
    },
    bmiTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    bmiContainer: {
        width: 334,
        height: 140,
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
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bmiText: {
        fontSize: 18,
    },
});