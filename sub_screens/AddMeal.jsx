import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { fetchFoods } from '../utils/fetchFoods';

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


export default function AddMeal({ title, goBack }) {
    const [foods, setFoods] = useState([]);
    const [IDs, setIDs] = useState([]);
    const [meal, setMeal] = useState([]);

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