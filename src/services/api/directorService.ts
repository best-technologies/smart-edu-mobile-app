import { HttpClient } from './httpClient';
import { ApiResponse } from '../types/apiTypes';

export interface ClassTeacher {
  id: string;
  first_name: string;
  last_name: string;
  display_picture: string | null;
}

export interface ClassData {
  id: string;
  name: string;
  classTeacher: ClassTeacher | null;
}

export interface TeacherData {
  id: string;
  first_name: string;
  last_name: string;
  display_picture: string | null;
  email: string;
  phone_number: string;
}

export interface ClassesAndTeachersResponse {
  classes: ClassData[];
  teachers: TeacherData[];
}

export interface DirectorDashboardData {
  basic_details: {
    email: string;
    school_id: string;
  };
  teachers: {
    totalTeachers: number;
    activeClasses: number;
    totalSubjects: number;
  };
  students: {
    totalStudents: number;
    activeStudents: number;
    suspendedStudents: number;
  };
  finance: {
    totalRevenue: number;
    outstandingFees: number;
    totalExpenses: number;
    netBalance: number;
  };
  ongoingClasses: Array<{
    className: string;
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    comingUpOn: string;
    createdAt: string;
  }>;
}

export interface TeachersData {
  basic_details: {
    totalTeachers: number;
    activeTeachers: number;
    maleTeachers: number;
    femaleTeachers: number;
  };
  pagination: {
    total_pages: number;
    current_page: number;
    total_results: number;
    results_per_page: number;
  };
  teachers: Array<{
    id: string;
    name: string;
    display_picture: string | null;
    contact: {
      phone: string;
      email: string;
    };
    totalSubjects: number;
    classTeacher: string;
    nextClass: {
      className: string;
      subject: string;
      startTime: string;
      endTime: string;
    } | null;
    status: 'active' | 'suspended';
  }>;
}

export interface SubjectTeacher {
  id: string;
  name: string;
  email: string;
}

export interface SubjectClass {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  class: SubjectClass | null;
  teachers: SubjectTeacher[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SubjectFilters {
  search: string | null;
  classId: string | null;
}

export interface SubjectsData {
  pagination: Pagination;
  filters: SubjectFilters;
  subjects: Subject[];
  availableClasses?: AvailableClass[];
}

export interface SubjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
}

export interface StudentsData {
  basic_details: {
    totalStudents: number;
    activeStudents: number;
    totalClasses: number;
  };
  pagination: {
    total_pages: number;
    current_page: number;
    total_results: number;
    results_per_page: number;
  };
  students: Student[];
  available_classes: AvailableClass[];
}

export interface AvailableClass {
  id: string;
  name: string;
  class_teacher: {
    id: string;
    name: string;
    email: string;
  };
  student_count: number;
}

export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  display_picture: string | null;
  gender: 'male' | 'female' | 'other';
  otp: string;
  otp_expires_at: string | null;
  is_email_verified: boolean;
  is_otp_verified: boolean;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  school_id: string;
  createdAt: string;
  updatedAt: string;
  classesEnrolled: StudentClass[];
  current_class: string;
  next_class: string;
  next_class_time: string | null;
  next_class_teacher: string | null;
  performance: StudentPerformance;
}

export interface StudentClass {
  id: string;
  name: string;
  schoolId: string;
  classTeacherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentPerformance {
  cgpa: number;
  term_average: number;
  improvement_rate: number;
  attendance_rate: number;
  position: number;
}

export interface StudentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  status?: string;
}

export interface TeachersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface EnrollTeacherPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: 'male' | 'female';
  status: 'active' | 'suspended';
}

export interface EnrollTeacherResponse {
  teacher: {
    id: string;
    school_id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    display_picture: string | null;
    gender: string;
    otp: string;
    otp_expires_at: string | null;
    is_email_verified: boolean;
    is_otp_verified: boolean;
    role: string;
    status: 'active' | 'suspended';
    createdAt: string;
    updatedAt: string;
  };
  generatedPassword: string;
}

export type EnrollTeacherApiResponse = ApiResponse<EnrollTeacherResponse>;

