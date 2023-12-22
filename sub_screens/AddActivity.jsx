import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl, ImageBackground } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { fetchExercises } from '../utils/fetchExercises';
import { auth } from '../utils/firebase';
import { db, doc, getDoc } from '../utils/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { StatusBar } from 'expo-status-bar';

export default function AddActivity({ closeModal, activities, setActivities, modified }) {
    const user = auth.currentUser;
    // exercise from API
    const [exercises, setExercises] = useState();

    const [filteredExercises, setFilteredExercises] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
    const [foodFetched, setFoodFetched] = useState(false);

    const [temp, setTemp] = useState(activities);
    

    const saveExercisesToLocal = async(list) => {
        try {
            const jsonValue = JSON.stringify(list);
            await AsyncStorage.setItem('exercisesAPI', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const getExercises = async() => {
        // Call API
        const data = await fetchExercises();
        if (data != undefined) {
            setExercises(data);
            setFilteredExercises(data);

            // Save API foods to local
            saveExercisesToLocal(data);
        }
    }

    const getExercisesLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('exercisesAPI');
            if (value !== null) {
                const exercises = JSON.parse(value);
                setExercises(exercises);
                setFilteredExercises(exercises);
            }
            else {
                await getExercises();
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getExercisesLocal();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getExercises();
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }, []);

    function Header() {
        const handleGoBack = () => {
            setActivities(temp);
            closeModal();
        }

        return (
            <View style={[globalStyles.header, {backgroundColor: globalColors.calmRed}]}>
                <View style={styles.top}>
                    <TouchableOpacity style={globalStyles.backButton} onPress={handleGoBack}>
                        <MaterialCommunityIcons name='chevron-left' size={30} color='#fff' />
                    </TouchableOpacity>
                    <Text style={[globalStyles.headerTitle, {marginLeft: 30}]}>Add a new Activity</Text>
                </View>
            </View>
        )
    }

    function ExerciseItem({ id, type, name, burn_rate, default_duration }) {
        const [adding, setAdding] = useState(false);

        let image;
        switch (type) {
            case 'running':
                image = require('../assets/exercises/running.jpg');
                break;
            case 'cycling':
                image = require('../assets/exercises/cycling.jpg');
                break;
            case 'rope skipping':
                image = require('../assets/exercises/rope_skip.jpg');
                break;
            case 'hiit':
                image = require('../assets/exercises/hiit.jpg');
                break;
            case 'gym':
                image = require('../assets/exercises/gym.jpg');
                break;
            case 'yoga':
                image = require('../assets/exercises/yoga.jpg');
                break;
            case 'swimming':
                image = require('../assets/exercises/swimming.jpg');
                break;
            case 'volleyball':
                image = require('../assets/exercises/volleyball.jpg');
                break;
            case 'football':
                image = require('../assets/exercises/football.jpg');
                break;
            case 'badminton':
                image = require('../assets/exercises/badminton.jpg');
                break;
        }

        const handleAdd = () => {
            modified();
            setAdding(true);

            setTimeout(() => {
                const newExercise = {
                    id: id,
                    name: name,
                    kcal: burn_rate,
                    duration: default_duration
                }
                let index = temp.findIndex(item => item.id === newExercise.id);
                if (index == -1) {
                    setTemp(old => [newExercise, ...old]);
                }
                else {
                    const oldItem = temp[index];
                    const newTemp = temp.filter((item) => item.id != newExercise.id);
                    newExercise.kcal += oldItem.kcal;
                    newExercise.duration += oldItem.duration;
                    setTemp([newExercise, ...newTemp]);
                }
                setAdding(false);
                Toast.show({
                    type: 'success',
                    text1: 'Exercise was added successfully to your diary',
                });
            }, 1000);
        }

        return (
            <View style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,
                elevation: 10,
            }}
            >
                <ImageBackground style={styles.exerciseContainer} source={image} resizeMode='cover'>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity style={{marginLeft: 20}}>
                            <Text style={{ fontSize: 18, fontFamily: 'inter-semibold', color: '#fff' }}>{name}</Text>
                            <Text style={{ color: '#fff' }}>{burn_rate} kcal / {default_duration} min</Text>
                        </TouchableOpacity>
                        {
                            adding ? (
                                <ActivityIndicator size="large" color={globalColors.calmRed} />
                            ) : (
                                <TouchableOpacity style={[globalStyles.addButton, {backgroundColor: globalColors.calmRed}]}
                                onPress={handleAdd}>
                                    <AntDesign name='plus' size={24} color='#fff' />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </ImageBackground>
            </View>
        )
    }

    return (
        <View style={globalStyles.container}>
        <StatusBar style='light' />
        <Header />
        <FlatList 
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <ExerciseItem 
                    id={item.id}
                    type={item.type}
                    name={item.name}
                    burn_rate={item.burn_rate}
                    default_duration={item.default_duration}      
                />
            )}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
                alignItems: 'center',
                paddingVertical: 10,
            }}
        />
        <Toast />
    </View>
    )
}

const styles = StyleSheet.create({
    top: {
        padding: 10,
        paddingTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mid: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    exerciseContainer: {
        width: 334,
        minHeight: 80,
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
    },
});