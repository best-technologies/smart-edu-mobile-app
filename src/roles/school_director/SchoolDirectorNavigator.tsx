import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SchoolDirectorTabs from './SchoolDirectorTabs';
import AllStudentsListScreen from './screens/students/AllStudentsListScreen';
import AllTeachersListScreen from './screens/teachers/AllTeachersListScreen';

export type SchoolDirectorStackParamList = {
  SchoolDirectorTabs: undefined;
  AllStudentsList: undefined;
  AllTeachersList: undefined;
};

const Stack = createNativeStackNavigator<SchoolDirectorStackParamList>();

export default function SchoolDirectorNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SchoolDirectorTabs" component={SchoolDirectorTabs} />
      <Stack.Screen name="AllStudentsList" component={AllStudentsListScreen} />
      <Stack.Screen name="AllTeachersList" component={AllTeachersListScreen} />
    </Stack.Navigator>
  );
}