export type DirectorDashboardResponse = ApiResponse<DirectorDashboardData>;
export type TeachersResponse = ApiResponse<TeachersData>;
export type SubjectsResponse = ApiResponse<SubjectsData>;
export type StudentsResponse = ApiResponse<StudentsData>;

export interface ScheduleClass {
  classId: string;
  name: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  order: number;
}

export interface ScheduleSubject {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface ScheduleTeacher {
  id: string;
  name: string;
}

export interface ScheduleItem {
  timeSlotId: string;
  startTime: string;
  endTime: string;
  label: string;
  subject: ScheduleSubject | null;
  teacher: ScheduleTeacher | null;
  room: string | null;
}

export interface ScheduleData {
  class: ScheduleClass[];
  timeSlots: TimeSlot[];
  schedule: {
    MONDAY: ScheduleItem[];
    TUESDAY: ScheduleItem[];
    WEDNESDAY: ScheduleItem[];
    THURSDAY: ScheduleItem[];
    FRIDAY: ScheduleItem[];
  };
}

export interface ScheduleQueryParams {
  class?: string;
}

export type ScheduleResponse = ApiResponse<ScheduleData>;

class DirectorService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Fetch director dashboard data
   * This endpoint returns comprehensive dashboard statistics and data
   */
  async fetchDashboardData(): Promise<DirectorDashboardResponse> {
    try {
      const response = await this.httpClient.makeRequest<DirectorDashboardData>('/director/dashboard/fetch-dashboard-data');
      return response;
    } catch (error) {
      console.error('Error fetching director dashboard data:', error);
      throw error;
    }
  }

