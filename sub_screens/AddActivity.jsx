import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl, ImageBackground, Platform } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { fetchExercises } from '../utils/fetchExercises';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { StatusBar } from 'expo-status-bar';

export default function AddActivity({ closeModal, activities, setActivities, modified }) {
    // exercise from API
    const [exercises, setExercises] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [changed, setChanged] = useState(false);

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

            // Save API data to local
            saveExercisesToLocal(data);
        }
    }

    const getExercisesLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('exercisesAPI');
            if (value !== null) {
                const exercises = JSON.parse(value);
                setExercises(exercises);
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
            if (changed) {
                modified();
            }
        }

        return (
            <View style={[globalStyles.header, {backgroundColor: globalColors.calmRed}]}>
                <View style={styles.top}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <MaterialCommunityIcons name='chevron-left' size={40} color='#fff' />
                    </TouchableOpacity>
                    <Text style={globalStyles.headerTitle}>Add a new Activity</Text>
                    <View style={{width: 30}} />
                </View>
            </View>
        )
    }

    function ExerciseItem({ id, type, name, kcal, duration }) {
        const [adding, setAdding] = useState(false);
        const [customModal, setCustomModal] = useState(false);

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
            setAdding(true);

            setTimeout(() => {
                const newExercise = {
                    id: id,
                    name: name,
                    kcal: kcal,
                    duration: duration
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
                    type: 'error',
                    text1: 'Exercise was added successfully to your diary',
                });
                setChanged(true);
            }, 100);
        }

        function AddActivityCustom() {
            const [customAdding, setCustomAdding] = useState(false);
            const [customKcal, setCustomKcal] = useState(kcal);
            const [customDur, setCustomDur] = useState(duration.toString());
    
            const handleChange = (v) => {
                let val = Number(v);
                setCustomDur(val);
                let ratio = val / duration;
                setCustomKcal(Math.round(kcal * ratio));
            }
    
            const handlePlus = () => {
                let dur = Number(customDur) + 1;
                setCustomDur(dur);
                setCustomKcal(Math.round(kcal * dur / duration));
            }
    
            const handleMinus = () => {
                let dur = Number(customDur) - 1;
                setCustomDur(dur);
                setCustomKcal(Math.round(kcal * dur / duration));
            }
    
            const handleAddCustom = () => {
                setCustomAdding(true);
    
                setTimeout(() => {
                    const newExercise = {
                        id: id,
                        name: name,
                        kcal: customKcal,
                        duration: parseInt(customDur)
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
                    setCustomAdding(false);
                    setCustomModal(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Exercise was added successfully to your diary',
                    });
                    setChanged(true);
                }, 1000);
            }
    
            return (
                <View style={customCard.container}>
                    <View style={customCard.header}>
                        <View>
                            <Text style={customCard.title}>{name}</Text>
                            <Text style={customCard.subTitle}>{customDur} minutes - {customKcal} kcal</Text>
                        </View>
                        <TouchableOpacity onPress={() => {setCustomModal(false)}}>
                            <MaterialCommunityIcons name='close' color='#fff' size={26} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={customCard.mid}>
                            <TouchableOpacity style={customCard.btn} onPress={handleMinus}>
                                <MaterialCommunityIcons name='minus' size={26} />
                            </TouchableOpacity>
                            <TextInput style={customCard.input}
                                keyboardType='numeric'
                                value={customDur.toString()}
                                onChangeText={(val) => {
                                    handleChange(val);
                                }}
                            />
                            <TouchableOpacity style={customCard.btn} onPress={handlePlus}>
                                <MaterialCommunityIcons name='plus' size={26} />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            {customAdding ? (
                                <View style={customCard.addBtn}>
                                    <ActivityIndicator size='small' color='#fff'/> 
                                </View>
                            ) : (
                                <TouchableOpacity style={customCard.addBtn} onPress={handleAddCustom}>
                                    <Text style={{fontSize: 16, color:'#fff'}}>Add exercise</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            )
        }
    
        function CustomModal() {
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={customModal}
                >
                    <View intensity={20}
                     style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 25,
                    }}>
                        <AddActivityCustom />
                    </View>
                </Modal>
            )
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
                <CustomModal />
                <ImageBackground style={styles.exerciseContainer} source={image} resizeMode='cover'>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity style={{marginLeft: 20}} onPress={() => {setCustomModal(true)}}>
                            <Text style={{ fontSize: 18, fontFamily: 'inter-semibold', color: '#fff' }}>{name}</Text>
                            <Text style={{ fontFamily: 'inter-regular', color: '#fff' }}>{kcal} kcal - {duration} min</Text>
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
                        kcal={item.kcal}
                        duration={item.duration}      
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
        paddingTop: Platform.OS === 'android' ? 0 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
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

const customCard = StyleSheet.create({
    container: {
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        width: 340,
        height: 220,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    header: {
        padding: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: globalColors.calmRed
    },
    title: {
        fontFamily: 'inter-semibold',
        fontSize: 18,
        color: '#fff'
    },  
    subTitle: {
        fontFamily: 'inter-regular',
        fontSize: 18,
        color: '#fff'
    },
    mid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    btn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#dedede',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        fontFamily: 'inter-regular',
        fontSize: 20,
        width: 100,
        borderBottomWidth: 1,
        padding: 5,
        textAlign: 'center',
    },
    addBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: globalColors.calmRed,
        marginTop: 10,
        width: 140,
        padding: 10,
    },
});