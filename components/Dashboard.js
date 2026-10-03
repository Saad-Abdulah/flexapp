import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import CourseCard from './CourseCard';
import { colors } from '../theme';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard({ courses, onCourseSelect, onAddAbsence }) {
  const [searchQuery, setSearchQuery] = useState('');

  const totalClasses = courses.reduce((sum, c) => sum + c.totalClasses, 0);
  const totalAttended = courses.reduce((sum, c) => sum + c.attendedClasses, 0);
  const totalMissed = totalClasses - totalAttended;

  const pieData = [
    { name: 'Attended', count: totalAttended, color: colors.success, legendFontColor: colors.textSecondary, legendFontSize: 12 },
    { name: 'Missed', count: totalMissed, color: colors.danger, legendFontColor: colors.textSecondary, legendFontSize: 12 },
  ];

  const barData = {
    labels: courses.map(c => c.code),
    datasets: [{
      data: courses.map(c => ((c.attendedClasses / c.totalClasses) * 100))
    }]
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Attendance</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={180}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor={"count"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course-wise Attendance (%)</Text>
        <BarChart
          data={barData}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => colors.textSecondary,
            style: { borderRadius: 16 },
            barPercentage: 0.7,
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onAddAbsence}>
        <Text style={styles.actionButtonText}>+ Record Absence</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Courses</Text>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search courses by name or code..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onPress={onCourseSelect} />
          ))
        ) : (
          <Text style={styles.emptyText}>No courses found.</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.cardElevated,
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  }
});
