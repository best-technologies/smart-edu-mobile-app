import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubjectPagination } from './types';

interface PaginationProps {
  pagination: SubjectPagination;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <View className="flex-row items-center justify-center gap-2">
      {/* Previous Button */}
      <TouchableOpacity
        onPress={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className={`h-10 w-10 items-center justify-center rounded-lg ${
          hasPrev 
            ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
            : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        <Ionicons 
          name="chevron-back" 
          size={20} 
          color={hasPrev ? "#6B7280" : "#9CA3AF"} 
        />
      </TouchableOpacity>

      {/* Page Numbers */}
      {getPageNumbers().map((pageNum, index) => (
        <React.Fragment key={index}>
          {pageNum === '...' ? (
            <Text className="text-gray-500 dark:text-gray-400 px-2">...</Text>
          ) : (
            <TouchableOpacity
              onPress={() => onPageChange(pageNum as number)}
              className={`h-10 w-10 items-center justify-center rounded-lg ${
                page === pageNum
                  ? 'bg-blue-600'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  page === pageNum
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {pageNum}
              </Text>
            </TouchableOpacity>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <TouchableOpacity
        onPress={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className={`h-10 w-10 items-center justify-center rounded-lg ${
          hasNext 
            ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
            : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={hasNext ? "#6B7280" : "#9CA3AF"} 
        />
      </TouchableOpacity>
    </View>
  );
}

export default Pagination;
