import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

export default function CourseCard({ course, onPress }) {
  const attendancePercentage = ((course.attendedClasses / course.totalClasses) * 100).toFixed(0);
  const isLowAttendance = attendancePercentage < 80;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(course.id)}>
      <View style={styles.header}>
        <Text style={styles.code}>{course.code}</Text>
        {isLowAttendance && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>Low Attendance</Text>
          </View>
        )}
      </View>
      <Text style={styles.name}>{course.name}</Text>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{course.attendedClasses}/{course.totalClasses}</Text>
          <Text style={styles.statLabel}>Attended</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isLowAttendance ? colors.danger : colors.success }]}>
            {attendancePercentage}%
          </Text>
          <Text style={styles.statLabel}>Percentage</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  code: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  warningBadge: {
    backgroundColor: colors.danger + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  warningText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  }
});
