import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    if (!name || !userName || !email || !password || !confirmPassword) {
      alert('Preencha todos os campos para continuar.');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.logoIcon}>🎮</Text>

            <Text style={styles.logoText}>
              Play<Text style={styles.logoTextHighlight}> scope</Text>
            </Text>

            <Text style={styles.subtitle}>
              Crie sua conta e comece a organizar seus jogos.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#6F7A86"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Nome de usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Escolha um nome de usuário"
              placeholderTextColor="#6F7A86"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#6F7A86"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha"
                placeholderTextColor="#6F7A86"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirme sua senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha novamente"
                placeholderTextColor="#6F7A86"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />

              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.showPasswordText}>
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já possui uma conta? </Text>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginTextHighlight}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logoIcon: {
    fontSize: 56,
    marginBottom: 12,
  },

  logoText: {
    fontSize: 34,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  logoTextHighlight: {
    color: '#00D394',
  },

  subtitle: {
    color: '#8A99A8',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },

  formContainer: {
    width: '100%',
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#161C24',
    color: '#FFFFFF',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A4A5A',
  },

  passwordContainer: {
    backgroundColor: '#161C24',
    height: 56,
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A4A5A',
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },

  showPasswordButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  showPasswordText: {
    color: '#00D394',
    fontSize: 13,
    fontWeight: 'bold',
  },

  registerButton: {
    backgroundColor: '#00D394',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  registerButtonText: {
    color: '#0A0E17',
    fontSize: 18,
    fontWeight: 'bold',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  loginText: {
    color: '#8A99A8',
    fontSize: 14,
  },

  loginTextHighlight: {
    color: '#00D394',
    fontSize: 14,
    fontWeight: 'bold',
  },
});