import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { MaterialCommunityIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { fetchFoods } from '../utils/fetchFoods';
import { auth } from '../utils/firebase';
import { db, doc, getDoc } from '../utils/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import PieChart from 'react-native-pie-chart';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { StatusBar } from 'expo-status-bar';


export default function AddMeal({ title, closeModal, meal, setMeal, modified }) {
    const user = auth.currentUser;
    const [foods, setFoods] = useState();
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [changed, setChanged] = useState(false);
    
    const [foodFetched, setFoodFetched] = useState(false);

    const [temp, setTemp] = useState(meal);

    const saveFoodsToLocal = async(list) => {
        try {
            const jsonValue = JSON.stringify(list);
            await AsyncStorage.setItem('foodsAPI', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const getCustomFoodsDb = async() => {
        let docRef, docSnap;
        try {
            docRef = doc(db, "custom_foods", user.uid);
            docSnap = await getDoc(docRef);
        }
        catch (error) {
            console.log("Error getting custom food from db: ", error);
        }

        if (docSnap) {
            let custom_foods = docSnap.data();
            if (custom_foods !== undefined && custom_foods !== null) {
                let newList = [...custom_foods.foods, ...foods];
                setFoods(newList);
                setFilteredFoods(newList);
    
                saveFoodToLocal(custom_foods.foods);
            }
        } 
        else {
            console.log("No such document!");
        }
    }

    const getCustomFoodsLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('custom_foods');
            if (value !== null && value !== undefined) {
                const custom_foods = JSON.parse(value);
                if (custom_foods.userID == user.uid) {
                    let newList = [...custom_foods.foods, ...foods];
                    setFoods(newList);
                    setFilteredFoods(newList);
                }
                else {
                    getCustomFoodsDb();
                }
            }
        } catch (error) {
            console.log("Error fetching custom food from local: ", error);
            getCustomFoodsDb();
        }
    }

    const getFoodsLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('foodsAPI');
            if (value !== null) {
                const foodData = JSON.parse(value);
                setFoods(foodData);
                setFilteredFoods(foodData);
                // Begin fetching custom foods
                setFoodFetched(true);
            }
            else {
                await getFoods();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getFoods = async() => {
        // Call API
        const data = await fetchFoods();
        if (data != undefined) {
            setFoods(data);
            setFilteredFoods(data);
            // Begin fetching custom foods
            setFoodFetched(true);
            // Save API foods to local
            saveFoodsToLocal(data);
        }
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

    useEffect(() => {
        if (foods !== undefined) {
            getCustomFoodsLocal();
        }
    }, [foodFetched]);

    function Header({ title }) {
        const handleGoBack = () => {
            setMeal(temp);
            closeModal();
            if (changed) {
                modified();
            }
        }

        return (
            <View style={globalStyles.header}>
                <View style={styles.top}>
                    <TouchableOpacity style={globalStyles.backButton} onPress={handleGoBack}>
                        <MaterialCommunityIcons name='chevron-left' size={40} color='#fff' />
                    </TouchableOpacity>
                    <Text style={globalStyles.headerTitle}>Add food to your {title}</Text>
                    <View style={{width: 30}} />
                </View>
            </View>
        )
    }

    function SearchBar() {
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
        const [adding, setAdding] = useState(false);
        const [customModal, setCustomModal] = useState(false);

        const handleAdd = () => {
            setAdding(true);
            
            setTimeout(() => {
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
                    newFood.serving += Math.round(oldItem.serving);
                    newFood.kcal += oldItem.kcal;
                    newFood.carb += oldItem.carb;
                    newFood.fat += oldItem.fat;
                    newFood.protein += oldItem.protein;
                    setTemp([newFood, ...newTemp]);
                }
                setAdding(false);
                Toast.show({
                    type: 'success',
                    text1: 'Food was added successfully to your diary',
                });
                setChanged(true);
            }, 100);
        }

        function AddMealCustom() {
            const sliceColors = [globalColors.vibrantBlue, globalColors.lunchOrange, globalColors.snackPurple, globalColors.chillGreen];
            const [customServ, setCustomServ] = useState(serving);
            const [customKcal, setCustomKcal] = useState(kcal);
            const [customCarb, setCustomCarb] = useState(carb);
            const [customPro, setCustomPro] = useState(protein);
            const [customFat, setCustomFat] = useState(fat);

            const [customAdding, setCustomAdding] = useState(false);
    
            const getRatio = () => {
                let carbEnergy = Math.round(customCarb * 400 / customKcal);
                let proEnergy = Math.round(customPro * 400 / customKcal);
                let fatEnergy = Math.round(customPro * 900 / customKcal);
                let others = 100 - (carbEnergy + proEnergy + fatEnergy);

                if (others < 0) 
                    others = 0;
                return [carbEnergy, proEnergy, fatEnergy, others];
            }

            let nutritions = getRatio();
    
            const handleChange = (v) => {
                let val = Number(v);
                if (val <= 0 || val == undefined || val == null) {
                    setCustomServ(0);
                }
                else {
                    let ratio = val / serving;
                    setCustomServ(val);
                    setCustomKcal(Math.round(kcal * ratio));
                    setCustomCarb(Math.round(carb * ratio));
                    setCustomPro(Math.round(protein * ratio));
                    setCustomFat(Math.round(fat * ratio));
                }
            }

            const handleAddCustom = () => {
                setCustomAdding(true);
                
                setTimeout(() => {
                    const newFood = {
                        id: id,
                        name: name,
                        kcal: customKcal,
                        serving: customServ,
                        unit: unit,
                        carb: customCarb,
                        protein: customPro,
                        fat: customFat
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
                    setCustomAdding(false);
                    setCustomModal(false);
                    Toast.show({
                        type: 'success',
                        text1: 'Food was added successfully to your diary',
                    });
                    setChanged(true);
                }, 1000);
            }
    
            
            return (
                <View style={customCard.container}>
                    <View style={customCard.header}>
                        <TouchableOpacity onPress={() => {setCustomModal(false)}}>
                            <MaterialCommunityIcons name='close' color='#fff' size={24}/>
                        </TouchableOpacity>
                        <Text style={customCard.title}>{name}</Text>
                        <View style={{width: 30}} />
                    </View>
                    <View style={customCard.mid}>
                        <TextInput style={customCard.input}
                            keyboardType='numeric'
                            value={customServ.toString()}
                            onChangeText={(val) => {
                                handleChange(val);
                            }}
                        />
                        <Text style={customCard.servingLabel}>{unit}</Text>
                    </View>
                    <View style={styles.wheelContainer}>
                        <PieChart 
                            widthAndHeight={150} 
                            series={nutritions} 
                            sliceColor={sliceColors}
                            coverRadius={0.001} 
                        />
                        <View style={styles.details}>
                            <Text style={styles.kcalTitle}>{customKcal} kcal</Text>
                            <View style={styles.infoItem}>
                                <FontAwesome name='circle' color={globalColors.vibrantBlue} size={18} />
                                <Text style={styles.infoName}>Carbs: {customCarb} g</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <FontAwesome name='circle' color={globalColors.lunchOrange} size={18} />
                                <Text style={styles.infoName}>Protein: {customPro} g</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <FontAwesome name='circle' color={globalColors.snackPurple} size={18} />
                                <Text style={styles.infoName}>Fats: {customFat} g</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <FontAwesome name='circle' color={globalColors.chillGreen} size={18} />
                                <Text style={styles.infoName}>Micronutrients</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        {
                            customAdding ? (
                                <View style={styles.addBtn}>
                                   <ActivityIndicator size='small' color='#fff'/> 
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.addBtn} onPress={handleAddCustom}>
                                    <Text style={{fontSize: 16, color:'#fff'}}>Add</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            )
        }

        function CustomModal() {
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={customModal}
                >
                    <View
                     style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 25,
                        margin: 10,
                    }}>
                        <AddMealCustom />
                    </View>
                </Modal>
            )
        }

        return (
            <View style={itemStyles.container}>
                <CustomModal />
                <TouchableOpacity style={itemStyles.infoWrapper} onPress={() => {setCustomModal(true)}}>
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
        <View style={globalStyles.container}>
            <StatusBar style='light' />
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
        paddingTop: Platform.OS === 'android' ? 0 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mid: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    wheelContainer: {
        width: '100%',
        height: 180,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    details: {
        justifyContent: 'space-around',
        height: 180,
        padding: 10,
    },
    infoItem: {
        minWidth: 100,
        flexDirection: 'row',
    },
    infoName: {
        marginLeft: 10,
        fontSize: 16,
    },
    kcalTitle: {
        fontFamily: 'inter-semibold',
        fontSize: 18,
        textAlign: 'center',
        color: globalColors.calmRed
    },
    addBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: globalColors.darkerCyan,
        marginTop: 20, 
        marginBottom: 10, 
        width: 100,
        padding: 10,
    },
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

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

const customCard = StyleSheet.create({
    container: {
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        height: 380,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    header: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: globalColors.darkerCyan
    },
    title: {
        fontFamily: 'inter-semibold',
        fontSize: 18,
        color: '#fff'
    },  
    mid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        fontFamily: 'inter-regular',
        fontSize: 16,
        backgroundColor: globalColors.backgroundGray,
        width: 100,
        borderRadius: 25,
        marginRight: 15,
        padding: 5,
        paddingHorizontal: 15,
    },
    servingLabel: {
        fontSize: 18,
    },
});