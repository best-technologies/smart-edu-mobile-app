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
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
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

  return (
    <View className="flex-row items-center justify-between bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      {/* Page Info */}
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        Page {page} of {totalPages}
      </Text>

      {/* Pagination Controls */}
      <View className="flex-row items-center gap-2">
        {/* Previous Button */}
        <TouchableOpacity
          onPress={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          activeOpacity={0.7}
          className={`h-8 w-8 items-center justify-center rounded-lg ${
            hasPrev 
              ? 'bg-gray-100 dark:bg-gray-800' 
              : 'bg-gray-50 dark:bg-gray-900'
          }`}
        >
          <Ionicons 
            name="chevron-back" 
            size={16} 
            color={hasPrev ? '#6b7280' : '#9ca3af'} 
          />
        </TouchableOpacity>

        {/* Page Numbers */}
        <View className="flex-row items-center gap-1">
          {getPageNumbers().map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <Text className="text-gray-400 dark:text-gray-500 px-2">...</Text>
              ) : (
                <TouchableOpacity
                  onPress={() => onPageChange(pageNum as number)}
                  activeOpacity={0.7}
                  className={`h-8 w-8 items-center justify-center rounded-lg ${
                    pageNum === page
                      ? 'bg-blue-500'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Text 
                    className={`text-sm font-medium ${
                      pageNum === page
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
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => onPageChange(page + 1)}
          disabled={!hasNext}
          activeOpacity={0.7}
          className={`h-8 w-8 items-center justify-center rounded-lg ${
            hasNext 
              ? 'bg-gray-100 dark:bg-gray-800' 
              : 'bg-gray-50 dark:bg-gray-900'
          }`}
        >
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={hasNext ? '#6b7280' : '#9ca3af'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Pagination;
