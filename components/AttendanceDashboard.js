import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function AttendanceDashboard({ courses, onAddAttendance }) {
  const barData = {
    labels: courses.map(c => c.code),
    datasets: [{
      data: courses.map(c => ((c.attendedClasses / c.totalClasses) * 100)),
      colors: courses.map(c => {
        const perc = (c.attendedClasses / c.totalClasses) * 100;
        return perc < 80 ? () => colors.danger : () => colors.success;
      })
    }]
  };

  const totalAttended = courses.reduce((sum, c) => sum + c.attendedClasses, 0);
  const totalClassesSum = courses.reduce((sum, c) => sum + c.totalClasses, 0);
  const overallPerc = totalClassesSum > 0 ? (totalAttended / totalClassesSum) : 0;

  const progressData = {
    labels: ["Total Avg"],
    data: [overallPerc]
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onAddAttendance}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" style={{marginRight: 8}} />
        <Text style={styles.actionButtonText}>Add Attendance / Absence</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Semester Progress</Text>
        <ProgressChart
          data={progressData}
          width={screenWidth - 40}
          height={180}
          strokeWidth={16}
          radius={48}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: '#1E293B',
            backgroundGradientTo: '#1E293B',
            color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
            labelColor: (opacity = 1) => colors.textSecondary,
            style: { borderRadius: 16 }
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course-wise Attendance (%)</Text>
        <BarChart
          data={barData}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix="%"
          withCustomBarColorFromData={true}
          flatColor={true}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: '#1E293B',
            backgroundGradientTo: '#1E293B',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => colors.textSecondary,
            style: { borderRadius: 16 },
            barPercentage: 0.6,
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance Details</Text>
        {courses.map(course => {
          const perc = ((course.attendedClasses / course.totalClasses) * 100).toFixed(0);
          const presentsNeeded = Math.max(0, Math.ceil((0.8 * course.totalClasses - course.attendedClasses) / 0.2));
          
          return (
            <View key={course.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={[styles.perc, {color: perc < 80 ? colors.danger : colors.success}]}>{perc}%</Text>
              </View>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.statText}>Attended: {course.attendedClasses} / {course.totalClasses}</Text>
              {perc < 80 ? (
                <Text style={styles.warningText}>
                  Requires {presentsNeeded} more presents to reach 80% attendance.
                </Text>
              ) : (
                <Text style={styles.safeText}>Attendance is safe.</Text>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  actionButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: colors.primary, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8 },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  courseCode: { color: colors.primary, fontWeight: 'bold' },
  perc: { fontWeight: 'bold', fontSize: 16 },
  courseName: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 },
  statText: { color: colors.textSecondary, marginBottom: 4 },
  warningText: { color: colors.danger, fontWeight: 'bold', marginTop: 4, fontSize: 13 },
  safeText: { color: colors.success, marginTop: 4, fontSize: 13 }
});
