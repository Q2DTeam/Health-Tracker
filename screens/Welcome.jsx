import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { globalStyles } from '../global/styles';


// Import icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';


export default function Welcome({navigation}) {
    return (
        <View style={globalStyles.container}>
            <StatusBar style='light' />
            <ImageBackground source={require('../assets/images/login_BG.jpg')} alt='Background image' resizeMode='cover' style={styles.registerContainer}>
            
                <Image source={require('../assets/images/Logo_alt.png')} style={styles.logo} />
                
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
        height: 132,
        width: 240,
        marginTop: 60,
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
        fontSize: 20, 
        textAlign: 'center'
    },
    bottomTextBold: {
        color: '#fff', 
        fontSize: 20, 
        textAlign: 'center',
        fontWeight: 'bold',
    }
});