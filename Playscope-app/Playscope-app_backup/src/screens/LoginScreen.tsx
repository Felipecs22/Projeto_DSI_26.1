import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from 'react-native';
import LogoIcon from '../components/LogoIcon';
import { AuthService } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation }: any) {
  const { setUser }  = useAuth();
  const { colors, darkMode } = useTheme();
  const styles = createStyles(colors);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const user = await AuthService.getInstance().login(email.trim(), password);
      setUser(user);
      navigation.replace('MainTabs');
    } catch (e: any) {
      Alert.alert('Erro ao entrar', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.BG_PRIMARY} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <View style={styles.logoArea}>
            <LogoIcon size={68} />
            <View style={styles.logoTextRow}>
              <Text style={styles.logoPlay}>Play</Text>
              <Text style={styles.logoScope}>scope</Text>
            </View>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Digite o seu E-Mail"
              placeholderTextColor={colors.TEXT_MUTED}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              selectionColor={colors.ACCENT}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite a sua senha"
                placeholderTextColor={colors.TEXT_MUTED}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                selectionColor={colors.ACCENT}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text style={styles.showText}>{showPass ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={colors.BG_PRIMARY} />
                : <Text style={styles.loginBtnText}>Login</Text>
              }
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Não possui uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container:         { flex: 1, backgroundColor: colors.BG_PRIMARY },
  inner:             { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logoArea:          { alignItems: 'center', marginBottom: 48 },
  logoTextRow:       { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  logoPlay:          { color: colors.TEXT_PRIMARY, fontSize: 36, fontWeight: '700', letterSpacing: 0.5 },
  logoScope:         { color: colors.ACCENT,        fontSize: 36, fontWeight: '700', letterSpacing: 0.5 },
  form:              { width: '100%' },
  input:             { backgroundColor: colors.BG_CARD, color: colors.TEXT_PRIMARY, height: 54, borderRadius: 14, paddingHorizontal: 18, marginBottom: 14, fontSize: 15, borderWidth: 1, borderColor: colors.BORDER },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.BG_CARD, borderRadius: 14, paddingLeft: 18, paddingRight: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.BORDER, height: 54 },
  passwordInput:     { flex: 1, color: colors.TEXT_PRIMARY, fontSize: 15 },
  showText:          { color: colors.ACCENT, fontSize: 13, fontWeight: '600' },
  forgotBtn:         { alignSelf: 'flex-start', marginBottom: 28 },
  forgotText:        { color: colors.ACCENT, fontSize: 13 },
  loginBtn:          { backgroundColor: colors.ACCENT, height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 14, shadowColor: colors.ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  loginBtnText:      { color: colors.BG_PRIMARY, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  registerRow:       { flexDirection: 'row', justifyContent: 'center' },
  registerText:      { color: colors.TEXT_MUTED, fontSize: 14 },
  registerLink:      { color: colors.ACCENT, fontSize: 14, fontWeight: '700' },
});
