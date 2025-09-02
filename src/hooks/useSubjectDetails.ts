import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TeacherService } from '@/services/api/roleServices';
import { 
  SubjectDetailsResponse, 
  SubjectDetailsData, 
  SubjectDetailsFilters 
} from '@/roles/teacher/screens/components/subjects/types';

interface UseSubjectDetailsProps {
  subjectId: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: SubjectDetailsFilters;
  enabled?: boolean;
}

export function useSubjectDetails({
  subjectId,
  page = 1,
  limit = 10,
  search = '',
  filters = {},
  enabled = true
}: UseSubjectDetailsProps) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(page);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [currentFilters, setCurrentFilters] = useState(filters);

  const teacherService = new TeacherService();

  const queryKey = [
    'subjectDetails',
    subjectId,
    currentPage,
    limit,
    currentSearch,
    currentFilters
  ];

  const {
    data: response,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey,
    queryFn: () => teacherService.getSubjectDetails(
      subjectId,
      currentPage,
      limit,
      currentSearch,
      currentFilters
    ),
    enabled: enabled && !!subjectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Extract data from response
  const data: SubjectDetailsData | null = response?.data || null;
  const subject = data?.subject || null;
  const topics = data?.topics || [];
  const pagination = data?.pagination || null;
  const stats = data?.stats || null;

  // Update search
  const updateSearch = useCallback((newSearch: string) => {
    setCurrentSearch(newSearch);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SubjectDetailsFilters>) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Update page
  const updatePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  // Reset to first page
  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Clear search and filters
  const clearFilters = useCallback(() => {
    setCurrentSearch('');
    setCurrentFilters({});
    setCurrentPage(1);
  }, []);

  // Invalidate and refetch
  const invalidateAndRefetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['subjectDetails', subjectId] });
    refetch();
  }, [queryClient, subjectId, refetch]);

  // Effect to update state when props change
  useEffect(() => {
    if (page !== currentPage) setCurrentPage(page);
    if (search !== currentSearch) setCurrentSearch(search);
    if (JSON.stringify(filters) !== JSON.stringify(currentFilters)) {
      setCurrentFilters(filters);
    }
  }, [page, search, filters, currentPage, currentSearch, currentFilters]);

  return {
    // Data
    data,
    subject,
    topics,
    pagination,
    stats,
    
    // State
    currentPage,
    currentSearch,
    currentFilters,
    
    // Loading states
    isLoading,
    isFetching,
    
    // Error
    error,
    
    // Actions
    updateSearch,
    updateFilters,
    updatePage,
    resetToFirstPage,
    clearFilters,
    refetch,
    invalidateAndRefetch,
  };
}
