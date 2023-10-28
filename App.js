import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { auth } from './utils/firebase';

// For loading fonts
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import RegisterStack from './RegisterStack';
import Navigation from './Navigation';


const Stack = createNativeStackNavigator();


export default function App() {
  const user = auth.currentUser;

  const [fontsLoaded] = useFonts({
    'inter-regular': require('./assets/fonts/Inter-Regular.ttf'),
    'inter-medium': require('./assets/fonts/Inter-Medium.ttf'),
    'inter-semibold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'inter-bold': require('./assets/fonts/Inter-Bold.ttf'),
  });


  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded)
    return null;
  else SplashScreen.hideAsync();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} 
        initialRouteName={user !== null ? 'MainNavigation' : 'RegisterStack'}>
            <Stack.Screen 
                name="RegisterStack" 
                component={RegisterStack}
            />
            <Stack.Screen 
                name="MainNavigation" 
                component={Navigation}
            />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
