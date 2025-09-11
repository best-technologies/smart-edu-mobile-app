import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentTabs from './StudentTabs';
import StudentSubjectDetailsScreen from './screens/StudentSubjectDetailsScreen';
import StudentVideoScreen from './screens/StudentVideoScreen';
import AssessmentTakingScreen from './screens/AssessmentTakingScreen';

export type StudentStackParamList = {
  StudentTabs: undefined;
  StudentSubjectDetails: { subject: any };
  StudentVideoPlayer: {
    videoUri: string;
    videoTitle: string;
    videoDescription: string;
    topicTitle: string;
    topicDescription: string;
    topicInstructions: string;
    subjectName: string;
    subjectCode: string;
  };
  AssessmentTaking: {
    assessmentId: string;
    assessmentTitle: string;
  };
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
      <Stack.Screen name="StudentVideoPlayer" component={StudentVideoScreen} />
      <Stack.Screen name="AssessmentTaking" component={AssessmentTakingScreen} />
    </Stack.Navigator>
  );
}
