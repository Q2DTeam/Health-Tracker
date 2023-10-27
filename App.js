import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './Navigation';

// For loading fonts
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import RegisterStack from './RegisterStack';

export default function App() {
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
    <RegisterStack />
  );
}
