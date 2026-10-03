import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Phone, Sparkles, Zap } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import API, { saveToken, saveUser } from '../api';
import { COLORS, GRADIENT } from '../theme';

export default function Login({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDeviceId = () => {
    return Application.androidId || Application.applicationId || Device.osBuildId || 'device-' + Date.now();
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('সব ফিল্ড পূরণ করুন');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/login', {
        phone,
        password,
        deviceId: getDeviceId(),
      });
      await saveToken(data.token);
      await saveUser(data.user);
      Toast.show({ type: 'success', text1: 'লগইন সফল!', text2: `স্বাগতম ${data.user.name || ''}` });
      navigation.replace('MainTabs');
    } catch (err) {
      setError(err.response?.data?.error || 'লগইন ব্যর্থ');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <LinearGradient colors={GRADIENT.gradient} style={styles.logo}>
            <Sparkles size={32} color="#fff" />
          </LinearGradient>
          <Text style={styles.title}>EARN MONEY</Text>
          <Text style={styles.subtitle}>LOGIN TO CONTINUE</Text>
        </View>

        <View style={styles.card}>
          {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrap}>
            <Phone size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="01XXXXXXXXX"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Lock size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.btnWrap}>
            <LinearGradient colors={GRADIENT.gradient} style={styles.btn}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Zap size={18} color="#fff" />
                  <Text style={styles.btnText}>Sign In</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>নতুন ইউজার? <Text style={styles.linkBold}>রেজিস্টার করুন</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  blob1: { position: 'absolute', top: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: '#7C3AED', opacity: 0.15 },
  blob2: { position: 'absolute', bottom: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: '#3B82F6', opacity: 0.15 },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#7C3AED', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },
  subtitle: { fontSize: 11, color: COLORS.textSecondary, letterSpacing: 3, marginTop: 4 },
  card: { backgroundColor: COLORS.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: COLORS.cardBorder },
  error: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 12, padding: 12, marginBottom: 16 },
  errorText: { color: '#FCA5A5', fontSize: 13, textAlign: 'center' },
  label: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 8, marginTop: 4, textTransform: 'uppercase' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30,41,59,0.6)', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14 },
  btnWrap: { marginTop: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  link: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 20, fontSize: 13 },
  linkBold: { color: '#A78BFA', fontWeight: '700' },
});
