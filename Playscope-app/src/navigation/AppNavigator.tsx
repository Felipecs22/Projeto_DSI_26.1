import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholders para as abas que ainda não criamos
const Placeholder = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E17' }}>
    <Text style={{ color: '#fff', fontSize: 18 }}>{name}</Text>
  </View>
);

// 1. Criamos o conjunto de Abas Inferiores
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00D394',
        tabBarInactiveTintColor: '#8A99A8',
        tabBarStyle: { 
          backgroundColor: '#161C24', 
          borderTopColor: '#3A4A5A', 
          height: 60, 
          paddingBottom: 8 
        },
      }}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Meus Jogos" component={() => <Placeholder name="Backlog: Meus Jogos" />} />
      <Tab.Screen name="Comunidade" component={() => <Placeholder name="Comunidade" />} />
      <Tab.Screen name="Amigos" component={() => <Placeholder name="Lista de Amigos" />} />
      <Tab.Screen name="Novidades" component={() => <Placeholder name="Feed de Novidades" />} />
    </Tab.Navigator>
  );
};

// 2. Criamos a Pilha (Stack) que controla Login -> Abas
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* A primeira tela da pilha é o Login */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* A segunda tela é o sistema de abas */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;