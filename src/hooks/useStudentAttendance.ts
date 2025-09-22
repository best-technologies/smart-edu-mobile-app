import { useQuery } from '@tanstack/react-query';
import { StudentService } from '@/services/api/roleServices';

const studentService = new StudentService();

interface UseStudentAttendanceParams {
  year?: number;
  month?: number;
  enabled?: boolean;
}

export const useStudentAttendance = ({
  year,
  month,
  enabled = true
}: UseStudentAttendanceParams) => {
  return useQuery({
    queryKey: ['studentAttendance', year, month],
    queryFn: () => studentService.getAttendanceHistory(year, month),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
