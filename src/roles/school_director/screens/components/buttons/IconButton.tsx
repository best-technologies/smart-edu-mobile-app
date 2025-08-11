import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function IconButton({ icon, accessibilityLabel }: { icon: keyof typeof Ionicons.glyphMap; accessibilityLabel: string }) {
  return (
    <TouchableOpacity accessibilityLabel={accessibilityLabel} activeOpacity={0.7} className="h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <Ionicons name={icon} size={20} color="#111827" />
    </TouchableOpacity>
  );
}

export default IconButton;


