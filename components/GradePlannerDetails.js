import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function GradePlannerDetails({ course, setCourses }) {
  if (!course) return null;

  const [expandedAssessments, setExpandedAssessments] = useState({});
  const [newAssName, setNewAssName] = useState('');
  const [newAssWeightage, setNewAssWeightage] = useState('');

  const toggleExpand = (id) => setExpandedAssessments(p => ({...p, [id]: !p[id]}));

  const updateCourse = (newCourse) => {
    setCourses(prev => prev.map(c => c.id === course.id ? newCourse : c));
  };

  const updateSubItem = (assessmentId, subItemId, field, value) => {
    const newAssessments = course.assessments.map(a => {
      if (a.id !== assessmentId) return a;
      return {
        ...a,
        subItems: a.subItems.map(si => si.id === subItemId ? { ...si, [field]: value } : si)
      };
    });
    updateCourse({ ...course, assessments: newAssessments });
  };

  const addSubItem = (assessmentId) => {
    const newAssessments = course.assessments.map(a => {
      if (a.id !== assessmentId) return a;
      const newItem = { id: Math.random().toString(), name: `Item ${a.subItems.length + 1}`, total: 10, obtained: 0 };
      return { ...a, subItems: [...a.subItems, newItem] };
    });
    updateCourse({ ...course, assessments: newAssessments });
  };

  const deleteSubItem = (assessmentId, subItemId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
          const newAssessments = course.assessments.map(a => {
            if (a.id !== assessmentId) return a;
            return { ...a, subItems: a.subItems.filter(si => si.id !== subItemId) };
          });
          updateCourse({ ...course, assessments: newAssessments });
      }}
    ]);
  };

  const deleteAssessment = (assessmentId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this entire assessment?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
          updateCourse({ ...course, assessments: course.assessments.filter(a => a.id !== assessmentId) });
      }}
    ]);
  };

  const addNewAssessment = () => {
    if (!newAssName || !newAssWeightage) return;
    const w = parseFloat(newAssWeightage) || 0;
    const newItem = { 
      id: Math.random().toString(), 
      name: newAssName, 
      weightage: w, 
      subItems: [{id: Math.random().toString(), name: 'Item 1', total: 10, obtained: 0}] 
    };
    updateCourse({ ...course, assessments: [...course.assessments, newItem] });
    setNewAssName('');
    setNewAssWeightage('');
  };

  const updateScaling = (type, value) => {
    let strVal = String(value);
    if (type === 'factor' && parseFloat(strVal) > 1.25) {
      strVal = '1.25';
    }
    updateCourse({ ...course, scaling: { type, value: strVal } });
  };

  // Calculations
  const totalWeightage = course.assessments.reduce((sum, a) => sum + (parseFloat(a.weightage) || 0), 0);
  const isWeightageValid = Math.abs(totalWeightage - 100) < 0.1;

  // Check if every assessment has at least one subItem
  const allHaveItems = course.assessments.every(a => a.subItems.length > 0);
  const canPredict = isWeightageValid && allHaveItems;

  let totalAbsolute = 0;
  course.assessments.forEach(a => {
    const subTotalTotal = a.subItems.reduce((s, si) => s + (parseFloat(si.total) || 0), 0);
    const subTotalObtained = a.subItems.reduce((s, si) => s + (parseFloat(si.obtained) || 0), 0);
    const w = parseFloat(a.weightage) || 0;
    
    let absoluteContribution = 0;
    if (subTotalTotal > 0) {
      absoluteContribution = (subTotalObtained / subTotalTotal) * w;
    }
    totalAbsolute += absoluteContribution;
  });

  let scaledAbsolute = totalAbsolute;
  const scalingVal = parseFloat(course.scaling.value) || 0;
  if (course.scaling.type === 'factor') {
    scaledAbsolute = totalAbsolute * scalingVal;
  } else if (course.scaling.type === 'fixed') {
    scaledAbsolute = totalAbsolute + scalingVal;
  }

  const isPassing = scaledAbsolute >= 50;

  // Failing suggestions
  let factorNeeded = 0;
  let fixedNeeded = 0;
  if (!isPassing) {
    if (totalAbsolute > 0) factorNeeded = (50 / totalAbsolute).toFixed(2);
    fixedNeeded = (50 - totalAbsolute).toFixed(2);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      {/* Overview Card */}
      <View style={styles.card}>
        <Text style={styles.courseName}>{course.name}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{scaledAbsolute.toFixed(2)} <Text style={{fontSize: 16, color: colors.textSecondary}}>/ 100</Text></Text>
          <View style={[styles.badge, { backgroundColor: isPassing ? colors.success + '30' : colors.danger + '30' }]}>
            <Text style={[styles.badgeText, { color: isPassing ? colors.success : colors.danger }]}>
              {isPassing ? 'PASS' : 'FAIL'}
            </Text>
          </View>
        </View>
        
        {!isWeightageValid && (
          <Text style={styles.warningText}>Warning: Overall weightage is {totalWeightage}, it should be 100.</Text>
        )}

        <View style={styles.predictToggleContainer}>
          <Text style={{color: colors.text, fontWeight: 'bold'}}>Predict Pass Requirement</Text>
          <Switch 
            value={course.predictEnabled} 
            onValueChange={(val) => updateCourse({...course, predictEnabled: val})}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        {course.predictEnabled && !canPredict && (
          <Text style={styles.warningText}>Predict requires overall weightage to be 100 and all assessments to have at least one item.</Text>
        )}

        {course.predictEnabled && canPredict && !isPassing && (
          <View style={styles.failSuggestions}>
            <Text style={{color: colors.text, fontWeight: 'bold', marginBottom: 8}}>Pass Requirements (from base score):</Text>
            
            {factorNeeded > 0 && factorNeeded <= 1.25 ? (
              <Text style={{color: colors.textSecondary, fontSize: 13, marginBottom: 4}}>
                • Apply a scaling factor of at least <Text style={{color: '#fff', fontWeight: 'bold'}}>{factorNeeded}</Text>
              </Text>
            ) : (
              <Text style={{color: colors.danger, fontSize: 13, marginBottom: 4}}>
                • A scaling factor will not be enough (requires > 1.25).
              </Text>
            )}

            <Text style={{color: colors.textSecondary, fontSize: 13}}>
              • OR add a fixed scaling of <Text style={{color: '#fff', fontWeight: 'bold'}}>+{fixedNeeded}</Text> absolute marks.
            </Text>
          </View>
        )}
      </View>

      {/* Scaling Controls */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Apply Scaling</Text>
        <View style={styles.row}>
          <View style={[styles.pickerContainer, {flex: 1, marginRight: 8}]}>
            <Picker
              selectedValue={course.scaling.type}
              onValueChange={(val) => updateScaling(val, course.scaling.value)}
              style={{color: colors.text}}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label="No Scaling" value="none" />
              <Picker.Item label="Factor (e.g. 1.25)" value="factor" />
              <Picker.Item label="Fixed (e.g. +5)" value="fixed" />
            </Picker>
          </View>
          {course.scaling.type !== 'none' && (
            <TextInput 
              style={[styles.input, {flex: 1}]}
              keyboardType="numeric"
              placeholder="Value"
              placeholderTextColor={colors.textSecondary}
              value={course.scaling.value ? String(course.scaling.value) : ''}
              onChangeText={(val) => updateScaling(course.scaling.type, val)}
            />
          )}
        </View>
      </View>

      {/* Assessments Accordion */}
      <Text style={[styles.sectionTitle, {marginLeft: 8, marginTop: 16}]}>Assessments</Text>
      {course.assessments.map(assessment => {
        const isExpanded = expandedAssessments[assessment.id];
        const w = parseFloat(assessment.weightage) || 0;
        const subTotalTotal = assessment.subItems.reduce((s, si) => s + (parseFloat(si.total) || 0), 0);
        const subTotalObtained = assessment.subItems.reduce((s, si) => s + (parseFloat(si.obtained) || 0), 0);
        
        let absoluteScore = 0;
        if (subTotalTotal > 0) absoluteScore = (subTotalObtained / subTotalTotal) * w;

        return (
          <View key={assessment.id} style={styles.assessmentCard}>
            <TouchableOpacity style={styles.assessmentHeader} onPress={() => toggleExpand(assessment.id)}>
              <View style={{flex: 1}}>
                <Text style={styles.assessmentName}>{assessment.name} ({w}%)</Text>
                <Text style={styles.assessmentSubtitle}>Score: {absoluteScore.toFixed(2)} / {w}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} style={{marginLeft: 8}} />
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.assessmentBody}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 12}}>
                  <Text style={{color: colors.textSecondary, flex: 1}}>Overall Weightage (%):</Text>
                  <TextInput 
                    style={[styles.input, {flex: 1, padding: 8, textAlign: 'center'}]} 
                    keyboardType="numeric"
                    value={String(assessment.weightage)}
                    onChangeText={(val) => {
                      updateCourse({...course, assessments: course.assessments.map(a => a.id === assessment.id ? {...a, weightage: val} : a)});
                    }}
                  />
                </View>
                
                <View style={styles.subItemHeader}>
                  <Text style={[styles.colHeader, {flex: 2}]}>Item</Text>
                  <Text style={[styles.colHeader, {flex: 1, textAlign: 'center'}]}>Obt.</Text>
                  <Text style={[styles.colHeader, {flex: 1, textAlign: 'center'}]}>Total</Text>
                </View>

                {assessment.subItems.map(si => (
                  <View key={si.id} style={styles.subItemRow}>
                    <Text style={[styles.subItemName, {flex: 2}]} numberOfLines={1}>{si.name}</Text>
                    <TextInput 
                      style={[styles.input, {flex: 1, marginRight: 8, textAlign: 'center', padding: 8}]}
                      keyboardType="numeric"
                      value={String(si.obtained)}
                      onChangeText={(val) => updateSubItem(assessment.id, si.id, 'obtained', val)}
                    />
                    <TextInput 
                      style={[styles.input, {flex: 1, textAlign: 'center', padding: 8}]}
                      keyboardType="numeric"
                      value={String(si.total)}
                      onChangeText={(val) => updateSubItem(assessment.id, si.id, 'total', val)}
                    />
                    <TouchableOpacity onPress={() => deleteSubItem(assessment.id, si.id)} style={{marginLeft: 8, padding: 4}}>
                      <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8}}>
                  <TouchableOpacity style={styles.addSubItemBtn} onPress={() => addSubItem(assessment.id)}>
                    <Ionicons name="add" size={16} color={colors.primary} />
                    <Text style={{color: colors.primary, fontWeight: 'bold', marginLeft: 4}}>Add Item</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => deleteAssessment(assessment.id)} style={{padding: 8}}>
                    <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );
      })}

      {/* Add New Assessment */}
      <View style={[styles.card, {marginTop: 16}]}>
        <Text style={styles.sectionTitle}>Add New Assessment</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput 
            style={[styles.input, {flex: 2, marginRight: 8}]} 
            placeholder="Name (e.g. Midterm)"
            placeholderTextColor={colors.textSecondary}
            value={newAssName}
            onChangeText={setNewAssName}
          />
          <TextInput 
            style={[styles.input, {flex: 1, marginRight: 8}]} 
            placeholder="Weight (%)"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
            value={newAssWeightage}
            onChangeText={setNewAssWeightage}
          />
          <TouchableOpacity style={styles.addAssBtn} onPress={addNewAssessment}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { backgroundColor: colors.card, padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  courseName: { color: colors.textSecondary, fontSize: 14, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontWeight: 'bold' },
  warningText: { color: colors.warning, fontSize: 12, marginTop: 8 },
  predictToggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 },
  failSuggestions: { marginTop: 16, backgroundColor: 'rgba(255, 69, 58, 0.1)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.danger + '40' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  pickerContainer: { backgroundColor: colors.cardElevated, borderRadius: 8, overflow: 'hidden' },
  input: { backgroundColor: colors.cardElevated, color: colors.text, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  assessmentCard: { backgroundColor: colors.card, borderRadius: 12, marginBottom: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  assessmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  assessmentName: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  assessmentSubtitle: { color: colors.primary, fontSize: 12, marginTop: 2 },
  assessmentBody: { padding: 16, paddingTop: 0, borderTopWidth: 1, borderTopColor: colors.border },
  subItemHeader: { flexDirection: 'row', marginBottom: 8, marginTop: 8 },
  colHeader: { color: colors.textSecondary, fontSize: 12, fontWeight: 'bold' },
  subItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  subItemName: { color: colors.text, fontSize: 14 },
  addSubItemBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, marginTop: 8, backgroundColor: colors.cardElevated, borderRadius: 8 },
  addAssBtn: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }
});
