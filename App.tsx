import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import PassportScanScreen from './src/screens/PassportScanScreen';
import ResultScreen from './src/screens/ResultScreen';
import SelfieScreen from './src/screens/SelfieScreen';

export type RootStackParamList = {
  Home: undefined;
  PassportScan: undefined;
  Selfie: { passportPhotoUri: string };
  Result: { 
    passportPhotoUri: string;
    selfieUri: string;
    matchConfidence: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // @ts-ignore - NavigationContainer types are not properly exported
    <NavigationContainer>
      <StatusBar style="auto" />
      {/* @ts-ignore - React Navigation types are not properly exported */}
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {() => (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'SmartGate' }}
            />
            <Stack.Screen 
              name="PassportScan" 
              component={PassportScanScreen} 
              options={{ title: 'Scan Passport' }}
            />
            <Stack.Screen 
              name="Selfie" 
              component={SelfieScreen} 
              options={{ title: 'Take Selfie' }}
            />
            <Stack.Screen 
              name="Result" 
              component={ResultScreen} 
              options={{ title: 'Verification Result' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 