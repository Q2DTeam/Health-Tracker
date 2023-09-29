import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Import Screens
import Home from './screens/Home';
import MyMeals from './screens/MyMeals';
import Me from './screens/Me';


const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Home'
        screenOptions={({ route, navigation }) => ({
          tabBarIcon: ({ color, focused, size }) => {
            let iconName;
            if (route.name === 'Home') {
                iconName = 'home';
            }
            else if (route.name === 'My meals') {
                iconName = 'food';
            }
            else iconName = 'account'
            return <MaterialCommunityIcons name={iconName} size={24} color={ focused ? '#0099FF' : '#9DA8C3'} />
          },
          tabBarStyle: styles.tabBar,
          
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={Home}/>
        <Tab.Screen name="My meals" component={MyMeals} />
        <Tab.Screen name="Me" component={Me} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
    }
});
