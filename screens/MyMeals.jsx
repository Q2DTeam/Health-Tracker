import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, TextInput, FlatList, RefreshControl } from 'react-native';
import { auth } from '../utils/firebase';
import { db, doc, getDoc, setDoc } from '../utils/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import styles
import { globalColors, globalStyles } from '../global/styles';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import CreateFood from '../sub_screens/CreateFood';


export default function MyMeals() {
    const [user, setUser] = useState(auth.currentUser);
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState(foods);
    const [foodModal, setFoodModal] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const getFoodsDb = async() => {
        let docRef, docSnap;
        try {
            docRef = doc(db, "custom_foods", user.uid);
            docSnap = await getDoc(docRef);
        }
        catch (error) {
            Alert.alert('Oops, we cannot retrieve your data', 'Due inconsistent internet connection, we cannot fetch the data you need. Please refresh the screen to try again.');
        }

        if (docSnap) {
            let custom_foods = docSnap.data();
            setFoods(custom_foods.foods);
            setFilteredFoods(custom_foods.foods);
            saveFoodToLocal(custom_foods.foods);
        } 
        else {
            console.log("No such document!");
        }
    }

    const getFoodsLocal = async() => {
        try {
            const value = await AsyncStorage.getItem('custom_foods');
            if (value !== null) {
                const custom_foods = JSON.parse(value);
                if (custom_foods.userID == user.uid) {
                    setFoods(custom_foods.foods);
                    setFilteredFoods(custom_foods.foods);
                }
                else {
                    getFoodsDb();
                }
            }
        } catch (error) {
            console.log("Error fetching custom food from local: ", error);
            getFoodsDb();
        }
    }

    const saveFoodToLocal = async(newFoods) => {
        const custom_food = {
            userID: user.uid,
            foods: newFoods
        }
        try {
            const jsonValue = JSON.stringify(custom_food);
            await AsyncStorage.setItem('custom_foods', jsonValue);
        } catch (error) {
            console.log(error);
        }
    }

    const saveFoodToDb = async(newFoods) => {
        const custom_food = {
            userID: user.uid,
            foods: newFoods
        }
        const docID = user.uid;
        try {
            await setDoc(doc(db, "custom_foods", docID), custom_food, { merge: true });
        }
        catch(err) {
            console.log("Error saving custom food to firestore: ", err);
        }
    }


    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((val) => {setUser(val)});
        return subscriber;
    }, []);

    useEffect(() => {
        if (user !== undefined && user !== null) {
            getFoodsLocal();
        }
    }, [user]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getFoodsDb();
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
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
            if (search.length > 0) {
                const filtered = foods.filter((item) => item.name.toLowerCase().includes(formattedQuery));
                setFilteredFoods(filtered);
            }
            else {
                setFilteredFoods(foods);
            }
        }

        return (
            <View style={[globalStyles.searchBar, {marginRight: 10, backgroundColor: '#fff', borderRadius: 25, borderBottomWidth: 0, paddingHorizontal: 10, flex: 1}]}>
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

    function FoodItem({ id, name, kcal, serving, unit }) {
        const handleDelete = () => {
            Alert.alert('Confirm delete', 'Do you want to delete this food?', [
                {
                    text: 'Yes',
                    onPress: () => {
                        const newFoods = foods.filter((item) => item.id != id);
                        setFoods(newFoods);
                        setFilteredFoods(newFoods);
                        saveFoodToDb(newFoods);
                        saveFoodToLocal(newFoods);
                    },
                },
                {
                    text: 'Cancel',
                },
            ]);
        }

        return (
            <View style={itemStyles.container}>
                <TouchableOpacity style={itemStyles.infoWrapper}>
                    <Text style={itemStyles.foodName}>{name[0].toUpperCase() + name.slice(1)}</Text>
                    <Text style={itemStyles.foodKcal}>{serving} {unit} - {kcal} kcal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.addButton} onPress={handleDelete}>
                    <AntDesign name='delete' size={20} color='#fff' />
                </TouchableOpacity>
            </View>
        )
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
                    foods={foods}
                    setFoods={setFoods}
                />
            </View>
        </Modal>
        )
    }

    return (
        <View style={globalStyles.container}>
            <StatusBar style='light' />
            <CreateFoodModal />
            <View style={{alignItems: 'center', flex: 1}}>
                <Header />
                <FlatList 
                    style={{flex: 1, width: '100%'}}
                    data={filteredFoods}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <FoodItem
                            id={item.id} 
                            name={item.name} 
                            kcal={item.calorie}
                            carb={item.carb}
                            protein={item.protein} 
                            fat={item.fat}
                            serving={item.serving}
                            unit={item.unit}
                        />
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'inter-bold',
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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