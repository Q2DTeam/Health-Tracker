import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import PieChart from 'react-native-pie-chart'

// Import global styles
import { globalColors } from '../global/styles';


const sliceColors = [globalColors.vibrantBlue, globalColors.lunchOrange, globalColors.snackPurple];

export default function NutritionWheel({ nutritions }) {

    return (
        <View style={styles.wheelContainer}>
            <PieChart 
                widthAndHeight={150} 
                series={nutritions} 
                sliceColor={sliceColors}
                coverRadius={0.001} 
            />
            <View style={styles.details}>
                <View style={styles.infoItem}>
                    <FontAwesome name='circle' color={globalColors.vibrantBlue} size={18} />
                    <Text style={styles.infoName}>Carbs</Text>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name='circle' color={globalColors.lunchOrange} size={18} />
                    <Text style={styles.infoName}>Protein</Text>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name='circle' color={globalColors.snackPurple} size={18} />
                    <Text style={styles.infoName}>Fats</Text>
                </View>
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
    details: {
        justifyContent: 'space-around',
        height: 120,
    },
    infoItem: {
        minWidth: 100,
        flexDirection: 'row',
    },
    infoName: {
        marginLeft: 10,
        fontSize: 16,
    },
});