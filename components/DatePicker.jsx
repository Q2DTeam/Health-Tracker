import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment'; 

//Fix calender
export default function DatePicker({ currentDate, setShowCalendar }) {
    const weekDay = moment(currentDate, 'YYYY-MM-DD').format('dddd');
    const date = moment(currentDate, 'YYYY-MM-DD').format('MMM Do');

    return (
        <View style={styles.container}>
            <Text style={styles.dateTitle}>{weekDay}</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={setShowCalendar}>
                <MaterialCommunityIcons name='calendar-blank' color='#fff' size={26} />
                <Text style={styles.date}>{date}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 350,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 5,
    },
    dateTitle: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'inter-semibold',
    },
    date: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'inter-regular',
        marginLeft: 10,
    },
    dateBtn: {
        flexDirection: 'row',

    },
});