import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native'
import Contacts from '../screens/Contacts';
import Home from '../screens/Home';
const HomeStack = () => {
    const Tab = createNativeStackNavigator();
  return (
    <NavigationContainer>
    <Tab.Navigator>
        <Tab.Screen
            name='Lista de contactos'
            component={Home}
        >
        </Tab.Screen>
        <Tab.Screen
            name='Contacts'
            component={Contacts}
            options={{
                // headerTransparent: true, // Establecer la barra transparente
                headerTitle: 'Agregar contactos', // Ocultar el título en la barra
              }}
        ></Tab.Screen>
    </Tab.Navigator>
    </NavigationContainer>
  )
}

export default HomeStack