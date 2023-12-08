import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { globalStyles } from '../global/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import icons
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Register({navigation}) {
    const getAuth = async() => {
        try {
            const value = await AsyncStorage.getItem('auth');
            if (value !== null) {
                navigation.replace('Main');
            }
        } catch (e) {
            console.log("Can't fetch auth");
        }
    };

    useEffect(() => {
        getAuth();
    }, [])

    return (
        <View style={globalStyles.container}>
            <ImageBackground source={require('../assets/images/register_BG.jpg')} alt='Background image' resizeMode='cover' style={styles.registerContainer}>
                <View style={styles.logo}>
                    <Image source={require('../assets/images/Logo.png')}/>
                </View>
                <View>
                    <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.replace('Login')}>
                        <MaterialCommunityIcons name='email' size={24} />
                        <Text style={styles.btnText}>Sign in with emails</Text>
                    </TouchableOpacity>
                </View>
                <View style={{margin: 20,}}>
                    <Text style={styles.bottomText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.replace('Signup')}>
                        <Text style={styles.bottomTextBold}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: '#fff',
    },
    logo: {
        height: 130,
        width: 240,
        marginTop: 40,
    },
    registerContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1, 
    },
    signInBtn: {
        width: 300,
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
    },
    btnText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },
    bottomText: {
        color: '#fff', 
        fontSize: 18, 
        textAlign: 'center'
    },
    bottomTextBold: {
        color: '#fff', 
        fontSize: 18, 
        textAlign: 'center',
        fontWeight: 'bold',
    }
});