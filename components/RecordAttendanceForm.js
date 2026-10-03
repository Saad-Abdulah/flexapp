import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme';

export default function RecordAttendanceForm({ courses, setCourses, onSubmit, onCancel }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState('Present'); // 'Present' or 'Absent'

  const handleSubmit = () => {
    setCourses(prev => prev.map(c => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          totalClasses: c.totalClasses + 1,
          attendedClasses: type === 'Present' ? c.attendedClasses + 1 : c.attendedClasses,
          recentRecords: [...c.recentRecords, { date: date.toISOString().split('T')[0], type }]
        };
      }
      return c;
    }));
    onSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Record Attendance</Text>

        <Text style={styles.label}>Select Course</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCourseId}
            onValueChange={setSelectedCourseId}
            style={styles.picker}
            dropdownIconColor={colors.text}
          >
            {courses.map(c => (
              <Picker.Item key={c.id} label={`${c.code} - ${c.name}`} value={c.id} color={Platform.OS==='ios'?colors.text:'black'} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onValueChange={(event, selectedDate) => {
              if (Platform.OS === 'android') setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
            onChange={(event, selectedDate) => {
               // iOS fallback if onValueChange isn't enough, but usually onValueChange works.
               if (Platform.OS === 'ios') {
                 if (selectedDate) setDate(selectedDate);
               } else {
                 setShowDatePicker(false);
                 if (selectedDate && event.type !== 'dismissed') setDate(selectedDate);
               }
            }}
          />
        )}

        <Text style={styles.label}>Type</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, type === 'Present' && styles.toggleActivePresent]} 
            onPress={() => setType('Present')}
          >
            <Text style={styles.toggleText}>Present</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, type === 'Absent' && styles.toggleActiveAbsent]} 
            onPress={() => setType('Absent')}
          >
            <Text style={styles.toggleText}>Absent</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { color: colors.text, marginBottom: 8, fontWeight: '600' },
  pickerContainer: { backgroundColor: colors.cardElevated, borderRadius: 8, marginBottom: 20, overflow: 'hidden' },
  picker: { color: colors.text },
  dateBtn: { backgroundColor: colors.cardElevated, padding: 16, borderRadius: 8, marginBottom: 20 },
  dateText: { color: colors.text, fontSize: 16 },
  toggleContainer: { flexDirection: 'row', marginBottom: 30, backgroundColor: colors.cardElevated, borderRadius: 8, padding: 4 },
  toggleBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 6 },
  toggleActivePresent: { backgroundColor: colors.success },
  toggleActiveAbsent: { backgroundColor: colors.danger },
  toggleText: { color: '#fff', fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.textSecondary },
  submitButton: { backgroundColor: colors.primary },
  cancelButtonText: { color: colors.text, fontWeight: 'bold' },
  submitButtonText: { color: '#fff', fontWeight: 'bold' }
});
