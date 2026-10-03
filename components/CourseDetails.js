import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';

export default function CourseDetails({ course }) {
  if (!course) return null;

  const attendancePercentage = ((course.attendedClasses / course.totalClasses) * 100).toFixed(0);
  const isLowAttendance = attendancePercentage < 80;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.name}>{course.name}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Attendance Summary</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{course.totalClasses}</Text>
            <Text style={styles.statLabel}>Total Classes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{course.attendedClasses}</Text>
            <Text style={styles.statLabel}>Attended</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: isLowAttendance ? colors.danger : colors.success }]}>
              {attendancePercentage}%
            </Text>
            <Text style={styles.statLabel}>Percentage</Text>
          </View>
        </View>

        {isLowAttendance && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Warning: Your attendance is below the 80% threshold. You may not be allowed to sit in the final exam if you miss more classes.
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Recent Absences</Text>
        {course.recentAbsences.length > 0 ? (
          course.recentAbsences.map((date, index) => (
            <View key={index} style={styles.absenceItem}>
              <Text style={styles.absenceDate}>{date}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No absences recorded yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  code: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  warningBox: {
    backgroundColor: colors.danger + '20',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  warningText: {
    color: colors.danger,
    lineHeight: 20,
  },
  absenceItem: {
    backgroundColor: colors.cardElevated,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  absenceDate: {
    color: colors.textSecondary,
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  }
});
