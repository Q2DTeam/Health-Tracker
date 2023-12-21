import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { auth } from '../utils/firebase';
import { db } from '../utils/firestore';
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

import AddActivity from './AddActivity';


export default function ActivityInfo({ navigation, route }) {
    const { date } = route.params;
    const uid = auth.currentUser.uid;
    
    // contains exercises that user did
    const [activities, setActivities] = useState([]);

    const [addModal, setAddModal] = useState(false);
    const [modified, setModified] = useState(false);

    const getRecordLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('activities');
            if (value !== null) {
                const activity = JSON.parse(value);
                if (activity.date == date && activity.userID == uid) {
                    setActivities(activity.exercises);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const saveRecordToDb = async() => {

    }

    const saveRecordToLocal = async() => {

    }

    function Header() {

        const handleGoBack = () => {
            if (modified == true) {
                saveRecordToDb();
                saveRecordToLocal();
            }
            navigation.goBack();
        }

        return (
            <View style={[globalStyles.header, {backgroundColor: globalColors.calmRed}]}>
                <View style={styles.top}>
                    <TouchableOpacity style={globalStyles.backButton} onPress={handleGoBack}>
                        <MaterialCommunityIcons name='chevron-left' size={40} color='#fff' />
                    </TouchableOpacity>
                    <Text style={globalStyles.headerTitle}>Manage your activities</Text>
                    <Text style={styles.kcalText}>{0} kcal</Text>
                </View>
            </View>
        )
    }

    function AddButton() {
        return (
            <TouchableOpacity 
                style={styles.addBtn} 
                onPress={() => {
                    setAddModal(true);
                }}
            >
                <MaterialCommunityIcons name='plus' size={20} />
                <Text style={styles.addText}>Add a fitness activity</Text>
            </TouchableOpacity>
        )
    }

    function AddModal() {
        return (
            <Modal
                animationType="slide"
                visible={addModal}
                style={{margin: 0}}
            >
                <View style={{flex: 1}}>
                    <AddActivity
                        closeModal={() => {
                            setAddModal(false)
                        }} 
                        activities={activities}
                        setActivities={setActivities}
                        modified={() => {setModified(true)}}
                    />
                </View>
            </Modal>
        )
    }

    function ActivityCard({ id, name, kcal, duration }) {

        const handleDelete = () => {
            setModified(true);
            const newActs = activities.filter((item) => item.id != id);
            setActivities(newActs);
        }

        return (
            <View style={cardStyles.card}>
                <View style={{
                    backgroundColor: globalColors.calmRed,
                    width: 10, 
                    height: '100%' 
                }}/>
                <View style={cardStyles.cardBody}>
                    <Text style={cardStyles.cardTitle}>{name}</Text>
                    <Text style={cardStyles.cardSubtext}>{kcal} kcal - {duration} minutes</Text>
                </View>
                <TouchableOpacity style={cardStyles.deleteBtn} onPress={handleDelete}>
                    <AntDesign name='close' size={18} color='#fff'/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[globalStyles.container, {alignItems: 'center'}]}>
            <Header />
            <AddModal />
            <AddButton />
        </View>
    )
}

const styles = StyleSheet.create({
    top: {
        margin: 10,
        marginTop: 20,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    kcalText: {
        color: '#fff',
        fontSize: 16,
    },
    addBtn: {
        width: 300,
        padding: 10,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'dashed'
    },
    addText: {
        fontSize: 18,
        marginLeft: 10,
    },
});

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: 334,
        minHeight: 75,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginVertical: 7,
    },
    cardBody: {
        padding: 10,
        paddingLeft: 20,
        width: 280,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'inter-semibold',
        marginBottom: 5,
    },
    cardSubtext: {
        fontFamily: 'inter-regular',
        color: '#9DA8C3',
    },
    deleteBtn: {
        width: 30, 
        height: 30,
        borderRadius: 15,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
    },
});