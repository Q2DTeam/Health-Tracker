import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

// Import components
import KcalValue from '../components/KcalValue';

const user = {
    totalKcal: 2500,
    totalCarbs: 257,
    totalProtein: 257,
    totalFats: 98,
    kcalBurned: 750,
    kcalEaten: 1000,
}

export default function Home() {
    return (
        <View style={{backgroundColor: '#F2F5FC', flex: 1}}>
            <StatusBar barStyle="light-content" />
            <View style={styles.kcalContainer}> 
                <View style={styles.topBar}></View>
                <View style={styles.infoContainer}>
                    <View style={styles.kcalWrapper}>
                        <KcalValue icon='fire' title='burned' value={690} />
                        <KcalValue icon='silverware-variant' title='eaten' value={690} />
                    </View>
                    <View style={styles.nutriWrapper}>

                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    kcalContainer: { // The white circle
        backgroundColor: '#fff',
        width: 700,
        height: 700,
        borderRadius: 350,
        borderColor: '#E0E6F3',
        borderWidth: 3,
        position: 'relative',
        top: '-45%',
        left: '-35%',
        paddingTop: 400,
        paddingHorizontal: 175,
    },
    kcalWrapper: {
        //borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 175,
        paddingBottom: 20,
    }
});