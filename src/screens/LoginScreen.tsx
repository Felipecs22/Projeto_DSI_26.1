import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import Colors from '../constants/colors';
import LogoIcon from '../components/LogoIcon';

export default function LoginScreen({ navigation }: any) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <LogoIcon size={68} />
          <View style={styles.logoTextRow}>
            <Text style={styles.logoPlay}>Play</Text>
            <Text style={styles.logoScope}>scope</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Digite o seu E-Mail"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            selectionColor={Colors.ACCENT}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite a sua senha"
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

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.replace('MainTabs')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Não possui uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.BG_PRIMARY },
  inner:             { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logoArea:          { alignItems: 'center', marginBottom: 48 },
  logoTextRow:       { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  logoPlay:          { color: Colors.TEXT_PRIMARY, fontSize: 36, fontWeight: '700', letterSpacing: 0.5 },
  logoScope:         { color: Colors.ACCENT,        fontSize: 36, fontWeight: '700', letterSpacing: 0.5 },
  form:              { width: '100%' },
  input:             { backgroundColor: Colors.BG_CARD, color: Colors.TEXT_PRIMARY, height: 54, borderRadius: 14, paddingHorizontal: 18, marginBottom: 14, fontSize: 15, borderWidth: 1, borderColor: Colors.BORDER },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.BG_CARD, borderRadius: 14, paddingLeft: 18, paddingRight: 12, marginBottom: 10, borderWidth: 1, borderColor: Colors.BORDER, height: 54 },
  passwordInput:     { flex: 1, color: Colors.TEXT_PRIMARY, fontSize: 15 },
  showText:          { color: Colors.ACCENT, fontSize: 13, fontWeight: '600' },
  forgotBtn:         { alignSelf: 'flex-start', marginBottom: 28 },
  forgotText:        { color: Colors.ACCENT, fontSize: 13 },
  loginBtn:          { backgroundColor: Colors.ACCENT, height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: Colors.ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  loginBtnText:      { color: Colors.BG_PRIMARY, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  registerRow:       { flexDirection: 'row', justifyContent: 'center' },
  registerText:      { color: Colors.TEXT_MUTED, fontSize: 14 },
  registerLink:      { color: Colors.ACCENT, fontSize: 14, fontWeight: '700' },
});
