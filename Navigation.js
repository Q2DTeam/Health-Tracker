import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import Screens
import HomeNavigation from './HomeNavigation';
import MyMeals from './screens/MyMeals';
import Me from './screens/Me';


const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
      <Tab.Navigator 
        initialRouteName='Home'
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
        <Tab.Screen name="Home" component={HomeNavigation}/>
        <Tab.Screen name="My meals" component={MyMeals} />
        <Tab.Screen name="Me" component={Me} />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        overflow: "hidden",
    }
});
