import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import Colors from '../constants/colors';
import LogoIcon from '../components/LogoIcon';

export default function RegisterScreen({ navigation }: any) {
  const [name,            setName]            = useState('');
  const [userName,        setUserName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);

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
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <LogoIcon size={60} />
            <View style={styles.logoTextRow}>
              <Text style={styles.logoPlay}>Play</Text>
              <Text style={styles.logoScope}>scope</Text>
            </View>
            <Text style={styles.subtitle}>
              Crie sua conta e comece a organizar seus jogos.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={name}
              onChangeText={setName}
              selectionColor={Colors.ACCENT}
            />

            <Text style={styles.label}>Nome de usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Escolha um nome de usuário"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              selectionColor={Colors.ACCENT}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              selectionColor={Colors.ACCENT}
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha"
                placeholderTextColor={Colors.TEXT_MUTED}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                selectionColor={Colors.ACCENT}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text style={styles.showText}>{showPass ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirme sua senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha novamente"
                placeholderTextColor={Colors.TEXT_MUTED}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                selectionColor={Colors.ACCENT}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text style={styles.showText}>{showConfirm ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={styles.registerBtnText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Já possui uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.BG_PRIMARY },
  scroll:            { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 32 },
  logoArea:          { alignItems: 'center', marginBottom: 32 },
  logoTextRow:       { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  logoPlay:          { color: Colors.TEXT_PRIMARY, fontSize: 32, fontWeight: '700' },
  logoScope:         { color: Colors.ACCENT,        fontSize: 32, fontWeight: '700' },
  subtitle:          { color: Colors.TEXT_SECONDARY, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  form:              { width: '100%' },
  label:             { color: Colors.TEXT_PRIMARY, fontSize: 13, fontWeight: '600', marginBottom: 7, marginTop: 2 },
  input:             { backgroundColor: Colors.BG_CARD, color: Colors.TEXT_PRIMARY, height: 52, borderRadius: 14, paddingHorizontal: 18, marginBottom: 14, fontSize: 15, borderWidth: 1, borderColor: Colors.BORDER },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.BG_CARD, borderRadius: 14, paddingLeft: 18, paddingRight: 12, marginBottom: 14, borderWidth: 1, borderColor: Colors.BORDER, height: 52 },
  passwordInput:     { flex: 1, color: Colors.TEXT_PRIMARY, fontSize: 15 },
  showText:          { color: Colors.ACCENT, fontSize: 13, fontWeight: '600' },
  registerBtn:       { backgroundColor: Colors.ACCENT, height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 24, shadowColor: Colors.ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  registerBtnText:   { color: Colors.BG_PRIMARY, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  loginRow:          { flexDirection: 'row', justifyContent: 'center' },
  loginText:         { color: Colors.TEXT_MUTED, fontSize: 14 },
  loginLink:         { color: Colors.ACCENT, fontSize: 14, fontWeight: '700' },
});
