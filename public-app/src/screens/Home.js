import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Wallet, Gift, TrendingUp, Target, ChevronRight, Bell, Sparkles, ClipboardList } from 'lucide-react-native';
import API, { getUser } from '../api';
import AdBanner from '../components/AdBanner';
import { COLORS, GRADIENT } from '../theme';

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [meRes, tasksRes] = await Promise.all([
        API.get('/me'),
        API.get('/tasks'),
      ]);
      setUser(meRes.data);
      setTasks(tasksRes.data.tasks || []);
    } catch (e) {
      console.log('Load error:', e.message);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#A78BFA" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#A78BFA" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>স্বাগতম 👋</Text>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
          </View>
          <View style={styles.bellWrap}>
            <Bell size={20} color={COLORS.textSecondary} />
            <View style={styles.bellDot} />
          </View>
        </View>

        {/* Balance Card */}
        <LinearGradient colors={GRADIENT.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Wallet size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.balanceLabel}>Total Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>৳ {Number(user?.balance || 0).toFixed(2)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceSub}>
              <Text style={styles.balanceSubLabel}>Pending</Text>
              <Text style={styles.balanceSubValue}>৳ {user?.pendingPoints || 0}</Text>
            </View>
            <View style={styles.balanceSub}>
              <Text style={styles.balanceSubLabel}>Total Earned</Text>
              <Text style={styles.balanceSubValue}>৳ {user?.totalEarned || 0}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Ad Banner */}
        <AdBanner />

        {/* Bonus Button */}
        <TouchableOpacity style={styles.bonusBtn} onPress={() => navigation.navigate('Bonus')}>
          <LinearGradient colors={['#EC4899', '#F59E0B']} style={styles.bonusInner}>
            <Gift size={20} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bonusTitle}>🎁 Bonus Rewards</Text>
              <Text style={styles.bonusSub}>Daily ৳5, Streak ৳20, Weekly ৳100</Text>
            </View>
            <ChevronRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Take Surveys Button */}
        <TouchableOpacity style={styles.surveysBtn} onPress={() => navigation.navigate('Surveys', { userId: user?.phone })}>
          <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.surveysInner}>
            <ClipboardList size={20} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.surveysTitle}>📋 Take Surveys</Text>
              <Text style={styles.surveysSub}>Complete surveys → earn ৳</Text>
            </View>
            <ChevronRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Withdraw')}>
            <LinearGradient colors={GRADIENT.green} style={styles.actionIcon}>
              <TrendingUp size={18} color="#fff" />
            </LinearGradient>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Profile')}>
            <LinearGradient colors={GRADIENT.pink} style={styles.actionIcon}>
              <Gift size={18} color="#fff" />
            </LinearGradient>
            <Text style={styles.actionText}>Refer & Earn</Text>
          </TouchableOpacity>
        </View>

        {/* Tasks Section */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Target size={18} color="#A78BFA" />
            <Text style={styles.sectionTitle}>Available Tasks</Text>
          </View>
          <Text style={styles.sectionCount}>{tasks.length}</Text>
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyBox}>
            <Sparkles size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>এখনো কোনো task নেই</Text>
            <Text style={styles.emptySub}>পরে আবার দেখুন</Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TouchableOpacity
              key={task._id}
              style={styles.taskCard}
              onPress={() => navigation.navigate('TaskDetail', { task })}
              activeOpacity={0.7}
            >
              <View style={styles.taskLeft}>
                <LinearGradient colors={GRADIENT.cyan} style={styles.taskIcon}>
                  <Text style={styles.taskIconText}>৳</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                  <View style={styles.taskMeta}>
                    <Text style={styles.taskMetaText}>Deposit ৳{task.depositAmt}</Text>
                    <Text style={styles.taskMetaDot}>•</Text>
                    <Text style={styles.taskMetaReward}>Reward ৳{task.rewardAmt}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.taskRight}>
                <Text style={styles.profitText}>+৳{task.rewardAmt - task.depositAmt}</Text>
                <ChevronRight size={18} color={COLORS.textMuted} />
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingWrap: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.textSecondary, fontSize: 13 },
  scroll: { padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greet: { color: COLORS.textSecondary, fontSize: 13 },
  name: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  bellWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, position: 'relative' },
  bellDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  balanceCard: { borderRadius: 24, padding: 22, marginBottom: 16, shadowColor: '#7C3AED', shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  balanceAmount: { color: '#fff', fontSize: 38, fontWeight: '800', letterSpacing: 1 },
  balanceRow: { flexDirection: 'row', marginTop: 16, gap: 20 },
  balanceSub: { flex: 1 },
  balanceSubLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  balanceSubValue: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 2 },
  bonusBtn: { marginBottom: 12 },
  bonusInner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16 },
  bonusTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  bonusSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },
  surveysBtn: { marginBottom: 16 },
  surveysInner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16 },
  surveysTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  surveysSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionBtn: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  actionIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  sectionCount: { color: '#A78BFA', fontSize: 13, fontWeight: '700', backgroundColor: 'rgba(167,139,250,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  emptyBox: { backgroundColor: COLORS.card, borderRadius: 20, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, gap: 8 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  emptySub: { color: COLORS.textMuted, fontSize: 12 },
  taskCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 18, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.cardBorder },
  taskLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  taskIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  taskIconText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  taskTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  taskMetaText: { color: COLORS.textSecondary, fontSize: 11 },
  taskMetaDot: { color: COLORS.textMuted, fontSize: 11 },
  taskMetaReward: { color: '#22C55E', fontSize: 11, fontWeight: '600' },
  taskRight: { alignItems: 'flex-end', gap: 4 },
  profitText: { color: '#22C55E', fontSize: 13, fontWeight: '800' },
});
