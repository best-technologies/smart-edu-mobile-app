import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';

type RoleSelectScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoleSelect'>;

export default function RoleSelectScreen() {
  const { user, logout } = useAuth();
  const { isAuthenticated, isLoading } = useAuthGuard();
  const navigation = useNavigation<RoleSelectScreenNavigationProp>();

  const handleRoleSelect = (role: string) => {
    switch (role) {
      case 'director':
        navigation.navigate('SchoolDirector');
        break;
      case 'teacher':
        navigation.navigate('Teacher');
        break;
      case 'student':
        navigation.navigate('Student');
        break;
      case 'developer':
        navigation.navigate('Developer');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Show loading or redirect if not authenticated
  if (isLoading || !isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <Text style={styles.subtitle}>Welcome, {user?.first_name} {user?.last_name}</Text>
      
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleRoleSelect('director')}
        >
          <Text style={styles.roleText}>School Director</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleRoleSelect('teacher')}
        >
          <Text style={styles.roleText}>Teacher</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleRoleSelect('student')}
        >
          <Text style={styles.roleText}>Student</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleRoleSelect('developer')}
        >
          <Text style={styles.roleText}>Developer</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  roleContainer: {
    width: '100%',
    maxWidth: 300,
  },
  roleButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  roleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 30,
    padding: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

