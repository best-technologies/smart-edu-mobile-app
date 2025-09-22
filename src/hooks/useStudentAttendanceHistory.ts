import { useQuery } from '@tanstack/react-query';
import { TeacherService } from '@/services/api/roleServices';

const teacherService = new TeacherService();

interface UseStudentAttendanceHistoryParams {
  studentId: string;
  year?: number;
  month?: number;
  enabled?: boolean;
}

export const useStudentAttendanceHistory = ({
  studentId,
  year,
  month,
  enabled = true
}: UseStudentAttendanceHistoryParams) => {
  return useQuery({
    queryKey: ['studentAttendanceHistory', studentId, year, month],
    queryFn: () => teacherService.getStudentAttendanceHistory(studentId, year, month),
    enabled: enabled && !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
