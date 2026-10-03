import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Wallet, Smartphone, CreditCard, AlertCircle, Check } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import API from '../api';
import { COLORS, GRADIENT } from '../theme';

export default function Withdraw({ navigation }) {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/me').then(r => setBalance(r.data.balance || 0)).catch(() => {});
  }, []);

  const METHODS = [
    { id: 'bKash', icon: Smartphone, color: '#E2136E' },
    { id: 'Nagad', icon: Smartphone, color: '#F6921E' },
    { id: 'Rocket', icon: Smartphone, color: '#8B2E8B' },
    { id: 'Bank', icon: CreditCard, color: '#3B82F6' },
  ];

  const handleSubmit = async () => {
    const amt = +amount;
    if (!amt || amt < 100) {
      Toast.show({ type: 'error', text1: 'সর্বনিম্ন ১০০৳', text2: 'কম দিলে withdraw হবে না' });
      return;
    }
    if (amt > balance) {
      Toast.show({ type: 'error', text1: 'ব্যালেন্স কম!' });
      return;
    }
    if (!accountNumber) {
      Toast.show({ type: 'error', text1: 'একাউন্ট নম্বর দিন' });
      return;
    }

    Alert.alert('Confirm', `৳${amt} withdraw করবেন?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm', onPress: async () => {
          setLoading(true);
          try {
            await API.post('/withdraw', { amount: amt, paymentMethod: method, accountNumber });
            Toast.show({ type: 'success', text1: '✅ Request পাঠানো হয়েছে!', text2: 'Admin approve করবে' });
            setTimeout(() => navigation.goBack(), 1500);
          } catch (err) {
            Toast.show({ type: 'error', text1: err.response?.data?.error || 'Error' });
          }
          setLoading(false);
        }
      }
    ]);
  };

  const quickAmounts = [100, 200, 500, 1000];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdraw</Text>
          <View style={{ width: 40 }} />
        </View>

        <LinearGradient colors={GRADIENT.green} style={styles.balanceCard}>
          <Wallet size={22} color="rgba(255,255,255,0.9)" />
          <Text style={styles.bLabel}>Available Balance</Text>
          <Text style={styles.bAmount}>৳ {balance.toFixed(2)}</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💰 Amount</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="number-pad"
          />

          <View style={styles.quickRow}>
            {quickAmounts.map(a => (
              <TouchableOpacity key={a} onPress={() => setAmount(String(a))}
                style={[styles.quickBtn, amount === String(a) && styles.quickBtnActive]}>
                <Text style={[styles.quickText, amount === String(a) && styles.quickTextActive]}>৳{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📱 Payment Method</Text>
          <View style={styles.methodsGrid}>
            {METHODS.map(m => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <TouchableOpacity key={m.id} onPress={() => setMethod(m.id)}
                  style={[styles.methodBtn, active && { borderColor: m.color, backgroundColor: `${m.color}15` }]}>
                  <Icon size={20} color={active ? m.color : COLORS.textMuted} />
                  <Text style={[styles.methodText, active && { color: '#fff' }]}>{m.id}</Text>
                  {active && <View style={[styles.methodCheck, { backgroundColor: m.color }]}>
                    <Check size={10} color="#fff" />
                  </View>}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="01XXXXXXXXX"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.infoBox}>
          <AlertCircle size={14} color="#FCD34D" />
          <Text style={styles.infoText}>
            ⚠️ সর্বনিম্ন ১০০৳ | Admin 24 ঘন্টার মধ্যে payment পাঠাবে
          </Text>
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          <LinearGradient colors={GRADIENT.green} style={styles.submitBtn}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Wallet size={18} color="#fff" />
                <Text style={styles.submitText}>Request Withdraw</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  balanceCard: { borderRadius: 22, padding: 22, marginBottom: 16, alignItems: 'center', shadowColor: '#22C55E', shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  bLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' },
  bAmount: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: COLORS.cardBorder },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 14 },
  amountInput: { backgroundColor: 'rgba(30,41,59,0.6)', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, color: '#fff', fontSize: 32, fontWeight: '800', paddingHorizontal: 16, paddingVertical: 14, textAlign: 'center' },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  quickBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: 'rgba(30,41,59,0.6)', borderWidth: 1, borderColor: COLORS.border },
  quickBtnActive: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: '#22C55E' },
  quickText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },
  quickTextActive: { color: '#22C55E' },
  methodsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  methodBtn: { flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, backgroundColor: 'rgba(30,41,59,0.6)', position: 'relative' },
  methodText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },
  methodCheck: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  label: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8, marginTop: 4, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(30,41,59,0.6)', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, color: '#fff', fontSize: 15, paddingHorizontal: 14, paddingVertical: 14 },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(252,211,77,0.1)', borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)', borderRadius: 12, padding: 12, marginBottom: 16 },
  infoText: { color: '#FCD34D', fontSize: 12, flex: 1, lineHeight: 18 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
