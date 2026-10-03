import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

export default function GradePlannerList({ courses, onCourseSelect }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Select a Course to Plan Grades</Text>
      {courses.map(course => (
        <TouchableOpacity key={course.id} style={styles.card} onPress={() => onCourseSelect(course.id)}>
          <Text style={styles.courseCode}>{course.code}</Text>
          <Text style={styles.courseName}>{course.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerText: { color: colors.textSecondary, fontSize: 16, marginBottom: 20 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  courseCode: { color: colors.primary, fontWeight: 'bold', marginBottom: 4 },
  courseName: { color: colors.text, fontSize: 18, fontWeight: 'bold' }
});
