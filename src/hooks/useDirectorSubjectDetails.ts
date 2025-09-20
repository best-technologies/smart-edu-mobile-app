import { useQuery } from '@tanstack/react-query';
import { TeacherService } from '../services/api/roleServices';
import { SubjectDetailsData } from '../roles/teacher/screens/components/subjects/types';

interface UseDirectorSubjectDetailsOptions {
  subjectId: string;
  enabled?: boolean;
}

export const useDirectorSubjectDetails = ({ subjectId, enabled = true }: UseDirectorSubjectDetailsOptions) => {
  const teacherService = new TeacherService();
  
  return useQuery<SubjectDetailsData>({
    queryKey: ['director-subject-details', subjectId],
    queryFn: async () => {
      const response = await teacherService.getSubjectDetails(subjectId, 1, 10);
      return response.data;
    },
    enabled: enabled && !!subjectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
