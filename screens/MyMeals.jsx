import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { auth } from '../utils/firebase';
import { db, doc, getDoc } from '../utils/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CreateFood from '../sub_screens/CreateFood';


export default function MyMeals() {
    const [user, setUser] = useState(auth.currentUser);
    const [foods, setFoods] = useState([]);
    const [meals, setMeals] = useState([]);

    const [foodModal, setFoodModal] = useState(false);
    const [mealModal, setMealModal] = useState(false);

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((val) => {setUser(val)});
        return subscriber;
    }, []);


    function Header() {
        const handleAdd = () => {
            setFoodModal(true);
        }

        return (
            <View style={[globalStyles.header, {padding: 10}]}>
                <Text style={styles.headerTitle}>My meals</Text>
                <View style={styles.headerBottom}>
                    <SearchBar />
                    <TouchableOpacity onPress={handleAdd}>
                        <MaterialCommunityIcons name='plus' color='#fff' size={40} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function SearchBar() {
        const [search, setSearch] = useState('');

        const handleSearch = () => {
            const formattedQuery = search.toLowerCase();
            // if (search.length > 0) {
            //     const filtered = foods.filter((item) => item.name.toLowerCase().includes(formattedQuery));
            //     setFilteredFoods(filtered);
            // }
            // else {
            //     setFilteredFoods(foods);
            // }
        }

        return (
            <View style={[globalStyles.searchBar, {backgroundColor: '#fff', borderRadius: 25, borderBottomWidth: 0, paddingHorizontal: 10, width: 340}]}>
                <MaterialCommunityIcons name='magnify' size={26} />
                <TextInput 
                    style={globalStyles.searchInput} 
                    placeholder='Search'
                    clearButtonMode='always'
                    returnKeyType='search'
                    onChangeText={(query) => {
                        setSearch(query);
                    }}
                    onSubmitEditing={(a) => {
                        handleSearch();
                    }}
                />
            </View>
        );
    }

    function CreateFoodModal() {
        return (
        <Modal
            animationType="slide"
            visible={foodModal}
        >
            <View style={{flex: 1}}>
                <CreateFood
                    cancelFunc={() => {setFoodModal(false)}}
                />
            </View>
        </Modal>
        )
    }

    function FoodItem({ id, name, kcal, carb, protein, fat, serving, unit }) {
        return (
            <View style={itemStyles.container}>
                <TouchableOpacity style={itemStyles.infoWrapper}>
                    <Text style={itemStyles.foodName}>{name[0].toUpperCase() + name.slice(1)}</Text>
                    <Text style={itemStyles.foodKcal}>{serving} {unit} - {kcal} kcal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.addButton} onPress={handleAdd}>
                    <AntDesign name='plus' size={28} color='#fff' />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={globalStyles.container}>
            <StatusBar style='light' />
            <CreateFoodModal />
            <View style={{alignItems: 'center', flex: 1}}>
                <Header />
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'inter-bold',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});