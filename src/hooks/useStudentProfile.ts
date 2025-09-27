import { useQuery } from '@tanstack/react-query';
import { StudentService } from '@/services/api/roleServices';
import { StudentProfileResponse } from '@/services/types/apiTypes';

const studentService = new StudentService();

export const useStudentProfile = () => {
  return useQuery<StudentProfileResponse>({
    queryKey: ['studentProfile'],
    queryFn: () => studentService.getProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes - profile data doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};
