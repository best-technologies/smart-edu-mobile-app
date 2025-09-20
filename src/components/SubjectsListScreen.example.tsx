// Example usage of the global SubjectsListScreen component

import React, { useState, useEffect } from 'react';
import { SubjectsListScreen, Subject, AvailableClass } from '@/components';

// Example: Teacher's Subjects Screen
export function TeacherSubjectsExample() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setAvailableClasses] = useState<AvailableClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubjectPress = (subject: Subject) => {
    console.log('Navigate to subject detail:', subject.name);
    // navigation.navigate('SubjectDetail', { subject });
  };

  const handleSubjectEdit = (subject: Subject) => {
    console.log('Edit subject:', subject.name);
    // Open edit modal or navigate to edit screen
  };

  const handleSubjectManage = (subject: Subject) => {
    console.log('Manage subject content:', subject.name);
    // Navigate to content management screen
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Fetch subjects data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    console.log('Search subjects:', query);
    // Implement search logic
  };

  const handleClassFilter = (classId: string | null) => {
    console.log('Filter by class:', classId);
    // Implement class filtering
  };

  return (
    <SubjectsListScreen
      // Data
      subjects={subjects}
      classes={classes}
      isLoading={isLoading}
      
      // Actions
      onSubjectPress={handleSubjectPress}
      onSubjectEdit={handleSubjectEdit}
      onSubjectManage={handleSubjectManage}
      onRefresh={handleRefresh}
      onSearch={handleSearch}
      onClassFilter={handleClassFilter}
      
      // Configuration
      userRole="teacher"
      showStats={true}
      showClasses={true}
      showSearch={true}
      showFilters={true}
      enableEdit={true}
      enableManage={true}
      
      // UI customization
      title="My Subjects"
      subtitle="Manage your teaching subjects"
    />
  );
}

// Example: Director's All Subjects Screen
export function DirectorAllSubjectsExample() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setAvailableClasses] = useState<AvailableClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubjectPress = (subject: Subject) => {
    console.log('Navigate to subject detail:', subject.name);
    // navigation.navigate('SubjectDetail', { subject });
  };

  const handleSubjectEdit = (subject: Subject) => {
    console.log('Edit subject:', subject.name);
    // Open edit modal
  };

  const handleSubjectManage = (subject: Subject) => {
    console.log('Manage subject:', subject.name);
    // Open management options
  };

  const handleBack = () => {
    console.log('Go back');
    // navigation.goBack();
  };

  return (
    <SubjectsListScreen
      // Data
      subjects={subjects}
      classes={classes}
      isLoading={isLoading}
      
      // Actions
      onSubjectPress={handleSubjectPress}
      onSubjectEdit={handleSubjectEdit}
      onSubjectManage={handleSubjectManage}
      onBack={handleBack}
      
      // Configuration
      userRole="director"
      showStats={false}
      showClasses={true}
      showSearch={true}
      showFilters={true}
      enableEdit={true}
      enableManage={true}
      showBackButton={true}
      
      // UI customization
      title="All Subjects"
      subtitle="Manage all subjects in your school"
    />
  );
}

// Example: Student's Subjects Screen
export function StudentSubjectsExample() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubjectPress = (subject: Subject) => {
    console.log('View subject:', subject.name);
    // navigation.navigate('SubjectDetail', { subject });
  };

  return (
    <SubjectsListScreen
      // Data
      subjects={subjects}
      isLoading={isLoading}
      
      // Actions
      onSubjectPress={handleSubjectPress}
      
      // Configuration
      userRole="student"
      showStats={false}
      showClasses={false}
      showSearch={true}
      showFilters={false}
      enableEdit={false}
      enableManage={false}
      showBackButton={true}
      
      // UI customization
      title="My Subjects"
      subtitle="View your enrolled subjects"
    />
  );
}

// Example: Custom configuration
export function CustomSubjectsExample() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  return (
    <SubjectsListScreen
      // Data
      subjects={subjects}
      
      // Actions
      onSubjectPress={(subject) => console.log('Custom action:', subject.name)}
      
      // Configuration - Minimal setup
      userRole="teacher"
      showStats={false}
      showClasses={false}
      showSearch={false}
      showFilters={false}
      showPagination={false}
      showRefresh={false}
      showLoadMore={false}
      enableEdit={false}
      enableManage={false}
      
      // UI customization
      title="Custom Subjects List"
      emptyStateTitle="No subjects available"
      emptyStateSubtitle="Check back later for new subjects"
      
      // Additional custom actions
      additionalActions={
        <div>
          <button>Custom Action 1</button>
          <button>Custom Action 2</button>
        </div>
      }
    />
  );
}
