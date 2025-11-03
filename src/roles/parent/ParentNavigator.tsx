import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParentTabs from './ParentTabs';
import { AIChatScreen, AIChatMainScreen, ChatWithExistingScreen } from '@/screens/ai-chat';
import StudentAttendanceHistoryScreen from '@/components/attendance/StudentAttendanceHistoryScreen';

export type ParentStackParamList = {
  ParentTabs: undefined;
  ChildDetail: { child: any };
  ReportDetail: { report: any };
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

const Stack = createNativeStackNavigator<ParentStackParamList>();

export default function ParentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ParentTabs" component={ParentTabs} />
      <Stack.Screen name="AIChatMain" component={AIChatMainScreen} />
      <Stack.Screen name="ChatWithExisting" component={ChatWithExistingScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
      <Stack.Screen name="StudentAttendanceHistory" component={StudentAttendanceHistoryScreen} />
    </Stack.Navigator>
  );
}

