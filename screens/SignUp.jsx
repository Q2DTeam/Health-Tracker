import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ImageBackground, Image, Modal } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { Formik } from 'formik';
import { auth, createUserWithEmailAndPassword, updateProfile } from '../utils/firebase';
import * as yup from 'yup';

// Import icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import components
import UpdateBMI from '../sub_screens/UpdateBMI';


const SignUpSchema = yup.object({
    username: yup.string()
    .label('Username')
    .min(5)
    .required(),
    email: yup.string().email()
    .label('Email')
    .required(),
    password: yup.string()
    .label('Password')
    .min(6)
    .required(),
    confirmPass: yup.string()
    .label('Password confirmation')
    .required()
    .oneOf([yup.ref('password')], 'Your passwords do not match.')
});


export default function Signup({navigation}) {
    const [bmiModal, setBMIModal] = useState(false);

    const handleSignUp = (values) => {
        createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
            updateProfile(auth.currentUser, {
                displayName: values.username,
            });
            Alert.alert('User registered successfully!');
            setBMIModal(true);
        })
        .catch(() => {
            Alert.alert("Registrations failed", "There's an error that's preventing you from creating the account. Please try again.");
        });
    }

    function UpdateBMIHeader() {
        const handleHideBMIModal = () => {
            setBMIModal(false);
        }

        return (
            <View style={[globalStyles.header, {height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,}]}>
                <TouchableOpacity style={globalStyles.backButton} onPress={handleHideBMIModal}>
                    <MaterialCommunityIcons name='chevron-left' size={30} />
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={globalStyles.headerTitle}>Update your BMI</Text>
                </View>
            </View>
        )
    }

    function UpdateBMIModal() {
        return (
            <Modal
                animationType="slide"
                visible={bmiModal}
            >
                <View style={{flex: 1}}>
                    <UpdateBMIHeader />
                    <UpdateBMI />
                </View>
            </Modal>
        )
    }


    return (
        <ImageBackground source={require('../assets/images/login_BG.jpg')} alt='Background image' resizeMode='cover' style={globalStyles.container}>
            <StatusBar style='light' />
            <UpdateBMIModal />
            <ScrollView
                contentContainerStyle={{ alignItems: 'center'}}
            >
                <View style={styles.logo}>
                    <Image source={require('../assets/images/Logo.png')}/>
                </View>
                <View style={globalStyles.formContainer}>
                    <Formik
                        initialValues={{username: '', email: '', password: '', confirmPass: ''}}
                        validationSchema={SignUpSchema}
                        onSubmit={(values) => {
                            handleSignUp(values);
                        }}
                    >
                    {
                        ({handleChange, handleSubmit, values, errors}) => (
                        <View style={{alignItems: 'center'}}>
                            <View>
                                <View style={globalStyles.form_inputWrapper}>
                                    <MaterialCommunityIcons name='account-circle' size={24} />
                                    <TextInput
                                        placeholder='Username' 
                                        style={globalStyles.form_input}
                                        value={values.username}
                                        onChangeText={handleChange('username')}
                                    />
                                </View>
                                <Text style={globalStyles.errorText}>{errors.username}</Text>
                            </View>

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
                                        secureTextEntry
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        />
                                </View>
                                <Text style={globalStyles.errorText}>{errors.password}</Text>
                            </View>

                            <View>
                                <View style={globalStyles.form_inputWrapper}>
                                    <MaterialCommunityIcons name='lock' size={24}/>
                                    <TextInput 
                                        placeholder='Confirm Password'
                                        style={globalStyles.form_input}
                                        secureTextEntry
                                        value={values.confirmPass}
                                        onChangeText={handleChange('confirmPass')}
                                        />    
                                </View>
                                <Text style={globalStyles.errorText}>{errors.confirmPass}</Text>
                            </View>

                            <TouchableOpacity style={globalStyles.submitBtn} onPress={handleSubmit}>
                                <Text style={{color: '#fff', fontSize: 20,}}>Sign up</Text>
                            </TouchableOpacity>
                        </View>)
                    }
                    </Formik>
                </View>
                <View style={{marginTop: 50}}>
                    <Text style={styles.bottomText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')}>
                        <Text style={styles.bottomTextBold}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: '#fff',
        marginTop: 40,
    },
    logo: {
        height: 130,
        width: 240,
        marginTop: 60,
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
    },
});