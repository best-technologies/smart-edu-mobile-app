import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services';

interface Student {
  id: string;
  name: string;
  display_picture: string | null;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  student_id: string;
  roll_number: string;
}

interface ClassInfo {
  id: string;
  name: string;
  code: string;
  subject: string;
  teacher_name: string;
  room: string;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

interface ClassStudentsResponse {
  success: boolean;
  message: string;
  data: {
    class_info: ClassInfo;
    pagination: Pagination;
    students: Student[];
  };
}

interface UseClassStudentsParams {
  classId: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const useClassStudents = ({ 
  classId, 
  page = 1, 
  limit = 10, 
  enabled = true 
}: UseClassStudentsParams) => {
  return useQuery({
    queryKey: ['attendance', 'class-students', classId, page, limit],
    queryFn: async () => {
      const response = await ApiService.teacher.getClassStudents(classId, page, limit);
      return response.data as ClassStudentsResponse['data'];
    },
    enabled: enabled && !!classId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