  /**
   * Fetch teachers data for the teachers screen with pagination and search
   */
  async fetchTeachersData(params?: TeachersQueryParams): Promise<TeachersResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);

      const url = `/director/teachers/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('🌐 Making API request to:', url);
      
      const response = await this.httpClient.makeRequest<TeachersData>(url);
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchTeachersData:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        params
      });
      throw error;
    }
  }

  /**
   * Enroll a new teacher
   */
  async enrollTeacher(payload: EnrollTeacherPayload): Promise<EnrollTeacherApiResponse> {
    try {
      console.log('🌐 Making API request to: /director/teachers');
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<EnrollTeacherResponse>(
        '/director/teachers',
        'POST',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in enrollTeacher:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }

  /**
   * Fetch students data for the students screen
   */
  async fetchStudentsData(params?: StudentsQueryParams): Promise<StudentsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.classId) queryParams.append('classId', params.classId);
      if (params?.status) queryParams.append('status', params.status);

      const url = `/director/students/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('🌐 Making API request to:', url);
      
      const response = await this.httpClient.makeRequest<StudentsData>(url);
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchStudentsData:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        params
      });
      throw error;
    }
  }

  /**
   * Fetch subjects data for the subjects screen with pagination and search
   */
  async fetchSubjectsData(params?: SubjectsQueryParams): Promise<SubjectsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.classId) queryParams.append('classId', params.classId);

      const url = `/director/subjects/fetch-all-subjects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('🌐 Making API request to:', url);
      
      const response = await this.httpClient.makeRequest<SubjectsData>(url);
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchSubjectsData:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        params
      });
      throw error;
    }
  }

  /**
   * Update subject details
   */
  async updateSubject(subjectId: string, payload: {
    subject_name?: string;
    description?: string;
    color?: string;
    code?: string;
    class_taking_it?: string;
    teachers_taking_it?: string[];
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to:', `/director/subjects/${subjectId}`);
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        `/director/subjects/${subjectId}`,
        'PATCH',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in updateSubject:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        subjectId,
        payload
      });
      throw error;
    }
  }

  /**
   * Fetch available teachers and classes for subject assignment
   */
  async fetchAvailableTeachersAndClasses(): Promise<ApiResponse<{
    teachers: Array<{
      id: string;
      name: string;
      display_picture: string | null;
    }>;
    classes: Array<{
      id: string;
      name: string;
    }>;
  }>> {
    try {
      console.log('🌐 Making API request to: /director/subjects/available-teachers-classes');
      
      const response = await this.httpClient.makeRequest<{
        teachers: Array<{
          id: string;
          name: string;
          display_picture: string | null;
        }>;
        classes: Array<{
          id: string;
          name: string;
        }>;
      }>('/director/subjects/available-teachers-classes');
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchAvailableTeachersAndClasses:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Fetch classes and subjects for teacher assignment
   */
  async fetchClassesAndSubjects(): Promise<ApiResponse<{
    classes: Array<{
      id: string;
      name: string;
      hasClassTeacher: boolean;
      classTeacher: any;
    }>;
    subjects: Array<{
      id: string;
      name: string;
    }>;
    totalClasses: number;
    totalSubjects: number;
  }>> {
    try {
      console.log('🌐 Making API request to: /director/teachers/classes-subjects');
      
      const response = await this.httpClient.makeRequest<{
        classes: Array<{
          id: string;
          name: string;
          hasClassTeacher: boolean;
          classTeacher: any;
        }>;
        subjects: Array<{
          id: string;
          name: string;
        }>;
        totalClasses: number;
        totalSubjects: number;
      }>('/director/teachers/classes-subjects');
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchClassesAndSubjects:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Fetch specific teacher's classes and subjects with assignments
   */
  async fetchTeacherClassesAndSubjects(teacherId: string): Promise<ApiResponse<{
    teacher: {
      id: string;
      name: string;
      email: string;
      display_picture: string | null;
    };
    assigned_subjects: Array<{
      id: string;
      name: string;
      code: string;
      color: string;
      description: string;
      assigned_class: {
        id: string;
        name: string;
      } | null;
    }>;
    managed_classes: Array<{
      id: string;
      name: string;
      student_count: number;
      subject_count: number;
    }>;
    available_subjects: Array<{
      id: string;
      name: string;
      code: string;
      color: string;
      description: string;
      assigned_class: {
        id: string;
        name: string;
      } | null;
    }>;
    available_classes: Array<{
      id: string;
      name: string;
      has_class_teacher: boolean;
      class_teacher: string | null;
      student_count: number;
      subject_count: number;
    }>;
    summary: {
      total_assigned_subjects: number;
      total_managed_classes: number;
      total_available_subjects: number;
      total_available_classes: number;
    };
  }>> {
    try {
      console.log('🌐 Making API request to:', `/director/teachers/${teacherId}/classes-subjects`);
      
      const response = await this.httpClient.makeRequest<{
        teacher: {
          id: string;
          name: string;
          email: string;
          display_picture: string | null;
        };
        assigned_subjects: Array<{
          id: string;
          name: string;
          code: string;
          color: string;
          description: string;
          assigned_class: {
            id: string;
            name: string;
          } | null;
        }>;
        managed_classes: Array<{
          id: string;
          name: string;
          student_count: number;
          subject_count: number;
        }>;
        available_subjects: Array<{
          id: string;
          name: string;
          code: string;
          color: string;
          description: string;
          assigned_class: {
            id: string;
            name: string;
          } | null;
        }>;
        available_classes: Array<{
          id: string;
          name: string;
          has_class_teacher: boolean;
          class_teacher: string | null;
          student_count: number;
          subject_count: number;
        }>;
        summary: {
          total_assigned_subjects: number;
          total_managed_classes: number;
          total_available_subjects: number;
          total_available_classes: number;
        };
      }>(`/director/teachers/${teacherId}/classes-subjects`);
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchTeacherClassesAndSubjects:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        teacherId
      });
      throw error;
    }
  }

  /**
   * Fetch teacher details with current assignments
   */
  async fetchTeacherDetails(teacherId: string): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to:', `/director/teachers/${teacherId}`);
      
      const response = await this.httpClient.makeRequest<any>(`/director/teachers/${teacherId}`);
      
      console.log('📧 Teacher details response:', JSON.stringify(response, null, 2));
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchTeacherDetails:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        teacherId
      });
      throw error;
    }
  }

  /**
   * Create a new subject
   */
  async createSubject(payload: {
    subject_name: string;
    code: string;
    description: string;
    color: string;
    class_taking_it?: string;
    teacher_taking_it?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/subjects');
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        '/director/subjects/create-subject',
        'POST',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in createSubject:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }

  /**
   * Update teacher details
   */
  async updateTeacher(teacherId: string, payload: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    display_picture?: string;
    status?: string;
    subjectsTeaching?: string[];
    classesManaging?: string[];
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to:', `/director/teachers/${teacherId}`);
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        `/director/teachers/${teacherId}`,
        'PATCH',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in updateTeacher:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        teacherId,
        payload
      });
      throw error;
    }
  }

  /**
   * Fetch schedules data for the schedules screen
   */
  async fetchSchedulesData(): Promise<any> {
    try {
      const response = await this.httpClient.makeRequest('/director/schedules/fetch-schedules-data');
      return response;
    } catch (error) {
      console.error('Error fetching schedules data:', error);
      throw error;
    }
  }

  async fetchScheduleData(params?: ScheduleQueryParams): Promise<ScheduleResponse> {
    try {
      const requestBody = params?.class ? { class: params.class } : { class: 'jss1' };
      console.log('🌐 Making API request to: /director/schedules/timetable');
      console.log('📦 Request body:', requestBody);

      const response = await this.httpClient.makeRequest<ScheduleData>(
        '/director/schedules/timetable',
        'POST',
        requestBody
      );
      return response;
    } catch (error) {
      console.error('❌ Error in fetchScheduleData:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        params
      });
      throw error;
    }
  }

  /**
   * Fetch teacher dashboard data
   */
  async fetchTeacherDashboard(): Promise<ApiResponse<{
    managed_class: {
      id: string;
      name: string;
      students: {
        total: number;
        males: number;
        females: number;
      };
    };
    class_schedules: {
      today: {
        day: string;
        schedule: Array<{
          subject: {
            id: string;
            name: string;
            code: string;
            color: string;
          };
          class: {
            id: string;
            name: string;
          };
          time: {
            from: string;
            to: string;
            label: string;
          };
          room: string;
        }>;
      };
      tomorrow: {
        day: string;
        schedule: Array<{
          subject: {
            id: string;
            name: string;
            code: string;
            color: string;
          };
          class: {
            id: string;
            name: string;
          };
          time: {
            from: string;
            to: string;
            label: string;
          };
          room: string;
        }>;
      };
      day_after_tomorrow: {
        day: string;
        schedule: Array<{
          subject: {
            id: string;
            name: string;
            code: string;
            color: string;
          };
          class: {
            id: string;
            name: string;
          };
          time: {
            from: string;
            to: string;
            label: string;
          };
          room: string;
        }>;
      };
    };
  }>> {
    try {
      console.log('🌐 Making API request to: /teachers/dashboard');
      
      const response = await this.httpClient.makeRequest<{
        managed_class: {
          id: string;
          name: string;
          students: {
            total: number;
            males: number;
            females: number;
          };
        };
        class_schedules: {
          today: {
            day: string;
            schedule: Array<{
              subject: {
                id: string;
                name: string;
                code: string;
                color: string;
              };
              class: {
                id: string;
                name: string;
              };
              time: {
                from: string;
                to: string;
                label: string;
              };
              room: string;
            }>;
          };
          tomorrow: {
            day: string;
            schedule: Array<{
              subject: {
                id: string;
                name: string;
                code: string;
                color: string;
              };
              class: {
                id: string;
                name: string;
              };
              time: {
                from: string;
                to: string;
                label: string;
              };
              room: string;
            }>;
          };
          day_after_tomorrow: {
            day: string;
            schedule: Array<{
              subject: {
                id: string;
                name: string;
                code: string;
                color: string;
              };
              class: {
                id: string;
                name: string;
              };
              time: {
                from: string;
                to: string;
                label: string;
              };
              room: string;
            }>;
          };
        };
      }>('/teachers/dashboard', 'GET');
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchTeacherDashboard:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Fetch subjects with their assigned teachers
   */
  async fetchSubjectsWithTeachers(): Promise<ApiResponse<{
    subjects: Array<{
      id: string;
      name: string;
      code: string;
      color: string;
      teachers: Array<{
        id: string;
        name: string;
        display_picture: string | null;
      }>;
    }>;
    summary: {
      total_subjects: number;
      subjects_with_teachers: number;
      subjects_without_teachers: number;
    };
  }>> {
    try {
      console.log('🌐 Making API request to: /director/schedules/subjects-with-teachers');
      
      const response = await this.httpClient.makeRequest<{
        subjects: Array<{
          id: string;
          name: string;
          code: string;
          color: string;
          teachers: Array<{
            id: string;
            name: string;
            display_picture: string | null;
          }>;
        }>;
        summary: {
          total_subjects: number;
          subjects_with_teachers: number;
          subjects_without_teachers: number;
        };
      }>('/director/schedules/subjects-with-teachers');
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchSubjectsWithTeachers:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Fetch timetable options for creating new schedule entries
   */
  async fetchTimetableOptions(): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/schedules/timetable-options');
      
      const response = await this.httpClient.makeRequest<any>(
        '/director/schedules/timetable-options',
        'GET'
      );
      return response;
    } catch (error) {
      console.error('❌ Error in fetchTimetableOptions:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Create a new timetable entry
   */
  async createTimetableEntry(payload: {
    class_id: string;
    subject_id: string;
    teacher_id: string;
    timeSlotId: string;
    day_of_week: string;
    room?: string;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/schedules/create-timetable');
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        '/director/schedules/create-timetable',
        'POST',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in createTimetableEntry:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }

  /**
   * Create a new class
   */
  async createClass(payload: { name: string; classTeacherId?: string }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/classes/create-class');
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        '/director/classes/create-class',
        'POST',
        payload
      );
      
      console.log('📥 Response from create-class API:', JSON.stringify(response, null, 2));
      
      return response;
    } catch (error) {
      console.error('❌ Error in createClass:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }

  /**
   * Edit a class
   */
  async editClass(id: string, payload: { name?: string; classTeacherId?: string }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/classes/edit-class/' + id);
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        `/director/classes/edit-class/${id}`,
        'PATCH',
        payload
      );
      
      console.log('📥 Response from edit-class API:', JSON.stringify(response, null, 2));
      
      return response;
    } catch (error) {
      console.error('❌ Error in editClass:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }

  /**
   * Fetch all classes and teachers
   */
  async fetchAllClasses(): Promise<ApiResponse<ClassesAndTeachersResponse>> {
    try {
      console.log('🌐 Making API request to: /director/classes/fetch-all-classes');
      
      const response = await this.httpClient.makeRequest<ClassesAndTeachersResponse>(
        '/director/classes/fetch-all-classes',
        'GET'
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchAllClasses:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Fetch all time slots
   */
  async fetchTimeSlots(): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/schedules/time-slots');
      
      const response = await this.httpClient.makeRequest<any>(
        '/director/schedules/time-slots',
        'GET'
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchTimeSlots:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Create a new time slot
   */
  async createTimeSlot(payload: {
    startTime: string;
    endTime: string;
    label: string;
    order?: number;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/schedules/create-time-slot');
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        '/director/schedules/create-time-slot',
        'POST',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in createTimeSlot:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }

  /**
   * Update a time slot
   */
  async updateTimeSlot(id: string, payload: {
    startTime?: string;
    endTime?: string;
    label?: string;
    order?: number;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/schedules/time-slots/' + id);
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        `/director/schedules/time-slots/${id}`,
        'PATCH',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in updateTimeSlot:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }

  /**
   * Enroll a new student
   */
  async enrollStudent(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: 'male' | 'female';
    class_id?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/students/enroll-new-student');
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        '/director/students/enroll-new-student',
        'POST',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in enrollStudent:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }

  /**
   * Update a student
   */
  async updateStudent(studentId: string, payload: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    gender?: 'male' | 'female';
    class_id?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Making API request to: /director/students/' + studentId);
      console.log('📦 Request payload:', payload);

      const response = await this.httpClient.makeRequest<any>(
        `/director/students/${studentId}`,
        'PATCH',
        payload
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error in updateStudent:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payload
      });
      throw error;
    }
  }
}

export const directorService = new DirectorService();
