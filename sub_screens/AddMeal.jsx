import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { fetchFoods } from '../utils/fetchFoods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Import styles
import { globalColors, globalStyles } from '../global/styles';


export default function AddMeal({ title, closeModal, meal, setMeal, modified }) {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [adding, setAdding] = useState(false);

    const [temp, setTemp] = useState(meal);

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
                setFoods(foodData);
                setFilteredFoods(foodData);
                //console.log("Food Data fetched from local successfully");
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
            setFoods(data);
            setFilteredFoods(data);
            saveFoodsToLocal(data);
            console.log("Food list saved to local");
        }
    }

    const handleGoBack = () => {
        setMeal(temp);
        closeModal();
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getFoods();
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }, []);

    useEffect(() => {
        getFoodsLocal();
    }, []);

    function Header({ title }) {
        return (
            <View style={globalStyles.header}>
                <View style={styles.top}>
                    <TouchableOpacity style={globalStyles.backButton} onPress={handleGoBack}>
                        <MaterialCommunityIcons name='chevron-left' size={30} />
                    </TouchableOpacity>
                    <Text style={[globalStyles.headerTitle, {marginLeft: 30}]}>Add food to your {title}</Text>
                </View>
            </View>
        )
    }


    function SearchBar({}) {
        const [search, setSearch] = useState('');

        const handleSearch = () => {
            const formattedQuery = search.toLowerCase();
            if (search.length > 0) {
                const filtered = foods.filter((item) => item.name.toLowerCase().includes(formattedQuery));
                setFilteredFoods(filtered);
            }
            else {
                setFilteredFoods(foods);
            }
        }

        return (
            <View style={globalStyles.searchBar}>
                <MaterialCommunityIcons name='magnify' size={26} />
                <TextInput 
                    style={globalStyles.searchInput} 
                    placeholder='What did you eat ?'
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

    function AddMealItem({ id, name, kcal, carb, protein, fat, serving, unit }) {
        const handleAdd = () => {
            modified();
            setAdding(true);
            const newFood = {
                id: id,
                name: name,
                kcal: kcal,
                serving: serving,
                unit: unit,
                carb: carb,
                protein: protein,
                fat: fat
            }
            let index = temp.findIndex(item => item.id === newFood.id);
            if (index == -1) {
                setTemp(old => [newFood, ...old]);
            }
            else {
                const oldItem = temp[index];
                const newTemp = temp.filter((item) => item.id != newFood.id);
                newFood.serving += oldItem.serving;
                newFood.kcal += oldItem.kcal;
                newFood.carb += oldItem.carb;
                newFood.fat += oldItem.fat;
                newFood.protein += oldItem.protein;
                setTemp([newFood, ...newTemp]);
            }
            setTimeout(() => {
                setAdding(false);
            }, 1000);

            Toast.show({
                type: 'success',
                text1: 'Food was added successfully to your diary',
            });
        }
    
        return (
            <View style={itemStyles.container}>
                <TouchableOpacity style={itemStyles.infoWrapper}>
                    <Text style={itemStyles.foodName}>{name[0].toUpperCase() + name.slice(1)}</Text>
                    <Text style={itemStyles.foodKcal}>{serving} {unit} - {kcal} kcal</Text>
                </TouchableOpacity>
                {
                    adding ? (
                        <ActivityIndicator size="large" color={globalColors.darkerCyan} />
                    ) : (
                        <TouchableOpacity style={globalStyles.addButton} onPress={handleAdd}>
                            <AntDesign name='plus' size={28} color='#fff' />
                        </TouchableOpacity>
                    )
                }
            </View>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: globalColors.backgroundGray}}>
            <Header title={title}/>
            <View style={styles.mid}>
                <SearchBar />
            </View>
            <FlatList 
                data={filteredFoods}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <AddMealItem 
                        id={item.id} 
                        name={item.name} 
                        kcal={item.calorie}
                        carb={item.carb}
                        protein={item.protein} 
                        fat={item.fat}
                        serving={item.serving}
                        unit={item.unit}
                        addFunc={setMeal}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            <Toast />
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