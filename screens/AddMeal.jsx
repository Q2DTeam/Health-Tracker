import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

// Import styles
import { globalColors, globalStyles } from '../global/styles';


function Header({ title='breakfast', backFunc }) {
    return (
        <View style={globalStyles.header}>
            <View style={styles.top}>
                <TouchableOpacity style={globalStyles.backButton} onPress={backFunc}>
                    <MaterialCommunityIcons name='chevron-left' size={30} />
                </TouchableOpacity>
                <Text style={globalStyles.headerTitle}>{title[0].toUpperCase() + title.slice(1)}</Text>
                <Text style={styles.kcalText}>{0} kcal</Text>
            </View>
            <View style={styles.mid}>
                <SearchBar />
            </View>
        </View>
    )
}

function SearchBar({}) {
    return (
        <View style={globalStyles.searchBar}>
            <MaterialCommunityIcons name='magnify' size={26} color={globalColors.textGray} />
            <TextInput 
                style={globalStyles.searchInput} 
                placeholder='What did you eat ?' />
        </View>
    );
}


export default function AddMeal({ navigation }) {
    const goBack = () => {
        navigation.goBack();
    }

    return (
        <View style={globalStyles.container}>
            <Header backFunc={goBack} />
            
        </View>
    )
}

const styles = StyleSheet.create({
    top: {
        margin: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    kcalText: {
        color: globalColors.textGray,
        fontSize: 16,
    },
    mid: {
        marginHorizontal: 20,
    }
});