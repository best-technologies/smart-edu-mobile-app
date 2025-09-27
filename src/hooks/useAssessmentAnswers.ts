import { useQuery } from '@tanstack/react-query';
import { StudentService } from '@/services/api/roleServices';
import { AssessmentAnswersResponse } from '@/services/types/apiTypes';
import { mockAssessmentAnswersResponse } from '@/mock/assessments';

const studentService = new StudentService();

export const useAssessmentAnswers = (assessmentId: string) => {
  return useQuery<AssessmentAnswersResponse>({
    queryKey: ['assessmentAnswers', assessmentId],
    queryFn: async () => {
      // Use mock data for mock assessments
      if (assessmentId.startsWith('mock-assessment-')) {
        return mockAssessmentAnswersResponse;
      }
      return studentService.getAssessmentAnswers(assessmentId);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - assessment answers rarely change
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache longer
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    enabled: !!assessmentId, // Only run if assessmentId exists
  });
};
