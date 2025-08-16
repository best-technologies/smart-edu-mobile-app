import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  isLoading?: boolean;
  debounceMs?: number;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search subjects...", 
  initialValue = "",
  className = "",
  isLoading = false,
  debounceMs = 500
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Improved debounced search with proper cleanup
  const debouncedSearch = useCallback((query: string) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    // If query is empty, search immediately
    if (query.trim() === '') {
      setIsSearching(false);
      onSearch('');
      return;
    }

    // Set loading state
    setIsSearching(true);

    // Create new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      onSearch(query);
      setIsSearching(false);
      debounceTimeoutRef.current = null;
    }, debounceMs);
  }, [onSearch, debounceMs]);

  // Debounce search when query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
    
    // Cleanup function to clear timeout on unmount or dependency change
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, [searchQuery, debouncedSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, []);

  const clearSearch = () => {
    // Clear the timeout if it exists
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    
    setSearchQuery('');
    setIsSearching(false);
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
