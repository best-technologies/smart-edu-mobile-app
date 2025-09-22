import { useMutation } from '@tanstack/react-query';
import { TeacherService } from '@/services/api/roleServices';

const teacherService = new TeacherService();

interface UpdateAttendanceData {
  class_id: string;
  date: string;
  attendance_records: Array<{
    student_id: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL';
    reason?: string;
    is_excused?: boolean;
    excuse_note?: string;
  }>;
  notes?: string;
}

export const useUpdateAttendance = () => {
  return useMutation({
    mutationFn: (data: UpdateAttendanceData) => {
      console.log('useUpdateAttendance: mutationFn called with data:', data);
      return teacherService.updateAttendance(data);
    },
    onSuccess: (response) => {
      console.log('useUpdateAttendance: Success - Attendance updated successfully:', response);
    },
    onError: (error) => {
      console.error('useUpdateAttendance: Error - Failed to update attendance:', error);
    },
    onMutate: (variables) => {
      console.log('useUpdateAttendance: onMutate called with variables:', variables);
    },
  });
};
