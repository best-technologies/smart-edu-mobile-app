import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentTabs from './StudentTabs';
import StudentSubjectDetailsScreen from './screens/StudentSubjectDetailsScreen';
import StudentVideoScreen from './screens/StudentVideoScreen';
import AssessmentInstructionsScreen from './screens/AssessmentInstructionsScreen';
import AssessmentTakingScreen from './screens/AssessmentTakingScreen';
import AssessmentResultsScreen from './screens/AssessmentResultsScreen';
import { AIChatScreen, AIChatMainScreen, ChatWithExistingScreen } from '@/screens/ai-chat';
import StudentAttendanceHistoryScreen from '@/components/attendance/StudentAttendanceHistoryScreen';

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
  AssessmentInstructions: {
    assessment: any;
  };
  AssessmentTaking: {
    assessmentId: string;
    assessmentTitle: string;
  };
  AssessmentResults: {
    assessmentId: string;
    assessmentTitle: string;
  };
  AIChatMain: undefined;
  ChatWithExisting: undefined;
  AIChat: {
    materialTitle?: string;
    materialDescription?: string;
    materialUrl?: string;
    documentId?: string;
    documentTitle?: string;
    documentUrl?: string;
    fileType?: string;
    processingStatus?: string;
  };
  StudentAttendanceHistory: { student: any; role: string };
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
      <Stack.Screen name="AssessmentInstructions" component={AssessmentInstructionsScreen} />
      <Stack.Screen name="AssessmentTaking" component={AssessmentTakingScreen} />
      <Stack.Screen name="AssessmentResults" component={AssessmentResultsScreen} />
      <Stack.Screen name="AIChatMain" component={AIChatMainScreen} />
      <Stack.Screen name="ChatWithExisting" component={ChatWithExistingScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
      <Stack.Screen name="StudentAttendanceHistory" component={StudentAttendanceHistoryScreen} />
    </Stack.Navigator>
  );
}
