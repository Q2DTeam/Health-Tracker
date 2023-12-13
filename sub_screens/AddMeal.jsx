import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { fetchFoods } from '../utils/fetchFoods';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import styles
import { globalColors, globalStyles } from '../global/styles';


function Header({ title='breakfast', backFunc }) {
    return (
        <View style={globalStyles.header}>
            <View style={styles.top}>
                <TouchableOpacity style={globalStyles.backButton} onPress={backFunc}>
                    <MaterialCommunityIcons name='chevron-left' size={30} />
                </TouchableOpacity>
                <Text style={[globalStyles.headerTitle, {marginLeft: 30}]}>Add food to your {title}</Text>
            </View>
        </View>
    )
}

function SearchBar({}) {
    return (
        <View style={globalStyles.searchBar}>
            <MaterialCommunityIcons name='magnify' size={26} />
            <TextInput 
                style={globalStyles.searchInput} 
                placeholder='What did you eat ?' />
        </View>
    );
}

export default function AddMeal({ title, goBack, setMeal }) {
    const [foods, setFoods] = useState([]);
    const [IDs, setIDs] = useState([]);

    const saveFoodsToLocal = async(list) => {
        try {
            const jsonValue = JSON.stringify(list);
            await AsyncStorage.setItem('foodsAPI', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const getFoodsLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('foodsAPI');
            if (value !== null) {
                const foodData = JSON.parse(value);
                foodData.map((food) => {
                    if (IDs.indexOf(food.ID) == -1) {
                        setFoods((old) => [{
                            id: food.ID,
                            name: food.Name,
                            calorie: food.Calories,
                            serving: food.Unit,
                            carb: food.Carb,
                            protein: food.Protein,
                            fat: food.Fat
                        }, ...old]);
                        setIDs(old => [food.ID, ...old]);
                    }
                })
                console.log("Food Data fetched from local successfully");
            }
            else {
                await getFoods();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getFoods = async() => {
        // CAll API
        const data = await fetchFoods();
        if (data != undefined) {
            data.map((food) => {
                if (IDs.indexOf(food.ID) == -1) {
                    setFoods((old) => [{
                        id: food.ID,
                        name: food.Name,
                        calorie: food.Calories,
                        serving: food.Unit,
                        carb: food.Carb,
                        protein: food.Protein,
                        fat: food.Fat
                    }, ...old]);
                    setIDs(old => [food.ID, ...old]);
                }
            })
            saveFoodsToLocal(data);
            console.log("Food list saved to local");
        }
    }

    useEffect(() => {
        getFoodsLocal();
    }, []);

    function AddMealItem({ serving = '100g', id, name, kcal, carb, protein, fat }) {
        const handleAdd = () => {
            setMeal(old => [{
                id: id,
                name: name,
                kcal: kcal,
                serving: serving,
                carb: carb,
                protein: protein,
                fat: fat
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

    return (
        <View style={{flex: 1, backgroundColor: globalColors.backgroundGray}}>
            <Header title={title} backFunc={goBack} />
            <View style={styles.mid}>
                <SearchBar />
            </View>
            <FlatList 
                data={foods}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <AddMealItem 
                        serving={item.serving}
                        id={item.id} 
                        name={item.name} 
                        kcal={item.calorie}
                        carb={item.carb}
                        protein={item.protein} 
                        fat={item.fat}
                        addFunc={setMeal}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    top: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mid: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
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