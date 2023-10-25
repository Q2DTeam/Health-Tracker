import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Import styles
import { globalColors } from '../global/styles';

// Import components
import BMI from '../components/BMI';
import NutritionWheel from '../components/NutritionWheel';


export default function Me() {
    return (
        <View style={{flex: 1, backgroundColor: globalColors.backgroundGray}}>
            <StatusBar barStyle="light-content" />
            <View style={styles.profileBody}>
                <View style={{marginVertical: 20,}}>
                    <Text style={styles.bmiTitle}>BMI</Text>
                    <BMI />
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
    profileBody: {
        flex: 1, 
        marginTop: 24,
        alignItems: 'center',
    },
    bmiTitle: {
        fontSize: 20,
        marginBottom: 10,
    }
});