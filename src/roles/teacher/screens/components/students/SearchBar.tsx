import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search..." }: SearchBarProps) {
  return (
    <View className="relative">
      <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
        <Ionicons name="search-outline" size={20} color="#6b7280" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-3 text-gray-900 dark:text-gray-100 text-base"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity 
            onPress={() => onChangeText('')}
            activeOpacity={0.7}
            className="ml-2"
          >
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default SearchBar;
