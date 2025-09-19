import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/api';
import { DirectorSubjectDetailsData } from '../services/types/apiTypes';

interface UseDirectorSubjectDetailsOptions {
  subjectId: string;
  enabled?: boolean;
}

export const useDirectorSubjectDetails = ({ subjectId, enabled = true }: UseDirectorSubjectDetailsOptions) => {
  return useQuery<DirectorSubjectDetailsData>({
    queryKey: ['director-subject-details', subjectId],
    queryFn: async () => {
      const response = await ApiService.director.getSubjectDetails(subjectId);
      return response.data;
    },
    enabled: enabled && !!subjectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
