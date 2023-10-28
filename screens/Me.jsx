import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../utils/firebase';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import components
import BMI from '../components/BMI';
import NutritionWheel from '../components/NutritionWheel';

function Header({ signOutFunc }) {
    const user = auth.currentUser;

    return (
        <View style={[globalStyles.header, styles.profileHeader]}>
            <View style={{alignItems: 'center'}}>
                <MaterialCommunityIcons name='account-circle' size={40} />
                {
                    user !== null && <Text>Hello, {user.displayName}</Text>
                }
            </View>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={signOutFunc}>
                <MaterialCommunityIcons name='exit-to-app' size={30} />
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}


export default function Me({ navigation }) {

    const handleSignOut = () => {
        Alert.alert('Log Out', 'Do you want to log out?', [
        {
            text: 'Yes',
            onPress: () => {
                auth.signOut()
                .then(() => {
                    navigation.navigate('RegisterStack', { screen: 'Register' })
                })
            },
        },
        {
            text: 'Cancel',
        },
        ]);
    }
    
    return (
        <View style={globalStyles.container}>
            <StatusBar barStyle="light-content" />
            <Header signOutFunc={handleSignOut} />
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