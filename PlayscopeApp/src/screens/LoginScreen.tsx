import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform
} from 'react-native';

// Tipagem nativa para receber a prop de navegação
export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Substitui a tela de Login pelo sistema de abas (MainTabs)
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.logoArea}>
          <Text style={styles.logoIcon}>🎮</Text>
          <Text style={styles.logoText}>
            Play<Text style={styles.logoTextHighlight}>scope</Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o seu E-Mail"
            placeholderTextColor="#8A99A8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite a sua senha"
            placeholderTextColor="#8A99A8"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não possui uma conta? </Text>
            <TouchableOpacity>
              <Text style={styles.registerTextHighlight}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  keyboardContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoArea: { alignItems: 'center', marginBottom: 48 },
  logoIcon: { fontSize: 64, marginBottom: 16 },
  logoText: { fontSize: 36, color: '#FFFFFF', fontWeight: 'bold' },
  logoTextHighlight: { color: '#00D394' },
  formContainer: { width: '100%' },
  input: {
    backgroundColor: '#161C24', color: '#FFFFFF', height: 56, borderRadius: 12,
    paddingHorizontal: 16, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#3A4A5A',
  },
  forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 32 },
  forgotPasswordText: { color: '#8A99A8', fontSize: 14 },
  loginButton: {
    backgroundColor: '#00D394', height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  loginButtonText: { color: '#0A0E17', fontSize: 18, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: '#8A99A8', fontSize: 14 },
  registerTextHighlight: { color: '#00D394', fontSize: 14, fontWeight: 'bold' },
});