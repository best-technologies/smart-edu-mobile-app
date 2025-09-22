import { useMutation } from '@tanstack/react-query';
import { TeacherService } from '@/services/api/roleServices';

const teacherService = new TeacherService();

interface SubmitAttendanceData {
  class_id: string;
  date: string;
  session_type?: string;
  attendance_records: Array<{
    student_id: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL';
    reason?: string;
    is_excused?: boolean;
    excuse_note?: string;
  }>;
  notes?: string;
}

export const useSubmitAttendance = () => {
  return useMutation({
    mutationFn: (data: SubmitAttendanceData) => {
      console.log('useSubmitAttendance: mutationFn called with data:', data);
      return teacherService.submitAttendance(data);
    },
    onSuccess: (response) => {
      console.log('useSubmitAttendance: Success - Attendance submitted successfully:', response);
    },
    onError: (error) => {
      console.error('useSubmitAttendance: Error - Failed to submit attendance:', error);
    },
    onMutate: (variables) => {
      console.log('useSubmitAttendance: onMutate called with variables:', variables);
    },
  });
};
