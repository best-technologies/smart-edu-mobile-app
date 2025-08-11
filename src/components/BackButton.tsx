import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation<any>();
  const handlePress = () => {
    // Navigate to the parent stack's RoleSelect screen
    const parent = navigation.getParent?.();
    if (parent) {
      parent.navigate('RoleSelect');
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Pressable onPress={handlePress} hitSlop={10} style={{ paddingHorizontal: 8 }} accessibilityRole="button" accessibilityLabel="Back">
      <Ionicons name="chevron-back" size={28} color="#111827" />
    </Pressable>
  );
}

