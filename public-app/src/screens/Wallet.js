import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, TrendingUp, History } from 'lucide-react-native';
import API from '../api';
import { COLORS, GRADIENT } from '../theme';

export default function Wallet({ navigation }) {
  const [user, setUser] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [me, w] = await Promise.all([
        API.get('/me'),
        API.get('/my-withdrawals'),
      ]);
      setUser(me.data);
      setWithdrawals(w.data || []);
    } catch (e) { console.log(e.message); }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#A78BFA" /></View>;
  }

  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'APPROVED')
    .reduce((a, w) => a + w.amount, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#A78BFA" />}
      >
        <Text style={styles.pageTitle}>My Wallet</Text>

        {/* Balance Card */}
        <LinearGradient colors={GRADIENT.blue} style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <WalletIcon size={22} color="rgba(255,255,255,0.9)" />
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>৳ {Number(user?.balance || 0).toFixed(2)}</Text>
          <View style={styles.balanceBottom}>
            <View>
              <Text style={styles.bLabel}>Pending</Text>
              <Text style={styles.bValue}>৳ {user?.pendingPoints || 0}</Text>
            </View>
            <View>
              <Text style={styles.bLabel}>Total Earned</Text>
              <Text style={styles.bValue}>৳ {user?.totalEarned || 0}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Withdraw')} style={styles.withdrawBtn}>
            <ArrowUpRight size={16} color="#3B82F6" />
            <Text style={styles.withdrawText}>Withdraw Money</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#22C55E" />
            <Text style={styles.statNum}>৳{totalWithdrawn}</Text>
            <Text style={styles.statLabel}>Withdrawn</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={20} color="#F59E0B" />
            <Text style={styles.statNum}>
              {withdrawals.filter(w => w.status === 'PENDING').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <History size={20} color="#A78BFA" />
            <Text style={styles.statNum}>{withdrawals.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Withdrawal History Title */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <History size={18} color="#A78BFA" />
            <Text style={styles.sectionTitle}>Withdrawal History</Text>
          </View>
          <Text style={styles.sectionCount}>{withdrawals.length}</Text>
        </View>

        {/* Withdrawal List */}
        {withdrawals.length === 0 ? (
          <View style={styles.empty}>
            <History size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>কোনো withdrawal নেই</Text>
            <Text style={styles.emptySub}>Task complete করলে withdraw করতে পারবেন</Text>
          </View>
        ) : (
          withdrawals.map((item, i) => (
            <View key={i} style={styles.historyItem}>
              <View style={[
                styles.historyIcon,
                { backgroundColor: item.status === 'APPROVED' ? 'rgba(34,197,94,0.15)' :
                  item.status === 'REJECTED' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)' }
              ]}>
                <ArrowUpRight size={16} color={item.status === 'APPROVED' ? '#22C55E' : item.status === 'REJECTED' ? '#EF4444' : '#F59E0B'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{item.paymentMethod} Withdraw</Text>
                <Text style={styles.historyDate}>
                  {new Date(item.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: item.status === 'APPROVED' ? 'rgba(34,197,94,0.15)' :
                    item.status === 'REJECTED' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'
                }]}>
                  <Text style={[styles.statusText, {
                    color: item.status === 'APPROVED' ? '#22C55E' :
                      item.status === 'REJECTED' ? '#EF4444' : '#F59E0B'
                  }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.historyAmount}>-৳{item.amount}</Text>
            </View>
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loading: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, paddingTop: 50 },
  pageTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 20 },
  balanceCard: { borderRadius: 24, padding: 22, marginBottom: 18, shadowColor: '#3B82F6', shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  balanceTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  balanceAmount: { color: '#fff', fontSize: 40, fontWeight: '800' },
  balanceBottom: { flexDirection: 'row', gap: 30, marginTop: 14 },
  bLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  bValue: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 2 },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, marginTop: 18 },
  withdrawText: { color: '#3B82F6', fontSize: 15, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, gap: 4 },
  statNum: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  sectionCount: { color: '#A78BFA', fontSize: 13, fontWeight: '700', backgroundColor: 'rgba(167,139,250,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  empty: { alignItems: 'center', padding: 40, gap: 10 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  emptySub: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center' },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.cardBorder },
  historyIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  historyTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
  historyDate: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 },
  statusText: { fontSize: 10, fontWeight: '700' },
  historyAmount: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
