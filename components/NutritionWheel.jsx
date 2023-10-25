import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PieChart from 'react-native-pie-chart'

// Import global styles
import { globalColors } from '../global/styles';



const sliceColors = [globalColors.snackPurple, globalColors.vibrantBlue, globalColors.lunchOrange];

// Tempo data, delete later
const nutritions = [30, 40, 30];

export default function NutritionWheel() {
    return (
        <View style={styles.wheelContainer}>
            <PieChart 
                widthAndHeight={150} 
                series={nutritions} 
                sliceColor={sliceColors}
                coverRadius={0.5} />
            <View style={styles.details}>
                <Text>333</Text>
                <Text>333</Text>
                <Text>333</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wheelContainer: {
        width: 334,
        height: 180,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});