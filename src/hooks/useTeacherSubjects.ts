import { useState, useEffect, useCallback } from 'react';
import { SubjectsResponse, Subject, SubjectPagination } from '@/roles/teacher/screens/components/subjects/types';
import { HttpClient } from '@/services/api/httpClient';

interface UseTeacherSubjectsReturn {
  subjects: Subject[];
  managedClasses: any[];
  teachingSubjects: any[];
  stats: any;
  academicSession: any;
  pagination: SubjectPagination | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  searchSubjects: (query: string) => void;
  filterByClass: (classId: string | undefined) => void;
  goToPage: (page: number) => void;
  filters: {
    search: string;
    classId?: string;
  };
}

export function useTeacherSubjects(): UseTeacherSubjectsReturn {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [managedClasses, setManagedClasses] = useState<any[]>([]);
  const [teachingSubjects, setTeachingSubjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [academicSession, setAcademicSession] = useState<any>(null);
  const [pagination, setPagination] = useState<SubjectPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    classId: undefined as string | undefined,
  });

  const httpClient = new HttpClient();

  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await httpClient.makeRequest<SubjectsResponse>('/teachers/subjects-dashboard', 'GET');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const { data } = response.data;
      
      setSubjects(data.subjects || []);
      setManagedClasses(data.managedClasses || []);
      setTeachingSubjects(data.teachingSubjects || []);
      setStats(data.stats || {});
      setAcademicSession(data.academicSession || {});
      setPagination(data.pagination || null);

    } catch (err) {
      console.error('Error fetching teacher subjects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const searchSubjects = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

  const filterByClass = useCallback((classId: string | undefined) => {
    setFilters(prev => ({ ...prev, classId }));
  }, []);

  const goToPage = useCallback((page: number) => {
    // TODO: Implement pagination with backend
    console.log('Go to page:', page);
  }, []);

  // Filter subjects based on search and class filter
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = filters.search === '' || 
      subject.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      subject.code.toLowerCase().includes(filters.search.toLowerCase()) ||
      subject.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesClass = !filters.classId || 
      subject.classesTakingSubject.some(cls => cls.id === filters.classId);
    
    return matchesSearch && matchesClass;
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects: filteredSubjects,
    managedClasses,
    teachingSubjects,
    stats,
    academicSession,
    pagination,
    isLoading,
    error,
    refetch,
    searchSubjects,
    filterByClass,
    goToPage,
    filters,
  };
}
