import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { ClipboardList, Clock, CheckCircle, XCircle, TrendingUp, ArrowDownLeft, Target } from 'lucide-react-native';
import API from '../api';
import { COLORS, GRADIENT } from '../theme';

export default function MyTasks({ navigation }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const loadData = async () => {
    try {
      const { data } = await API.get('/my-submissions');
      setSubs(data || []);
    } catch (e) { console.log(e.message); }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#A78BFA" /></View>;
  }

  const filtered = subs.filter(s => filter === 'ALL' || s.status === filter);

  const counts = {
    ALL: subs.length,
    PENDING: subs.filter(s => s.status === 'PENDING').length,
    APPROVED: subs.filter(s => s.status === 'APPROVED').length,
    REJECTED: subs.filter(s => s.status === 'REJECTED').length,
  };

  const totalEarned = subs
    .filter(s => s.status === 'APPROVED')
    .reduce((a, s) => a + (s.rewardAmt || 0), 0);

  const filters = [
    { id: 'ALL', label: 'All', color: '#A78BFA' },
    { id: 'PENDING', label: 'Pending', color: '#F59E0B' },
    { id: 'APPROVED', label: 'Approved', color: '#22C55E' },
    { id: 'REJECTED', label: 'Rejected', color: '#EF4444' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#A78BFA" />}
      >
        <Text style={styles.pageTitle}>My Tasks</Text>

        {/* Summary Card */}
        <LinearGradient colors={GRADIENT.purple} style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <TrendingUp size={22} color="rgba(255,255,255,0.9)" />
            <Text style={styles.summaryLabel}>Total Earned from Tasks</Text>
          </View>
          <Text style={styles.summaryAmount}>৳ {totalEarned}</Text>
          <View style={styles.summaryBottom}>
            <View>
              <Text style={styles.sLabel}>Total Tasks</Text>
              <Text style={styles.sValue}>{subs.length}</Text>
            </View>
            <View>
              <Text style={styles.sLabel}>Completed</Text>
              <Text style={styles.sValue}>{counts.APPROVED}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {filters.map(f => (
              <TouchableOpacity key={f.id} onPress={() => setFilter(f.id)}
                style={[styles.filterBtn, filter === f.id && { backgroundColor: `${f.color}20`, borderColor: f.color }]}>
                <Text style={[styles.filterText, filter === f.id && { color: f.color }]}>
                  {f.label} ({counts[f.id]})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Task History */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Target size={44} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>কোনো task নেই</Text>
            <Text style={styles.emptySub}>Home screen e giye task complete করুন</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((item, i) => (
            <View key={i} style={styles.taskItem}>
              <View style={[
                styles.taskIcon,
                { backgroundColor: item.status === 'APPROVED' ? 'rgba(34,197,94,0.15)' :
                  item.status === 'REJECTED' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)' }
              ]}>
                {item.status === 'APPROVED' ? <CheckCircle size={18} color="#22C55E" /> :
                 item.status === 'REJECTED' ? <XCircle size={18} color="#EF4444" /> :
                 <Clock size={18} color="#F59E0B" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle} numberOfLines={1}>{item.taskTitle || 'Task'}</Text>
                <Text style={styles.taskMeta}>Site: {item.siteUsername || 'N/A'}</Text>
                <Text style={styles.taskDate}>
                  {new Date(item.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Text>
                {item.rejectReason && (
                  <Text style={styles.rejectReason}>❌ {item.rejectReason}</Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.taskAmount, { color: item.status === 'APPROVED' ? '#22C55E' : item.status === 'REJECTED' ? '#EF4444' : '#F59E0B' }]}>
                  {item.status === 'APPROVED' ? '+' : item.status === 'REJECTED' ? '' : '৳'}৳{item.rewardAmt}
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
  summaryCard: { borderRadius: 24, padding: 22, marginBottom: 18, shadowColor: '#7C3AED', shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  summaryLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  summaryAmount: { color: '#fff', fontSize: 38, fontWeight: '800' },
  summaryBottom: { flexDirection: 'row', gap: 30, marginTop: 14 },
  sLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textTransform: 'uppercase' },
  sValue: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 2 },
  filterScroll: { marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder },
  filterText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 40, gap: 10 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  emptySub: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center' },
  emptyBtn: { marginTop: 12, backgroundColor: 'rgba(167,139,250,0.15)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(167,139,250,0.3)' },
  emptyBtnText: { color: '#A78BFA', fontSize: 13, fontWeight: '700' },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.cardBorder },
  taskIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  taskTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
  taskMeta: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  taskDate: { color: COLORS.textMuted, fontSize: 10, marginTop: 2 },
  rejectReason: { color: '#EF4444', fontSize: 11, marginTop: 4 },
  taskAmount: { fontSize: 15, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  statusText: { fontSize: 10, fontWeight: '700' },
});
