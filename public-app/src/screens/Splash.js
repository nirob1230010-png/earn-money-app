import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { getToken } from '../api';
import { COLORS, GRADIENT } from '../theme';

const { width } = Dimensions.get('window');

export default function Splash({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    setTimeout(async () => {
      const token = await getToken();
      navigation.replace(token ? 'MainTabs' : 'Login');
    }, 2200);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <Animated.View style={[styles.center, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={GRADIENT.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logo}
        >
          <Sparkles size={40} color="#fff" />
        </LinearGradient>

        <Text style={styles.title}>EARN MONEY</Text>
        <Text style={styles.subtitle}>Complete Tasks • Earn Rewards</Text>
      </Animated.View>

      <Text style={styles.footer}>Powered by EARN MONEY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  blob1: { position: 'absolute', top: -100, left: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: '#7C3AED', opacity: 0.15 },
  blob2: { position: 'absolute', bottom: -100, right: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: '#3B82F6', opacity: 0.15 },
  center: { alignItems: 'center' },
  logo: { width: 96, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#7C3AED', shadowOpacity: 0.6, shadowRadius: 30, elevation: 12 },
  title: { fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: 2, marginBottom: 8 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 40, fontSize: 12, color: COLORS.textMuted },
});
