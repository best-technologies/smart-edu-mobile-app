import { useQuery } from '@tanstack/react-query';
import { StudentService } from '@/services/api/roleServices';
import { AssessmentQuestionsResponse } from '@/services/types/apiTypes';
import { mockAssessmentQuestionsResponse } from '@/mock/assessments';

const studentService = new StudentService();

export const useAssessmentQuestions = (assessmentId: string) => {
  return useQuery<AssessmentQuestionsResponse>({
    queryKey: ['assessmentQuestions', assessmentId],
    queryFn: async () => {
      // Use mock data for mock assessments
      if (assessmentId.startsWith('mock-assessment-')) {
        return mockAssessmentQuestionsResponse;
      }
      return studentService.getAssessmentQuestions(assessmentId);
    },
    staleTime: 0, // Always fetch fresh data for assessments
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!assessmentId, // Only run query if assessmentId is provided
  });
};
