import {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { fetchFoods } from '../utils/fetchFoods';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
//import AddMealItem from '../components/AddMealItem';


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

function AddMealItem( { serving = '100g', id, name, kcal, addFunc } ) {
    const handleAdd = () => {
        addFunc(old => [{
            id: id,
            name: name,
            kcal: kcal,
        }, ...old]);
    }

    return (
        <View style={itemStyles.container}>
            <TouchableOpacity style={itemStyles.infoWrapper}>
                <Text style={itemStyles.foodName}>{name[0].toUpperCase() + name.slice(1)}</Text>
                <Text style={itemStyles.foodKcal}>{serving} - {kcal} kcal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.addButton} onPress={handleAdd}>
                <AntDesign name='plus' size={28} color='#fff' />
            </TouchableOpacity>
        </View>
    )
}



export default function AddMeal({ navigation, route }) {
    const [foods, setFoods] = useState([]);
    const [IDs, setIDs] = useState([]);
    const [meal, setMeal] = useState([]);

    const { title } = route.params;

    const goBack = () => {
        navigation.goBack();
    }

    const getFoods = async() => {
        // CAll API
        const data = await fetchFoods();
        if (data != undefined) {
            data.map((food) => {
                if (IDs.indexOf(food.ID) === -1) {
                    setFoods((old) => [{
                        id: food.ID,
                        name: food.Name,
                        calorie: food.Calories,
                        serving: food.Unit
                    }, ...old]);
                    setIDs(old => [food.ID, ...old]);
                }
            })
        }
    }

    useEffect(() => {
        getFoods();
    }, [])

    return (
        <View style={globalStyles.container}>
            <Header title={title} backFunc={goBack} />
            <FlatList 
                data={foods}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <AddMealItem 
                        serving={item.serving}
                        id={item.id} 
                        name={item.name} 
                        kcal={item.calorie}
                        addFunc={setMeal}
                    />
                )}
            />
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

const itemStyles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 20,
        minHeight: 80,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoWrapper: {
        flex: 1,
        marginRight: 20,
    },
    foodName: {
        fontSize: 18,
        marginBottom: 5,
    },
    foodKcal: {
        color: globalColors.textGray,
    },
});