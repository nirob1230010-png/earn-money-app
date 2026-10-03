import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Gift, Flame, Calendar, Users, Lock, Sparkles } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import API from '../api';
import { COLORS, GRADIENT } from '../theme';

export default function Bonus({ navigation }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claiming, setClaiming] = useState('');

  const loadStatus = async () => {
    try {
      const { data } = await API.get('/bonus/status');
      setStatus(data);
    } catch (e) { console.log(e.message); }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadStatus(); }, []));

  const claim = async (type, endpoint) => {
    setClaiming(type);
    try {
      const { data } = await API.post(endpoint);
      Toast.show({ type: 'success', text1: '🎉 Bonus!', text2: data.message });
      loadStatus();
    } catch (err) {
      Toast.show({ type: 'error', text1: err.response?.data?.error || 'Error' });
    }
    setClaiming('');
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#A78BFA" /></View>;

  const BonusCard = ({ icon: Icon, title, desc, reward, canClaim, progress, claimType, endpoint, gradient }) => (
    <View style={styles.bonusCard}>
      <LinearGradient colors={gradient} style={styles.bonusIcon}>
        <Icon size={22} color="#fff" />
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={styles.bonusTitle}>{title}</Text>
        <Text style={styles.bonusDesc}>{desc}</Text>
        {progress && (
          <View style={styles.progressWrap}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress.current}/{progress.total}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => canClaim && claim(claimType, endpoint)}
        disabled={!canClaim || claiming === claimType}
        style={[styles.claimBtn, canClaim ? styles.claimBtnActive : styles.claimBtnDisabled]}
      >
        {claiming === claimType ? <ActivityIndicator color="#fff" size="small" /> : canClaim ? (
          <><Sparkles size={12} color="#fff" /><Text style={styles.claimText}>৳{reward}</Text></>
        ) : (
          <><Lock size={12} color={COLORS.textMuted} /><Text style={styles.claimTextDisabled}>৳{reward}</Text></>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadStatus(); }} tintColor="#A78BFA" />}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bonus Rewards</Text>
          <View style={{ width: 40 }} />
        </View>

        <LinearGradient colors={GRADIENT.purple} style={styles.heroCard}>
          <Gift size={32} color="#fff" />
          <Text style={styles.heroTitle}>Extra ৳ Earn করুন!</Text>
          <Text style={styles.heroDesc}>Daily login, task complete, ar refer করে bonus পান</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>🎁 Available Bonuses</Text>

        <BonusCard icon={Calendar} title="Daily Login Bonus" desc="প্রতিদিন login করলে ৳ পাবেন"
          reward={5} canClaim={status?.dailyLogin?.canClaim} claimType="dailyLogin" endpoint="/bonus/daily-login" gradient={GRADIENT.blue} />

        <BonusCard icon={Flame} title="Task Streak Bonus" desc="একদিনে ৫টি task complete করুন"
          reward={20} canClaim={status?.taskStreak?.canClaim}
          progress={{ current: status?.taskStreak?.todayTasks || 0, total: 5 }}
          claimType="streak" endpoint="/bonus/task-streak" gradient={GRADIENT.pink} />

        <BonusCard icon={Calendar} title="Weekly Bonus" desc="এক সপ্তাহে ৫০টি task complete করুন"
          reward={100} canClaim={status?.weekly?.canClaim}
          progress={{ current: status?.weekly?.weekTasks || 0, total: 50 }}
          claimType="weekly" endpoint="/bonus/weekly" gradient={GRADIENT.orange} />

        <BonusCard icon={Users} title="Refer 3 Friends Bonus" desc="৩ জন friend refer করুন (task complete)"
          reward={75} canClaim={status?.referral3?.canClaim}
          progress={{ current: status?.referral3?.referredCount || 0, total: 3 }}
          claimType="refer3" endpoint="/bonus/refer-3" gradient={GRADIENT.green} />

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loading: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  heroCard: { borderRadius: 22, padding: 22, marginBottom: 20, alignItems: 'center', shadowColor: '#7C3AED', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 10 },
  heroDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6, textAlign: 'center' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  bonusCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.cardBorder },
  bonusIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bonusTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bonusDesc: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  progressBar: { flex: 1, height: 4, backgroundColor: 'rgba(148,163,184,0.2)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: '#A78BFA', borderRadius: 2 },
  progressText: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700' },
  claimBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 70, justifyContent: 'center' },
  claimBtnActive: { backgroundColor: '#A78BFA' },
  claimBtnDisabled: { backgroundColor: 'rgba(148,163,184,0.15)' },
  claimText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  claimTextDisabled: { color: COLORS.textMuted, fontSize: 12, fontWeight: '800' },
});
