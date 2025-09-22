import { useQuery } from '@tanstack/react-query';
import { TeacherService } from '@/services/api/roleServices';

const teacherService = new TeacherService();

export const useAttendanceForDate = (classId: string, date: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['attendance', classId, date],
    queryFn: () => teacherService.getAttendanceForDate(classId, date),
    enabled: enabled && !!classId && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
