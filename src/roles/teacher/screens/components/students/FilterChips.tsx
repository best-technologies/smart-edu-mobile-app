import React from 'react';
import { TouchableOpacity, Text, ScrollView } from 'react-native';

interface FilterChipsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterChips({ selectedFilter, onFilterChange }: FilterChipsProps) {
  const filters = [
    { id: 'all', label: 'All Students', count: 0 },
    { id: 'active', label: 'Active', count: 0 },
    { id: 'inactive', label: 'Inactive', count: 0 },
    { id: 'suspended', label: 'Suspended', count: 0 },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          onPress={() => onFilterChange(filter.id)}
          activeOpacity={0.7}
          className={`px-4 py-2 rounded-full border ${
            selectedFilter === filter.id
              ? 'bg-blue-500 border-blue-500'
              : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedFilter === filter.id
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default FilterChips;
