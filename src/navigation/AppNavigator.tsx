import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import LoginScreen    from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen     from '../screens/HomeScreen';
import MyGamesScreen  from '../screens/MyGamesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import FriendsScreen  from '../screens/FriendsScreen';
import NewsScreen     from '../screens/NewsScreen';
import ProfileScreen  from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

/* ─── Tab icon component ───────────────────────────────────────────────────── */
function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[tabIconStyles.wrapper, focused && tabIconStyles.wrapperActive]}>
      <Text style={tabIconStyles.emoji}>{emoji}</Text>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  wrapperActive: {
    backgroundColor: 'rgba(0, 211, 148, 0.15)',
  },
  emoji: {
    fontSize: 20,
  },
});

/* ─── Bottom Tab Navigator ─────────────────────────────────────────────────── */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0E17',
          borderTopColor:  '#1C2633',
          borderTopWidth:  1,
          height:          68,
          paddingBottom:   10,
          paddingTop:      6,
        },
        tabBarActiveTintColor:   '#00D394',
        tabBarInactiveTintColor: '#4A5878',
        tabBarLabelStyle: {
          fontSize:   10,
          fontWeight: '600',
          marginTop:  2,
        },
      }}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Meus Jogos"
        component={MyGamesScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎮" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Comunidade"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Amigos"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🤝" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Novidades"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📰" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

/* ─── Root Stack Navigator ─────────────────────────────────────────────────── */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Login"     component={LoginScreen}    />
        <Stack.Screen name="Register"  component={RegisterScreen} />
        <Stack.Screen name="MainTabs"  component={MainTabs}       />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
