import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Alert, Image } from 'react-native';
import { globalStyles, globalColors } from '../global/styles';
import { Formik } from 'formik';
import { auth, signInWithEmailAndPassword} from '../utils/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

// Import icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';


const LoginSchema = yup.object({
    email: yup.string().email()
    .label('Email')
    .required(),
    password: yup.string()
    .label('Password')
    .min(6)
    .required(),
});

export default function Login({navigation}) {
    const handleLogin = (values) => {
        signInWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
            navigation.navigate('Main');
        })
        .catch(() => {
            Alert.alert("Login failed", "The email address or password that you've entered doesn't match any account. Please try again.");
        });
    }

    return (
        <ImageBackground 
            source={require('../assets/images/login_BG.jpg')} alt='Background image' resizeMode='cover'  
            style={[globalStyles.container, styles.login]}
            blurRadius={10}
        >
            <StatusBar style="light" />
            <SafeAreaView
                style={{alignItems: 'center', justifyContent: 'space-between', flex: 1}}
            >
                <Image source={require('../assets/images/Logo_alt.png')} style={styles.logo} />

                <View>
                    <Formik
                        initialValues={{email: '', password: ''}}
                        validationSchema={LoginSchema}
                        onSubmit={(values) => {
                            handleLogin(values);
                        }}
                    >
                    {
                        ({handleChange, handleSubmit, values, errors}) => (
                        <View style={{padding: 20, paddingTop: 0, alignItems: 'center'}}>
                            <View>
                                <View style={globalStyles.form_inputWrapper}>
                                    <MaterialCommunityIcons name='email' size={24}/>
                                    <TextInput
                                        placeholder='Email' 
                                        style={globalStyles.form_input}
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                    />
                                </View>
                                <Text style={globalStyles.errorText}>{errors.email}</Text>
                            </View>

                            <View>
                                <View style={globalStyles.form_inputWrapper}>
                                    <MaterialCommunityIcons name='lock' size={24}/>
                                    <TextInput 
                                        placeholder='Password'
                                        style={globalStyles.form_input}
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        secureTextEntry
                                    />
                                </View>
                                <Text style={globalStyles.errorText}>{errors.password}</Text>
                            </View>

                            <TouchableOpacity style={{
                                marginTop: 30,
                                padding: 10,
                                paddingHorizontal: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 25,
                                backgroundColor: globalColors.darkerGreen,
                            }} onPress={handleSubmit}>
                                <Text style={{color: '#fff', fontSize: 20,}}>Login</Text>
                            </TouchableOpacity>
                        </View>)
                    }
                    </Formik>
                </View>

                <View style={{marginBottom: 20,}}>
                    <Text style={styles.bottomText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.replace('Signup')}>
                        <Text style={styles.bottomTextBold}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    login: {
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        height: 132,
        width: 240,
        marginTop: 20,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: '#fff',
        marginTop: 40,
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