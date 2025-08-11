import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelect'>;

const roles: Array<{ key: keyof RootStackParamList; label: string; route: keyof RootStackParamList }> = [
  { key: 'SchoolDirector', label: 'School Director', route: 'SchoolDirector' },
  { key: 'Student', label: 'Student', route: 'Student' },
  { key: 'Teacher', label: 'Teacher', route: 'Teacher' },
  { key: 'Developer', label: 'Developer', route: 'Developer' },
];

export default function RoleSelectScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black px-6">
      <View className="w-full max-w-md gap-4">
        <Text className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Select a Role</Text>
        {roles.map((r) => (
          <Pressable
            key={r.key as string}
            onPress={() => navigation.replace(r.route)}
            className="rounded-2xl bg-blue-600 active:bg-blue-700 px-5 py-4"
          >
            <Text className="text-white text-lg font-semibold text-center">{r.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

