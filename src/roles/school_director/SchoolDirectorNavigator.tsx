import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SchoolDirectorTabs from './SchoolDirectorTabs';
import AllStudentsListScreen from './screens/students/AllStudentsListScreen';
import AllTeachersListScreen from './screens/teachers/AllTeachersListScreen';
import AllSubjectsListScreen from './screens/subjects/AllSubjectsListScreen';
import NotificationsListScreen from './screens/notifications/NotificationsListScreen';
import NotificationDetailScreen from './screens/notifications/NotificationDetailScreen';
import { AIChatScreen, AIChatMainScreen, ChatWithExistingScreen } from '@/screens/ai-chat';

export type SchoolDirectorStackParamList = {
  SchoolDirectorTabs: undefined;
  AllStudentsList: undefined;
  AllTeachersList: undefined;
  AllSubjectsList: undefined;
  NotificationsList: undefined;
  NotificationDetail: { notification: any };
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
      <Stack.Screen name="AllSubjectsList" component={AllSubjectsListScreen} />
      <Stack.Screen name="NotificationsList" component={NotificationsListScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="AIChatMain" component={AIChatMainScreen} />
      <Stack.Screen name="ChatWithExisting" component={ChatWithExistingScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
    </Stack.Navigator>
  );
}
