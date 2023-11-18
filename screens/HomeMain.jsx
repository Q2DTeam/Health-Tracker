import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { auth, db, doc, getDoc  } from '../utils/firebase';
import ProgressCircle from 'react-native-progress-circle';


// Import components
import KcalValue from '../components/KcalValue';
import NutriValue from '../components/NutriValue';
import MealItem from '../components/MealItem';
import ActionButton from '../components/ActionButton';


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
                            color="#2ED12E"
                            shadowColor="#999"
                            bgColor="#fff"
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

function HomeBody() {

}


export default function HomeMain({ navigation }) {
    const user = auth.currentUser;
    const [totalKcal, setkcalTotal] = React.useState(0);
    const [totalCarb, setcarbTotal] = React.useState(0);
    const [totalProtein, setproteinTotal] = React.useState(0);
    const [totalFat, setfatTotal] = React.useState(0);

    const [kcalEaten, setkcalEaten] = React.useState(0);
    const [kcalBurned, setkcalBurned] = React.useState(0);
    const [carbEaten, setcarbEaten] = React.useState(0);
    const [proteinEaten, setProteinEaten] = React.useState(0);
    const [fatEaten, setFatEaten] = React.useState(0); 
    
    const [meals, setMeals] = React.useState([
        {
            key: 1,
            title: 'breakfast',
        },
        {
            key: 2,
            title: 'lunch',
        },
        {
            key: 3,
            title: 'dinner',
        },
        {
            key: 4,
            title: 'snack',
        }
    ]);
    

    const getData = async() => {
        let docRef, docSnap;
        try {
            docRef = doc(db, "users", user.uid);
            docSnap = await getDoc(docRef);
        }
        catch (error) {
            Alert.alert('Oops, we cannot retrieve your data', 'Due inconsistent internet connection, we cannot fetch the data you need. Please refresh the screen to try again.');
        }

        if (docSnap.exists()) {
            let userData = docSnap.data();
            console.log("Document data:", userData);
            let {tdee, carb, protein, fat} = getNutriValue(userData.tdee, userData.carbRatio, userData.proteinRatio, userData.fatRatio);
            setkcalTotal(tdee);
            setcarbTotal(carb);
            setproteinTotal(protein);
            setfatTotal(fat);
            console.log(totalKcal, totalCarb, totalProtein, totalFat);
        } 
        else {
            console.log("No such document!");
        }
    }

    React.useEffect(() => {
        if (user !== null) {
            getData();
        }
    }, []);

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
        <View style={{backgroundColor: '#F2F5FC', flex: 1}}>
            <StatusBar barStyle="light-content" />
            <FlatList
                ListHeaderComponent={
                    <TopBar totalKcal={totalKcal} totalCarb={totalCarb} totalProtein={totalProtein} totalFat={totalFat} kcalEaten={kcalEaten}
                            kcalBurned={kcalBurned} carbEaten={carbEaten} proteinEaten={proteinEaten} fatEaten={fatEaten}  />
                }
                style={{backgroundColor: '#F2F5FC', flex: 1}}
                contentContainerStyle={{
                    marginVertical: 10,
                    alignItems: 'center'
                }}
                data={meals}
                renderItem={({item}) => (
                    <MealItem type={item.title} kcal={750} />
                )}
            /> 
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
    kcalContainer: { // The white circle
        backgroundColor: '#fff',
        width: 700,
        height: 700,
        borderRadius: 350,
        borderColor: '#E0E6F3',
        borderWidth: 3,
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
        color: "#2ED12E",
        fontFamily: 'inter-bold',
    },
    remainKcalText: {
        fontSize: 12,
        color: "#9DA8C3",
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