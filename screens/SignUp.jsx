import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { Formik } from 'formik';
import { auth, createUserWithEmailAndPassword, updateProfile } from '../utils/firebase';
import * as yup from 'yup';

// Import icons
import { MaterialCommunityIcons } from '@expo/vector-icons';


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
    // const addUserData = async(userID) => {
    //     try {
    //         const docRef = await setDoc(collection(db, "users"), {
    //             id: userID, 
    //             gender: true,
    //             age: 18,
    //             weight: 70,
    //             height: 175,
    //             activityLevel: 2,
    //         });
    //         console.log("Document written with ID: ", docRef.id);
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
    // }

    const handleSignUp = (values) => {
        createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
            updateProfile(auth.currentUser, {
                displayName: values.username,
            });
            Alert.alert('User registered successfully!');
            navigation.navigate('SignUpBMI');
        })
        .catch(() => {
            Alert.alert("Registrations failed", "There's an error that's preventing you from creating the account. Please try again.");
        });
    }


    return (
        <ScrollView style={[globalStyles.container, styles.signUp1]}
            contentContainerStyle={{justifyContent: 'space-between',}}>
            <Text style={styles.title}>Sign up</Text>
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
                    <View>
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

            <View style={{margin: 20,}}>
                <Text style={styles.bottomText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                    <Text style={styles.bottomTextBold}>Log In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    signUp1: {
        backgroundColor: globalColors.vibrantBlue,
        // justifyContent: 'space-between',
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: '#fff',
        marginTop: 40,
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
    },
});