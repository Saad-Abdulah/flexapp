import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

export default function RecordAbsenceForm({ courses, onSubmit, onCancel }) {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    
    if (!selectedCourseId) {
      setError('Please enter a valid course code or ID.');
      return;
    }
    
    if (!date) {
      setError('Please enter the date of absence.');
      return;
    }

    // Validate if course exists
    const course = courses.find(c => c.code.toLowerCase() === selectedCourseId.toLowerCase() || c.id === selectedCourseId);
    if (!course) {
      setError('Course not found. Please check the course code.');
      return;
    }

    // Call submit
    onSubmit(course.id, date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Record New Absence</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course Code (e.g., CS412)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course code"
            placeholderTextColor={colors.textSecondary}
            value={selectedCourseId}
            onChangeText={setSelectedCourseId}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Absence (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2026-10-03"
            placeholderTextColor={colors.textSecondary}
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Absence</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: colors.danger + '20',
    padding: 8,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.text,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.cardElevated,
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.cardElevated,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
