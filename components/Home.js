import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ onSelectModule }) {
  return (
    <ImageBackground source={{uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop'}} style={styles.container}>
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to FLEX</Text>
        <Text style={styles.subtitle}>Select a module to continue</Text>

        <TouchableOpacity onPress={() => onSelectModule('GradePlannerList')} style={styles.cardContainer}>
          <BlurView intensity={40} tint="light" style={styles.card}>
            <Ionicons name="school" size={40} color={colors.primary} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Grades Planner</Text>
              <Text style={styles.cardSubtitle}>Plan your assessments and see what it takes to pass.</Text>
            </View>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSelectModule('AttendanceDashboard')} style={styles.cardContainer}>
          <BlurView intensity={40} tint="light" style={styles.card}>
            <Ionicons name="calendar" size={40} color={colors.success} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Attendance</Text>
              <Text style={styles.cardSubtitle}>Track your attendance and record presents or absences.</Text>
            </View>
          </BlurView>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 40, textAlign: 'center' },
  cardContainer: { borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  card: { flexDirection: 'row', padding: 20, alignItems: 'center', backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  cardText: { marginLeft: 16, flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#e2e8f0' },
});
