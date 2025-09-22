import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services';

interface ClassManaging {
  id: string;
  name: string;
  code: string;
  subject: string;
  teacher_name: string;
  room: string;
  total_students: number;
}

interface AcademicSession {
  academic_year: string;
  term: string;
  term_start_date: string;
  term_end_date: string;
  current_date: string;
  is_current: boolean;
}

interface AttendanceSessionResponse {
  success: boolean;
  message: string;
  data: {
    classes_managing: ClassManaging[];
    academic_sessions: AcademicSession[];
  };
}

export const useAttendanceSession = () => {
  return useQuery({
    queryKey: ['attendance', 'session-details'],
    queryFn: async () => {
      const response = await ApiService.teacher.getAttendanceSessionDetails();
      return response.data as AttendanceSessionResponse['data'];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
