import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import LogoIcon from '../components/LogoIcon';
import { AuthService } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen({ navigation }: any) {
  const { setUser } = useAuth();
  const { colors, darkMode } = useTheme();
  const styles = createStyles(colors);
  const [name,            setName]            = useState('');
  const [userName,        setUserName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);

  const handleRegister = async () => {
    if (!name || !userName || !email || !password || !confirmPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos.'); return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem.'); return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.'); return;
    }
    setLoading(true);
    try {
      const user = await AuthService.getInstance().register(
        email.trim(), password, name.trim(), userName.trim(),
      );
      setUser(user);
      navigation.replace('MainTabs');
    } catch (e: any) {
      Alert.alert('Erro ao cadastrar', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.BG_PRIMARY} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <LogoIcon size={60} />
            <View style={styles.logoTextRow}>
              <Text style={styles.logoPlay}>Play</Text>
              <Text style={styles.logoScope}>scope</Text>
            </View>
            <Text style={styles.subtitle}>Crie sua conta e comece a organizar seus jogos.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput style={styles.input} placeholder="Digite seu nome" placeholderTextColor={colors.TEXT_MUTED} value={name} onChangeText={setName} selectionColor={colors.ACCENT} />

            <Text style={styles.label}>Nome de usuário</Text>
            <TextInput style={styles.input} placeholder="Escolha um nome de usuário" placeholderTextColor={colors.TEXT_MUTED} value={userName} onChangeText={setUserName} autoCapitalize="none" selectionColor={colors.ACCENT} />

            <Text style={styles.label}>E-mail</Text>
            <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor={colors.TEXT_MUTED} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" selectionColor={colors.ACCENT} />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.passwordInput} placeholder="Mínimo 6 caracteres" placeholderTextColor={colors.TEXT_MUTED} value={password} onChangeText={setPassword} secureTextEntry={!showPass} selectionColor={colors.ACCENT} />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text style={styles.showText}>{showPass ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirme sua senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.passwordInput} placeholder="Repita a senha" placeholderTextColor={colors.TEXT_MUTED} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirm} selectionColor={colors.ACCENT} />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text style={styles.showText}>{showConfirm ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.registerBtn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color={colors.BG_PRIMARY} /> : <Text style={styles.registerBtnText}>Cadastrar</Text>}
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

const createStyles = (colors: any) => StyleSheet.create({
  container:         { flex: 1, backgroundColor: colors.BG_PRIMARY },
  scroll:            { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 32 },
  logoArea:          { alignItems: 'center', marginBottom: 32 },
  logoTextRow:       { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  logoPlay:          { color: colors.TEXT_PRIMARY, fontSize: 32, fontWeight: '700' },
  logoScope:         { color: colors.ACCENT,        fontSize: 32, fontWeight: '700' },
  subtitle:          { color: colors.TEXT_SECONDARY, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  form:              { width: '100%' },
  label:             { color: colors.TEXT_PRIMARY, fontSize: 13, fontWeight: '600', marginBottom: 7, marginTop: 2 },
  input:             { backgroundColor: colors.BG_CARD, color: colors.TEXT_PRIMARY, height: 52, borderRadius: 14, paddingHorizontal: 18, marginBottom: 14, fontSize: 15, borderWidth: 1, borderColor: colors.BORDER },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_CARD, borderRadius: 14, paddingLeft: 18, paddingRight: 12, marginBottom: 14, borderWidth: 1, borderColor: colors.BORDER, height: 52 },
  passwordInput:     { flex: 1, color: colors.TEXT_PRIMARY, fontSize: 15 },
  showText:          { color: colors.ACCENT, fontSize: 13, fontWeight: '600' },
  registerBtn:       { backgroundColor: colors.ACCENT, height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 14, shadowColor: colors.ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  registerBtnText:   { color: colors.BG_PRIMARY, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  loginRow:          { flexDirection: 'row', justifyContent: 'center' },
  loginText:         { color: colors.TEXT_MUTED, fontSize: 14 },
  loginLink:         { color: colors.ACCENT, fontSize: 14, fontWeight: '700' },
});
