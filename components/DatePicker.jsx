import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment'; 


export default function DatePicker({ setShowCalendar }) {
    const weekDay = moment().format('dddd');
    const [date, setDate] = useState(moment().format('MMM Do'));

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
        //borderWidth: 1,
        width: 350,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
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