import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentTabs from './StudentTabs';
import StudentSubjectDetailsScreen from './screens/StudentSubjectDetailsScreen';

export type StudentStackParamList = {
  StudentTabs: undefined;
  StudentSubjectDetails: { subject: any };
};

const Stack = createNativeStackNavigator<StudentStackParamList>();

export default function StudentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
      <Stack.Screen name="StudentSubjectDetails" component={StudentSubjectDetailsScreen} />
    </Stack.Navigator>
  );
}
