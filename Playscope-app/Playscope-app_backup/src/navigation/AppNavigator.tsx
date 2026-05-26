import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import Colors from '../constants/colors';

import LoginScreen     from '../screens/LoginScreen';
import RegisterScreen  from '../screens/RegisterScreen';
import HomeScreen      from '../screens/HomeScreen';
import MyGamesScreen   from '../screens/MyGamesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import FriendsScreen   from '../screens/FriendsScreen';
import NewsScreen      from '../screens/NewsScreen';
import ProfileScreen   from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

/* ─── Splash de carregamento ─────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <View style={loadStyles.container}>
      <Text style={loadStyles.logo}>
        <Text style={loadStyles.logoPlay}>Play</Text>
        <Text style={loadStyles.logoScope}>scope</Text>
      </Text>
      <ActivityIndicator color={Colors.ACCENT} size="large" style={{ marginTop: 32 }} />
    </View>
  );
}

const loadStyles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.BG_PRIMARY, justifyContent: 'center', alignItems: 'center' },
  logo:       { fontSize: 40 },
  logoPlay:   { color: Colors.TEXT_PRIMARY, fontWeight: '700' },
  logoScope:  { color: Colors.ACCENT,       fontWeight: '700' },
});

/* ─── Tab icon ───────────────────────────────────────────────────────────── */
function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[tabStyles.wrapper, focused && tabStyles.wrapperActive]}>
      <Text style={tabStyles.emoji}>{emoji}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrapper:       { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  wrapperActive: { backgroundColor: 'rgba(0, 211, 148, 0.15)' },
  emoji:         { fontSize: 20 },
});

/* ─── Bottom Tabs ────────────────────────────────────────────────────────── */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.BG_PRIMARY,
          borderTopColor:  Colors.BORDER,
          borderTopWidth:  1,
          height:          68,
          paddingBottom:   10,
          paddingTop:      6,
        },
        tabBarActiveTintColor:   Colors.ACCENT,
        tabBarInactiveTintColor: Colors.TEXT_MUTED,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen name="Início"      component={HomeScreen}      options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Meus Jogos"  component={MyGamesScreen}   options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎮" focused={focused} /> }} />
      <Tab.Screen name="Comunidade"  component={CommunityScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} /> }} />
      <Tab.Screen name="Amigos"      component={FriendsScreen}   options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🤝" focused={focused} /> }} />
      <Tab.Screen name="Novidades"   component={NewsScreen}      options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📰" focused={focused} /> }} />
      <Tab.Screen name="Perfil"      component={ProfileScreen}   options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

/* ─── Root Navigator ─────────────────────────────────────────────────────── */
export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Aguarda Firebase verificar o estado de autenticação
  if (loading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // Se já autenticado, abre direto nas tabs; senão, vai para Login
        initialRouteName={user ? 'MainTabs' : 'Login'}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Login"     component={LoginScreen}    />
        <Stack.Screen name="Register"  component={RegisterScreen} />
        <Stack.Screen name="MainTabs"  component={MainTabs}       />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
