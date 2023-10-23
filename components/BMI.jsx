import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Import styles
import { globalColors } from '../global/styles';

const bmiValue = {
    height: 173,
    weight: 72,
};

export default function BMI() {
    return (
        <View style={styles.bmiContainer}>
            <View style={styles.bmiHalf}>
                <View>
                    <Text style={{fontSize: 18}}>BMI</Text>
                    <Text style={{fontSize: 18, color: '#E61313'}}>24.0</Text>
                </View>
                <Text style={{fontSize: 20, color: globalColors.breakfastGreen}}>Healthy</Text>
            </View>
            <View style={{borderWidth: 1, width: '100%', borderColor: globalColors.textGray}} />
            <View style={styles.bmiHalf}>
                <View>
                    <Text>{bmiValue.height} cm</Text> 
                    <Text style={{color: globalColors.textGray}}>Height</Text>
                </View>
                <View>
                    <Text style={{textAlign: 'right'}}>{bmiValue.weight} kg</Text> 
                    <Text style={{color: globalColors.textGray}}>Height</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bmiContainer: {
        width: 334,
        height: 140,
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
    bmiHalf: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bmiText: {
        fontSize: 18,
    }
});