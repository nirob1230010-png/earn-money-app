import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ExternalLink, Upload, Check, Info } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import API from '../api';
import { COLORS, GRADIENT } from '../theme';

export default function TaskDetail({ route, navigation }) {
  const { task } = route.params;
  const [siteUsername, setSiteUsername] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!siteUsername || !transactionId) {
      Toast.show({ type: 'error', text1: 'সব ফিল্ড পূরণ করুন' });
      return;
    }
    setLoading(true);
    try {
      await API.post('/submit-task', {
        taskId: task._id,
        siteUsername,
        transactionId,
        screenshotUrl,
      });
      Toast.show({ type: 'success', text1: '✅ সাবমিট সফল!', text2: 'Admin approve করলে balance যোগ হবে' });
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      Toast.show({ type: 'error', text1: err.response?.data?.error || 'Error' });
    }
    setLoading(false);
  };

  const openLink = () => {
    if (task.link) Linking.openURL(task.link);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Task Card */}
        <LinearGradient colors={GRADIENT.purple} style={styles.taskCard}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Deposit</Text>
              <Text style={styles.statValue}>৳{task.depositAmt}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Reward</Text>
              <Text style={styles.statValue}>৳{task.rewardAmt}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Profit</Text>
              <Text style={styles.statValue}>৳{task.rewardAmt - task.depositAmt}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Steps */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📋 কিভাবে করবেন?</Text>
          {[
            'নিচের "Visit Site" button চাপুন',
            'সাইটে রেজিস্ট্রেশন করে ডিপোজিট করুন',
            'ডিপোজিট এর ট্রানজেকশন ID কপি করুন',
            'নিচের ফর্মে সাইট username, TXN ID দিন',
            'Admin approve করলে reward পাবেন',
          ].map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          {task.link && (
            <TouchableOpacity onPress={openLink} style={styles.visitBtn}>
              <LinearGradient colors={GRADIENT.cyan} style={styles.visitInner}>
                <ExternalLink size={16} color="#fff" />
                <Text style={styles.visitText}>Visit Site</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Form */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>✍️ Submit Proof</Text>

          <Text style={styles.label}>Site Username</Text>
          <TextInput style={styles.input} value={siteUsername} onChangeText={setSiteUsername}
            placeholder="আপনার সাইটে username" placeholderTextColor={COLORS.textMuted} />

          <Text style={styles.label}>Transaction ID</Text>
          <TextInput style={styles.input} value={transactionId} onChangeText={setTransactionId}
            placeholder="Deposit এর TXN ID" placeholderTextColor={COLORS.textMuted} />

          <Text style={styles.label}>Screenshot URL (Optional)</Text>
          <TextInput style={styles.input} value={screenshotUrl} onChangeText={setScreenshotUrl}
            placeholder="https://..." placeholderTextColor={COLORS.textMuted} autoCapitalize="none" />

          <View style={styles.infoBox}>
            <Info size={14} color="#60A5FA" />
            <Text style={styles.infoText}>Admin 24 ঘন্টার মধ্যে approve করবে</Text>
          </View>

          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <LinearGradient colors={GRADIENT.green} style={styles.submitBtn}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Upload size={18} color="#fff" />
                  <Text style={styles.submitText}>Submit Task</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
  taskCard: { borderRadius: 22, padding: 22, marginBottom: 16, shadowColor: '#7C3AED', shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  taskTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: COLORS.cardBorder },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(167,139,250,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#A78BFA', fontSize: 12, fontWeight: '800' },
  stepText: { color: COLORS.textSecondary, fontSize: 13, flex: 1 },
  visitBtn: { marginTop: 8 },
  visitInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  visitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  label: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 6, marginTop: 10, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(30,41,59,0.6)', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, color: '#fff', fontSize: 15, paddingHorizontal: 14, paddingVertical: 13 },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(96,165,250,0.1)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)', borderRadius: 12, padding: 12, marginTop: 14, marginBottom: 14 },
  infoText: { color: '#93C5FD', fontSize: 12, flex: 1 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
