import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, ClipboardList, ExternalLink, Star, TrendingUp, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENT } from '../theme';

export default function Surveys({ navigation, route }) {
  const { userId } = route.params || {};
  const [selected, setSelected] = useState('cpx');

  const providers = [
    {
      id: 'cpx',
      name: 'CPX Research',
      desc: 'Surveys • $0.50-2',
      icon: ClipboardList,
      gradient: GRADIENT.purple,
      url: `https://offers.cpx-research.com/index.php?app_id=36801&ext_user_id=${userId}&secure_hash=&subid_1=&subid_2=`,
    },
    {
      id: 'adgem',
      name: 'AdGem',
      desc: 'Game + Install • $0.20-5',
      icon: Star,
      gradient: GRADIENT.orange,
      url: `https://adunits.adgem.com/wall?appid=33736&playerid=${userId}`,
    },
    {
      id: 'timewall',
      name: 'TimeWall',
      desc: 'Survey + Offers • $0.20-3',
      icon: TrendingUp,
      gradient: GRADIENT.cyan,
      url: `https://timewall.io/wall/3baf6b2e87d4448a?user_id=${userId}`,
    },
    {
      id: 'bitcotasks',
      name: 'Bitcotasks',
      desc: 'Survey • $0.20-1',
      icon: Award,
      gradient: GRADIENT.green,
      url: `https://bitcotasks.com/wall/YOUR_APP_ID?user_id=${userId}`,
    },
  ];

  const current = providers.find(p => p.id === selected);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earn Money</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Survey & Task Providers</Text>
        <Text style={styles.pageSub}>Choose provider — complete tasks — earn ৳</Text>

        {providers.map((p) => {
          const Icon = p.icon;
          const isActive = selected === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => setSelected(p.id)}
              style={[styles.card, isActive && styles.cardActive]}
            >
              <LinearGradient colors={p.gradient} style={styles.iconWrap}>
                <Icon size={22} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{p.name}</Text>
                <Text style={styles.cardDesc}>{p.desc}</Text>
              </View>
              {isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={() => navigation.navigate('SurveyWebView', { url: current.url, title: current.name })}
          style={styles.startBtn}
        >
          <LinearGradient colors={current.gradient} style={styles.startInner}>
            <ExternalLink size={18} color="#fff" />
            <Text style={styles.startText}>Open {current.name}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Tips</Text>
          <Text style={styles.infoText}>• Survey complete করলে instant ৳ পাবেন</Text>
          <Text style={styles.infoText}>• Different provider = different survey</Text>
          <Text style={styles.infoText}>• Daily 3-5 surveys possible</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20, paddingTop: 10 },
  pageTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  pageSub: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.cardBorder },
  cardActive: { borderColor: '#A78BFA', backgroundColor: 'rgba(167,139,250,0.1)' },
  iconWrap: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cardDesc: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  activeBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#A78BFA', alignItems: 'center', justifyContent: 'center' },
  activeText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  startBtn: { marginTop: 10, marginBottom: 20 },
  startInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  startText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  infoBox: { backgroundColor: 'rgba(96,165,250,0.1)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)', borderRadius: 14, padding: 16, gap: 6 },
  infoTitle: { color: '#93C5FD', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  infoText: { color: '#93C5FD', fontSize: 12, lineHeight: 18 },
});
