import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../utils/firebase';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import components
import BMI from '../components/BMI';
import NutritionWheel from '../components/NutritionWheel';

function Header() {
    const user = auth.currentUser;

    const handleSignOut = () => {
        Alert.alert('Log Out', 'Do you want to log out?', [
        {
            text: 'Yes',
            onPress: () => {
                auth.signOut()
                .then(() => {
                    navigation.navigate('Home');
                })
            },
        },
        {
            text: 'Cancel',
        },
        ]);
    }

    return (
        <View style={[globalStyles.header, styles.profileHeader]}>
            <TouchableOpacity onPress={handleSignOut}>
                <Text style={{fontSize: 20}}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialCommunityIcons name='cog' size={30} />
            </TouchableOpacity>
        </View>
    )
}


export default function Me() {
    return (
        <View style={globalStyles.container}>
            <StatusBar barStyle="light-content" />
            <Header />
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
});