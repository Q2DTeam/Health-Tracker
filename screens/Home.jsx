import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'

// Import components
import KcalValue from '../components/KcalValue';
import NutriValue from '../components/NutriValue';
import MealItem from '../components/MealItem';

const user = {
    totalKcal: 2500,
    totalCarbs: 257,
    totalProtein: 257,
    totalFats: 98,
    kcalBurned: 1000,
    kcalEaten: 1400,
    carbEaten: 100,
    proteinEaten: 100,
    fatEaten: 100,
}

export default function Home() {
    return (
        <View style={{backgroundColor: '#F2F5FC', flex: 1}}>
            <StatusBar barStyle="light-content" />

            <ScrollView 
                style={{backgroundColor: '#F2F5FC', flex: 1, borderWidth: 1,}}
                contentContainerStyle={{alignItems: 'center'}}
            > 
                <View style={styles.topBar}>
                    <View style={styles.kcalContainer}> 
                        <View style={styles.infoContainer}>
                            <View style={styles.kcalWrapper}>
                                <KcalValue icon='fire' title='burned' value={user.kcalBurned} />
                                <ProgressCircle 
                                    percent={Math.round(user.kcalEaten / (user.totalKcal + user.kcalBurned) * 100)}
                                    radius={90}
                                    borderWidth={8}
                                    color="#2ED12E"
                                    shadowColor="#999"
                                    bgColor="#fff"
                                >
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.remainKcalValue}>{user.totalKcal + user.kcalBurned - user.kcalEaten}</Text>
                                        <Text style={styles.remainKcalText}>Kcal remaining</Text>
                                    </View>
                                </ProgressCircle>
                                <KcalValue icon='silverware-variant' title='eaten' value={user.kcalEaten} />
                            </View>
                            <View style={styles.nutriWrapper}>
                                <NutriValue title="Carbs" total={user.totalCarbs} consumed={user.carbEaten} />
                                <NutriValue title="Proteins" total={user.totalProtein} consumed={user.proteinEaten} />
                                <NutriValue title="Fats" total={user.totalFats} consumed={user.fatEaten} />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.homeBody}>
                    
                </View>
            </ScrollView>
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
        marginTop: 10,
        borderWidth: 1,
        flex: 1,
    },
});