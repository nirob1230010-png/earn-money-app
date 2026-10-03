import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Share, Alert, RefreshControl, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { User, Gift, Share2, LogOut, Copy, TrendingUp, Wallet, Award, Phone, ChevronRight } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import API, { removeToken } from '../api';
import { COLORS, GRADIENT } from '../theme';

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const { data } = await API.get('/me');
      setUser(data);
    } catch (e) { console.log(e.message); }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const copyCode = async () => {
    await Clipboard.setStringAsync(user?.referralCode || '');
    Toast.show({ type: 'success', text1: '✅ Code copy হয়েছে!' });
  };

  const shareCode = async () => {
    try {
      await Share.share({
        message: `🎁 EARN MONEY এ যোগ দিন!\n\n💰 Register করলেই ৫০৳ বোনাস\n🤝 আমার code ব্যবহার করুন: ${user?.referralCode}\n\n📱 Download: https://earn-money-backed.onrender.com`,
      });
    } catch (e) { console.log(e); }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Logout করবেন?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await removeToken();
        navigation.replace('Login');
      }},
    ]);
  };

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#A78BFA" /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#A78BFA" />}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient colors={GRADIENT.gradient} style={styles.avatar}>
            <User size={34} color="#fff" />
          </LinearGradient>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <View style={styles.phoneWrap}>
            <Phone size={12} color={COLORS.textSecondary} />
            <Text style={styles.phone}>{user?.phone || 'N/A'}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Wallet size={18} color="#22C55E" />
            <Text style={styles.statValue}>৳{user?.balance?.toFixed(0) || 0}</Text>
            <Text style={styles.statLabel}>Balance</Text>
          </View>
          <View style={styles.statBox}>
            <TrendingUp size={18} color="#A78BFA" />
            <Text style={styles.statValue}>৳{user?.totalEarned?.toFixed(0) || 0}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statBox}>
            <Award size={18} color="#F59E0B" />
            <Text style={styles.statValue}>৳{user?.pendingPoints || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Referral Card */}
        <LinearGradient colors={GRADIENT.pink} style={styles.referralCard}>
          <View style={styles.refHeader}>
            <Gift size={22} color="#fff" />
            <Text style={styles.refTitle}>Refer & Earn ৳25</Text>
          </View>
          <Text style={styles.refDesc}>
            আপনার code share করুন। কেউ register করে প্রথম task করলে পাবেন ২৫৳!
          </Text>

          <View style={styles.refCodeWrap}>
            <View style={styles.refCodeBox}>
              <Text style={styles.refCodeLabel}>Your Code</Text>
              <Text style={styles.refCode}>{user?.referralCode || 'EM000000'}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={copyCode}>
              <Copy size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={shareCode} style={styles.shareBtn}>
            <Share2 size={16} color="#EC4899" />
            <Text style={styles.shareText}>Share with Friends</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Menu */}
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => navigation.navigate('Wallet')} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
              <Wallet size={18} color="#22C55E" />
            </View>
            <Text style={styles.menuText}>My Wallet</Text>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Withdraw')} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(167,139,250,0.15)' }]}>
              <TrendingUp size={18} color="#A78BFA" />
            </View>
            <Text style={styles.menuText}>Withdraw</Text>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <LogOut size={18} color="#EF4444" />
            </View>
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>EARN MONEY v1.0.0</Text>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loading: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, paddingTop: 50 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#7C3AED', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  name: { color: '#fff', fontSize: 22, fontWeight: '800' },
  phoneWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  phone: { color: COLORS.textSecondary, fontSize: 13 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, gap: 4 },
  statValue: { color: '#fff', fontSize: 17, fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, textTransform: 'uppercase' },
  referralCard: { borderRadius: 22, padding: 20, marginBottom: 20, shadowColor: '#EC4899', shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  refHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  refTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  refDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 18, marginBottom: 16 },
  refCodeWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  refCodeBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', borderStyle: 'dashed' },
  refCodeLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' },
  refCode: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 3, marginTop: 2 },
  copyBtn: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14 },
  shareText: { color: '#EC4899', fontSize: 15, fontWeight: '800' },
  menu: { backgroundColor: COLORS.card, borderRadius: 20, padding: 6, borderWidth: 1, borderColor: COLORS.cardBorder },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '600' },
  version: { color: COLORS.textMuted, textAlign: 'center', fontSize: 11, marginTop: 24 },
});
