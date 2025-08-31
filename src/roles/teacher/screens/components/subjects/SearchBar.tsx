import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = "Search subjects...", className = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <View className={`relative ${className}`}>
      <View className="flex-row items-center bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-3 text-gray-900 dark:text-gray-100 text-base"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default SearchBar;
