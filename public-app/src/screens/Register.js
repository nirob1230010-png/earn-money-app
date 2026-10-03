import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Phone, Sparkles, UserPlus, Gift, User } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import API, { saveToken, saveUser } from '../api';
import { COLORS, GRADIENT } from '../theme';

export default function Register({ navigation }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDeviceId = () => {
    return Application.androidId || Application.applicationId || Device.osBuildId || 'device-' + Date.now();
  };

  const handleRegister = async () => {
    if (!phone || !password || !name) {
      setError('নাম, ফোন, পাসওয়ার্ড পূরণ করুন');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/register', {
        phone, password, name,
        deviceId: getDeviceId(),
        referralCode: referralCode.trim().toUpperCase() || undefined,
      });
      await saveToken(data.token);
      await saveUser(data.user);
      Toast.show({ type: 'success', text1: '🎁 রেজিস্ট্রেশন সফল!', text2: '৫০৳ বোনাস পেয়েছেন!' });
      navigation.replace('MainTabs');
    } catch (err) {
      setError(err.response?.data?.error || 'রেজিস্ট্রেশন ব্যর্থ');
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
            <UserPlus size={30} color="#fff" />
          </LinearGradient>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>EARN MONEY • GET ৳50 BONUS</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.bonusBanner}>
            <Gift size={18} color="#FCD34D" />
            <Text style={styles.bonusText}>Register করলেই পাবেন ৫০৳ বোনাস!</Text>
          </View>

          {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrap}>
            <User size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} value={name} onChangeText={setName}
              placeholder="আপনার নাম" placeholderTextColor={COLORS.textMuted} />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrap}>
            <Phone size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone}
              placeholder="01XXXXXXXXX" placeholderTextColor={COLORS.textMuted} keyboardType="phone-pad" />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Lock size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} value={password} onChangeText={setPassword}
              placeholder="••••••••" placeholderTextColor={COLORS.textMuted} secureTextEntry />
          </View>

          <Text style={styles.label}>Referral Code (Optional)</Text>
          <View style={styles.inputWrap}>
            <Gift size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} value={referralCode}
              onChangeText={(t) => setReferralCode(t.toUpperCase())}
              placeholder="EMXXXXXX" placeholderTextColor={COLORS.textMuted} autoCapitalize="characters" />
          </View>

          <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.btnWrap}>
            <LinearGradient colors={GRADIENT.gradient} style={styles.btn}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <UserPlus size={18} color="#fff" />
                  <Text style={styles.btnText}>Create Account</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>অ্যাকাউন্ট আছে? <Text style={styles.linkBold}>লগইন করুন</Text></Text>
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
  logoWrap: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: '#7C3AED', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 10, color: COLORS.textSecondary, letterSpacing: 2.5, marginTop: 4 },
  card: { backgroundColor: COLORS.card, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: COLORS.cardBorder },
  bonusBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(252,211,77,0.1)', borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)', borderRadius: 12, padding: 12, marginBottom: 16, justifyContent: 'center' },
  bonusText: { color: '#FCD34D', fontSize: 13, fontWeight: '600' },
  error: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 12, padding: 12, marginBottom: 16 },
  errorText: { color: '#FCA5A5', fontSize: 13, textAlign: 'center' },
  label: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 8, marginTop: 4, textTransform: 'uppercase' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30,41,59,0.6)', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14 },
  btnWrap: { marginTop: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 18, fontSize: 13 },
  linkBold: { color: '#A78BFA', fontWeight: '700' },
});
