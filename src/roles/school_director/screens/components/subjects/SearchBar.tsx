import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  isLoading?: boolean;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search subjects...", 
  initialValue = "",
  className = "",
  isLoading = false
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Memoize the search function to prevent infinite loops
  const debouncedSearch = useCallback((query: string) => {
    if (query.trim() === '') {
      setIsSearching(false);
      onSearch('');
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      onSearch(query);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [onSearch]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const cleanup = debouncedSearch(searchQuery);
    return cleanup;
  }, [searchQuery, debouncedSearch]);

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  // Only show loading when actively searching, not when main data is loading
  const showLoading = isSearching && searchQuery.trim() !== '';

  return (
    <View className={`relative ${className}`}>
      <View className={`flex-row items-center bg-white dark:bg-gray-800 rounded-xl border ${
        isFocused 
          ? 'border-blue-500 dark:border-blue-400' 
          : 'border-gray-200 dark:border-gray-700'
      } px-4 py-3`}>
        {showLoading ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : (
          <Ionicons 
            name="search-outline" 
            size={20} 
            color={isFocused ? "#3b82f6" : "#6b7280"} 
          />
        )}
        <TextInput
          className="flex-1 ml-3 text-gray-900 dark:text-gray-100 text-base"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading} // Only disable when main data is loading
        />
        {searchQuery.length > 0 && !showLoading && (
          <TouchableOpacity 
            onPress={clearSearch}
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
