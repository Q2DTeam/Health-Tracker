import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import Screens
import HomeNavigation from './HomeNavigation';
import MyMeals from './screens/MyMeals';
import Me from './screens/Me';
import { globalColors, globalStyles } from './global/styles';


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
            return <MaterialCommunityIcons name={iconName} size={26} color={ focused ? '#0099FF' : '#9DA8C3'} />
          },
          tabBarLabelStyle: {fontSize: 12},
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
        backgroundColor: globalColors.backgroundGray,
        borderTopWidth: 0,
        borderTopColor: "transparent",
        elevation: 0,
        shadowColor : '#5bc4ff',
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
    }
});
