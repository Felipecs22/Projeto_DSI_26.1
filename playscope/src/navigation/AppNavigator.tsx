import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import LoginScreen     from '../screens/LoginScreen';
import RegisterScreen  from '../screens/RegisterScreen';
import HomeScreen      from '../screens/HomeScreen';
import MyGamesScreen   from '../screens/MyGamesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import FriendsScreen   from '../screens/FriendsScreen';
import ProfileScreen   from '../screens/ProfileScreen';
import NearbyScreen    from '../screens/NearbyScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

/* ─── Splash de carregamento ─────────────────────────────────────────────── */
function LoadingScreen() {
  const { colors } = useTheme();
  const styles = createLoadStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        <Text style={styles.logoPlay}>Play</Text>
        <Text style={styles.logoScope}>scope</Text>
      </Text>
      <ActivityIndicator color={colors.ACCENT} size="large" style={{ marginTop: 32 }} />
    </View>
  );
}

const createLoadStyles = (colors: any) => StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.BG_PRIMARY, justifyContent: 'center', alignItems: 'center' },
  logo:       { fontSize: 40 },
  logoPlay:   { color: colors.TEXT_PRIMARY, fontWeight: '700' },
  logoScope:  { color: colors.ACCENT,       fontWeight: '700' },
});

/* ─── Tab icon ───────────────────────────────────────────────────────────── */
function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  return (
    <View style={[tabStyles.wrapper, focused && tabStyles.wrapperActive]}>
      <Ionicons name={name as any} size={22} color={color} />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrapper:       { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  wrapperActive: { backgroundColor: 'rgba(0, 211, 148, 0.15)' },
});

/* ─── Bottom Tabs ────────────────────────────────────────────────────────── */
function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      id="main-tabs"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.BG_PRIMARY,
          borderTopColor:  colors.BORDER,
          borderTopWidth:  1,
          height:          68,
          paddingBottom:   10,
          paddingTop:      6,
        },
        tabBarActiveTintColor:   colors.ACCENT,
        tabBarInactiveTintColor: colors.TEXT_MUTED,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
        tabBarItemStyle: { flex: 1 },
      }}
    >
      <Tab.Screen name="Início"      component={HomeScreen}      options={{ tabBarIcon: ({ focused, color }) => <TabIcon name="home"           focused={focused} color={color} /> }} />
      <Tab.Screen name="Meus Jogos"  component={MyGamesScreen}   options={{ tabBarIcon: ({ focused, color }) => <TabIcon name="game-controller"  focused={focused} color={color} /> }} />
      <Tab.Screen name="Comunidade"  component={CommunityScreen} options={{ tabBarIcon: ({ focused, color }) => <TabIcon name="people"           focused={focused} color={color} /> }} />
      <Tab.Screen name="Mapa"        component={NearbyScreen}    options={{ tabBarIcon: ({ focused, color }) => <TabIcon name="map"              focused={focused} color={color} /> }} />
      <Tab.Screen name="Amigos"      component={FriendsScreen}   options={{ tabBarIcon: ({ focused, color }) => <TabIcon name="person-add"       focused={focused} color={color} /> }} />
      <Tab.Screen name="Perfil"      component={ProfileScreen}   options={{ tabBarIcon: ({ focused, color }) => <TabIcon name="person"           focused={focused} color={color} /> }} />
    </Tab.Navigator>
  );
}

/* ─── Root Navigator ─────────────────────────────────────────────────────── */
export default function AppNavigator() {
  const { user, loading } = useAuth();
  const { navigationTheme, ready } = useTheme();

  // Aguarda Firebase verificar o estado de autenticação
  if (loading || !ready) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator id="loading-stack" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        id="root-stack"
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