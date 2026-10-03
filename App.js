import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity, LogBox } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Home from './components/Home';
import AttendanceDashboard from './components/AttendanceDashboard';
import RecordAttendanceForm from './components/RecordAttendanceForm';
import GradePlannerList from './components/GradePlannerList';
import GradePlannerDetails from './components/GradePlannerDetails';
import { colors } from './theme';

LogBox.ignoreLogs(['DateTimePicker: `onChange` is deprecated']);

const defaultAssessments = (isZeroed = false) => [
  { id: 'a1', name: 'Quizzes', weightage: 10, subItems: [{id:'sq1', name:'Quiz 1', total: 10, obtained: isZeroed ? 0 : 8}, {id:'sq2', name:'Quiz 2', total: 10, obtained: isZeroed ? 0 : 9}] },
  { id: 'a2', name: 'Assignments', weightage: 10, subItems: [{id:'sa1', name:'Assignment 1', total: 10, obtained: isZeroed ? 0 : 8}, {id:'sa2', name:'Assignment 2', total: 10, obtained: isZeroed ? 0 : 9}] },
  { id: 'a3', name: 'Sessionals', weightage: 30, subItems: [{id:'ss1', name:'Sessional 1', total: 15, obtained: isZeroed ? 0 : 12}, {id:'ss2', name:'Sessional 2', total: 15, obtained: isZeroed ? 0 : 14}] },
  { id: 'a4', name: 'Class Participation', weightage: 5, subItems: [{id:'cp1', name:'CP', total: 5, obtained: isZeroed ? 0 : 4}] },
  { id: 'a5', name: 'Project', weightage: 10, subItems: [{id:'p1', name:'Project', total: 50, obtained: isZeroed ? 0 : 45}] },
  { id: 'a6', name: 'Final Exam', weightage: 35, subItems: [{id:'f1', name:'Final', total: 100, obtained: isZeroed ? 0 : 75}] },
];

const failingAssessments = [
  { id: 'a1', name: 'Quizzes', weightage: 10, subItems: [{id:'sq1', name:'Quiz 1', total: 10, obtained: 4}] },
  { id: 'a2', name: 'Assignments', weightage: 10, subItems: [{id:'sa1', name:'Assignment 1', total: 10, obtained: 4}] },
  { id: 'a3', name: 'Sessionals', weightage: 30, subItems: [{id:'ss1', name:'Sessional 1', total: 15, obtained: 5}, {id:'ss2', name:'Sessional 2', total: 15, obtained: 6}] },
  { id: 'a4', name: 'Class Participation', weightage: 5, subItems: [{id:'cp1', name:'CP', total: 5, obtained: 2}] },
  { id: 'a5', name: 'Project', weightage: 10, subItems: [{id:'p1', name:'Project', total: 50, obtained: 20}] },
  { id: 'a6', name: 'Final Exam', weightage: 35, subItems: [{id:'f1', name:'Final', total: 100, obtained: 30}] },
];

const scalingPassAssessments = [
  { id: 'a1', name: 'Quizzes', weightage: 10, subItems: [{id:'sq1', name:'Quiz 1', total: 10, obtained: 6}] },
  { id: 'a2', name: 'Assignments', weightage: 10, subItems: [{id:'sa1', name:'Assignment 1', total: 10, obtained: 5}] },
  { id: 'a3', name: 'Sessionals', weightage: 30, subItems: [{id:'ss1', name:'Sessional 1', total: 15, obtained: 7}, {id:'ss2', name:'Sessional 2', total: 15, obtained: 6}] },
  { id: 'a4', name: 'Class Participation', weightage: 5, subItems: [{id:'cp1', name:'CP', total: 5, obtained: 3}] },
  { id: 'a5', name: 'Project', weightage: 10, subItems: [{id:'p1', name:'Project', total: 50, obtained: 25}] },
  { id: 'a6', name: 'Final Exam', weightage: 35, subItems: [{id:'f1', name:'Final', total: 100, obtained: 40}] },
];

export default function App() {
  const [courses, setCourses] = useState([
    { id: '1', name: 'Information Security', code: 'CS405', totalClasses: 20, attendedClasses: 18, recentRecords: [], assessments: defaultAssessments(false), scaling: { type: 'none', value: 0 }, predictEnabled: false },
    { id: '2', name: 'Parallel and Distributed computing', code: 'CS415', totalClasses: 20, attendedClasses: 15, recentRecords: [], assessments: failingAssessments, scaling: { type: 'none', value: 0 }, predictEnabled: false },
    { id: '3', name: 'Software for Mobile Devices', code: 'CS412', totalClasses: 20, attendedClasses: 19, recentRecords: [], assessments: scalingPassAssessments, scaling: { type: 'factor', value: 1.1 }, predictEnabled: false },
    { id: '4', name: 'Natural Language Processing', code: 'CS311', totalClasses: 20, attendedClasses: 17, recentRecords: [], assessments: defaultAssessments(false), scaling: { type: 'none', value: 0 }, predictEnabled: false },
    { id: '5', name: 'Final Year Project - I', code: 'FYP401', totalClasses: 20, attendedClasses: 20, recentRecords: [], assessments: defaultAssessments(true), scaling: { type: 'none', value: 0 }, predictEnabled: false },
  ]);

  const [currentView, setCurrentView] = useState('Home'); 
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const renderView = () => {
    switch (currentView) {
      case 'Home':
        return <Home onSelectModule={setCurrentView} />;
      case 'AttendanceDashboard':
        return <AttendanceDashboard courses={courses} onAddAttendance={() => setCurrentView('RecordAttendance')} />;
      case 'RecordAttendance':
        return <RecordAttendanceForm courses={courses} onCancel={() => setCurrentView('AttendanceDashboard')} setCourses={setCourses} onSubmit={() => setCurrentView('AttendanceDashboard')} />;
      case 'GradePlannerList':
        return <GradePlannerList courses={courses} onCourseSelect={(id) => { setSelectedCourseId(id); setCurrentView('GradePlannerDetails'); }} />;
      case 'GradePlannerDetails':
        return <GradePlannerDetails course={selectedCourse} setCourses={setCourses} />;
      default:
        return <Home onSelectModule={setCurrentView} />;
    }
  };

  const handleBack = () => {
    if (currentView === 'RecordAttendance') setCurrentView('AttendanceDashboard');
    else if (currentView === 'GradePlannerDetails') setCurrentView('GradePlannerList');
    else setCurrentView('Home');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        
        {currentView !== 'Home' && (
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{
              currentView === 'AttendanceDashboard' || currentView === 'RecordAttendance' ? 'Attendance' : 'Grade Planner'
            }</Text>
            <View style={{width: 60}} />
          </View>
        )}

        <View style={styles.content}>
          {renderView()}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: 16,
    paddingTop: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 80 },
  backButtonText: { color: colors.primary, fontSize: 16, marginLeft: 4 },
  content: { flex: 1 }
});
