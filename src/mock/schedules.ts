export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  order: number;
};

export type ScheduleSubject = {
  id: string;
  name: string;
  code: string;
  color: string;
};

export type ScheduleTeacher = {
  id: string;
  name: string;
};

export type SchedulePeriod = {
  timeSlotId: string;
  startTime: string;
  endTime: string;
  label: string;
  subject: ScheduleSubject | null;
  teacher: ScheduleTeacher | null;
  room: string | null;
};

export type DaySchedule = {
  [key: string]: SchedulePeriod[];
};

export type ClassTimetable = {
  class: string;
  timeSlots: TimeSlot[];
  schedule: DaySchedule;
};

export type SchedulesPayload = {
  success: boolean;
  message: string;
  data?: ClassTimetable;
  statusCode?: number;
};

export const schedulesDashboardData: SchedulesPayload = {
  success: true,
  message: "Timetable for grade10a retrieved successfully",
  data: {
    class: "grade10a",
    timeSlots: [
      {
        id: "timeslot_01HXYZABC123",
        startTime: "08:00",
        endTime: "09:00",
        label: "First Period",
        order: 1
      },
      {
        id: "timeslot_01HXYZDEF456",
        startTime: "09:00",
        endTime: "10:00",
        label: "Second Period",
        order: 2
      },
      {
        id: "timeslot_01HXYZGHI789",
        startTime: "10:00",
        endTime: "10:15",
        label: "Break",
        order: 3
      },
      {
        id: "timeslot_01HXYZJKL012",
        startTime: "10:15",
        endTime: "11:15",
        label: "Third Period",
        order: 4
      },
      {
        id: "timeslot_01HXYZMNO345",
        startTime: "11:15",
        endTime: "12:15",
        label: "Fourth Period",
        order: 5
      },
      {
        id: "timeslot_01HXYZPQR678",
        startTime: "12:15",
        endTime: "13:15",
        label: "Lunch",
        order: 6
      },
      {
        id: "timeslot_01HXYZSTU901",
        startTime: "13:15",
        endTime: "14:15",
        label: "Fifth Period",
        order: 7
      },
      {
        id: "timeslot_01HXYZVWX234",
        startTime: "14:15",
        endTime: "15:15",
        label: "Sixth Period",
        order: 8
      }
    ],
    schedule: {
      "MONDAY": [
        {
          timeSlotId: "timeslot_01HXYZABC123",
          startTime: "08:00",
          endTime: "09:00",
          label: "First Period",
          subject: {
            id: "subj_01HXYZABC123",
            name: "mathematics",
            code: "MATH101",
            color: "#3B82F6"
          },
          teacher: {
            id: "tchr_01HXYZABC789",
            name: "Ada Lovelace"
          },
          room: "Room 101"
        },
        {
          timeSlotId: "timeslot_01HXYZDEF456",
          startTime: "09:00",
          endTime: "10:00",
          label: "Second Period",
          subject: {
            id: "subj_01HXYZDEF456",
            name: "english",
            code: "ENG101",
            color: "#10B981"
          },
          teacher: {
            id: "tchr_01HXYZDEF012",
            name: "William Shakespeare"
          },
          room: "Room 102"
        },
        {
          timeSlotId: "timeslot_01HXYZGHI789",
          startTime: "10:00",
          endTime: "10:15",
          label: "Break",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZJKL012",
          startTime: "10:15",
          endTime: "11:15",
          label: "Third Period",
          subject: {
            id: "subj_01HXYZJKL012",
            name: "physics",
            code: "PHY101",
            color: "#EF4444"
          },
          teacher: {
            id: "tchr_01HXYZJKL345",
            name: "Isaac Newton"
          },
          room: "Lab 1"
        },
        {
          timeSlotId: "timeslot_01HXYZMNO345",
          startTime: "11:15",
          endTime: "12:15",
          label: "Fourth Period",
          subject: {
            id: "subj_01HXYZMNO345",
            name: "chemistry",
            code: "CHEM101",
            color: "#8B5CF6"
          },
          teacher: {
            id: "tchr_01HXYZMNO678",
            name: "Marie Curie"
          },
          room: "Lab 2"
        },
        {
          timeSlotId: "timeslot_01HXYZPQR678",
          startTime: "12:15",
          endTime: "13:15",
          label: "Lunch",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZSTU901",
          startTime: "13:15",
          endTime: "14:15",
          label: "Fifth Period",
          subject: {
            id: "subj_01HXYZSTU901",
            name: "biology",
            code: "BIO101",
            color: "#06B6D4"
          },
          teacher: {
            id: "tchr_01HXYZSTU234",
            name: "Charles Darwin"
          },
          room: "Lab 3"
        },
        {
          timeSlotId: "timeslot_01HXYZVWX234",
          startTime: "14:15",
          endTime: "15:15",
          label: "Sixth Period",
          subject: {
            id: "subj_01HXYZVWX234",
            name: "computer science",
            code: "CS101",
            color: "#84CC16"
          },
          teacher: {
            id: "tchr_01HXYZVWX567",
            name: "Alan Turing"
          },
          room: "Computer Lab"
        }
      ],
      "TUESDAY": [
        {
          timeSlotId: "timeslot_01HXYZABC123",
          startTime: "08:00",
          endTime: "09:00",
          label: "First Period",
          subject: {
            id: "subj_01HXYZGHI789",
            name: "physics",
            code: "PHY101",
            color: "#EF4444"
          },
          teacher: {
            id: "tchr_01HXYZGHI345",
            name: "Isaac Newton"
          },
          room: "Lab 1"
        },
        {
          timeSlotId: "timeslot_01HXYZDEF456",
          startTime: "09:00",
          endTime: "10:00",
          label: "Second Period",
          subject: {
            id: "subj_01HXYZDEF456",
            name: "english",
            code: "ENG101",
            color: "#10B981"
          },
          teacher: {
            id: "tchr_01HXYZDEF012",
            name: "William Shakespeare"
          },
          room: "Room 102"
        },
        {
          timeSlotId: "timeslot_01HXYZGHI789",
          startTime: "10:00",
          endTime: "10:15",
          label: "Break",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZJKL012",
          startTime: "10:15",
          endTime: "11:15",
          label: "Third Period",
          subject: {
            id: "subj_01HXYZABC123",
            name: "mathematics",
            code: "MATH101",
            color: "#3B82F6"
          },
          teacher: {
            id: "tchr_01HXYZABC789",
            name: "Ada Lovelace"
          },
          room: "Room 101"
        },
        {
          timeSlotId: "timeslot_01HXYZMNO345",
          startTime: "11:15",
          endTime: "12:15",
          label: "Fourth Period",
          subject: {
            id: "subj_01HXYZMNO345",
            name: "chemistry",
            code: "CHEM101",
            color: "#8B5CF6"
          },
          teacher: {
            id: "tchr_01HXYZMNO678",
            name: "Marie Curie"
          },
          room: "Lab 2"
        },
        {
          timeSlotId: "timeslot_01HXYZPQR678",
          startTime: "12:15",
          endTime: "13:15",
          label: "Lunch",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZSTU901",
          startTime: "13:15",
          endTime: "14:15",
          label: "Fifth Period",
          subject: {
            id: "subj_01HXYZSTU901",
            name: "biology",
            code: "BIO101",
            color: "#06B6D4"
          },
          teacher: {
            id: "tchr_01HXYZSTU234",
            name: "Charles Darwin"
          },
          room: "Lab 3"
        },
        {
          timeSlotId: "timeslot_01HXYZVWX234",
          startTime: "14:15",
          endTime: "15:15",
          label: "Sixth Period",
          subject: {
            id: "subj_01HXYZVWX234",
            name: "computer science",
            code: "CS101",
            color: "#84CC16"
          },
          teacher: {
            id: "tchr_01HXYZVWX567",
            name: "Alan Turing"
          },
          room: "Computer Lab"
        }
      ],
      "WEDNESDAY": [
        {
          timeSlotId: "timeslot_01HXYZABC123",
          startTime: "08:00",
          endTime: "09:00",
          label: "First Period",
          subject: {
            id: "subj_01HXYZMNO345",
            name: "chemistry",
            code: "CHEM101",
            color: "#8B5CF6"
          },
          teacher: {
            id: "tchr_01HXYZMNO678",
            name: "Marie Curie"
          },
          room: "Lab 2"
        },
        {
          timeSlotId: "timeslot_01HXYZDEF456",
          startTime: "09:00",
          endTime: "10:00",
          label: "Second Period",
          subject: {
            id: "subj_01HXYZSTU901",
            name: "biology",
            code: "BIO101",
            color: "#06B6D4"
          },
          teacher: {
            id: "tchr_01HXYZSTU234",
            name: "Charles Darwin"
          },
          room: "Lab 3"
        },
        {
          timeSlotId: "timeslot_01HXYZGHI789",
          startTime: "10:00",
          endTime: "10:15",
          label: "Break",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZJKL012",
          startTime: "10:15",
          endTime: "11:15",
          label: "Third Period",
          subject: {
            id: "subj_01HXYZABC123",
            name: "mathematics",
            code: "MATH101",
            color: "#3B82F6"
          },
          teacher: {
            id: "tchr_01HXYZABC789",
            name: "Ada Lovelace"
          },
          room: "Room 101"
        },
        {
          timeSlotId: "timeslot_01HXYZMNO345",
          startTime: "11:15",
          endTime: "12:15",
          label: "Fourth Period",
          subject: {
            id: "subj_01HXYZGHI789",
            name: "physics",
            code: "PHY101",
            color: "#EF4444"
          },
          teacher: {
            id: "tchr_01HXYZGHI345",
            name: "Isaac Newton"
          },
          room: "Lab 1"
        },
        {
          timeSlotId: "timeslot_01HXYZPQR678",
          startTime: "12:15",
          endTime: "13:15",
          label: "Lunch",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZSTU901",
          startTime: "13:15",
          endTime: "14:15",
          label: "Fifth Period",
          subject: {
            id: "subj_01HXYZDEF456",
            name: "english",
            code: "ENG101",
            color: "#10B981"
          },
          teacher: {
            id: "tchr_01HXYZDEF012",
            name: "William Shakespeare"
          },
          room: "Room 102"
        },
        {
          timeSlotId: "timeslot_01HXYZVWX234",
          startTime: "14:15",
          endTime: "15:15",
          label: "Sixth Period",
          subject: {
            id: "subj_01HXYZVWX234",
            name: "computer science",
            code: "CS101",
            color: "#84CC16"
          },
          teacher: {
            id: "tchr_01HXYZVWX567",
            name: "Alan Turing"
          },
          room: "Computer Lab"
        }
      ],
      "THURSDAY": [
        {
          timeSlotId: "timeslot_01HXYZABC123",
          startTime: "08:00",
          endTime: "09:00",
          label: "First Period",
          subject: {
            id: "subj_01HXYZDEF456",
            name: "english",
            code: "ENG101",
            color: "#10B981"
          },
          teacher: {
            id: "tchr_01HXYZDEF012",
            name: "William Shakespeare"
          },
          room: "Room 102"
        },
        {
          timeSlotId: "timeslot_01HXYZDEF456",
          startTime: "09:00",
          endTime: "10:00",
          label: "Second Period",
          subject: {
            id: "subj_01HXYZABC123",
            name: "mathematics",
            code: "MATH101",
            color: "#3B82F6"
          },
          teacher: {
            id: "tchr_01HXYZABC789",
            name: "Ada Lovelace"
          },
          room: "Room 101"
        },
        {
          timeSlotId: "timeslot_01HXYZGHI789",
          startTime: "10:00",
          endTime: "10:15",
          label: "Break",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZJKL012",
          startTime: "10:15",
          endTime: "11:15",
          label: "Third Period",
          subject: {
            id: "subj_01HXYZMNO345",
            name: "chemistry",
            code: "CHEM101",
            color: "#8B5CF6"
          },
          teacher: {
            id: "tchr_01HXYZMNO678",
            name: "Marie Curie"
          },
          room: "Lab 2"
        },
        {
          timeSlotId: "timeslot_01HXYZMNO345",
          startTime: "11:15",
          endTime: "12:15",
          label: "Fourth Period",
          subject: {
            id: "subj_01HXYZSTU901",
            name: "biology",
            code: "BIO101",
            color: "#06B6D4"
          },
          teacher: {
            id: "tchr_01HXYZSTU234",
            name: "Charles Darwin"
          },
          room: "Lab 3"
        },
        {
          timeSlotId: "timeslot_01HXYZPQR678",
          startTime: "12:15",
          endTime: "13:15",
          label: "Lunch",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZSTU901",
          startTime: "13:15",
          endTime: "14:15",
          label: "Fifth Period",
          subject: {
            id: "subj_01HXYZGHI789",
            name: "physics",
            code: "PHY101",
            color: "#EF4444"
          },
          teacher: {
            id: "tchr_01HXYZGHI345",
            name: "Isaac Newton"
          },
          room: "Lab 1"
        },
        {
          timeSlotId: "timeslot_01HXYZVWX234",
          startTime: "14:15",
          endTime: "15:15",
          label: "Sixth Period",
          subject: {
            id: "subj_01HXYZVWX234",
            name: "computer science",
            code: "CS101",
            color: "#84CC16"
          },
          teacher: {
            id: "tchr_01HXYZVWX567",
            name: "Alan Turing"
          },
          room: "Computer Lab"
        }
      ],
      "FRIDAY": [
        {
          timeSlotId: "timeslot_01HXYZABC123",
          startTime: "08:00",
          endTime: "09:00",
          label: "First Period",
          subject: {
            id: "subj_01HXYZVWX234",
            name: "computer science",
            code: "CS101",
            color: "#84CC16"
          },
          teacher: {
            id: "tchr_01HXYZVWX567",
            name: "Alan Turing"
          },
          room: "Computer Lab"
        },
        {
          timeSlotId: "timeslot_01HXYZDEF456",
          startTime: "09:00",
          endTime: "10:00",
          label: "Second Period",
          subject: {
            id: "subj_01HXYZABC123",
            name: "mathematics",
            code: "MATH101",
            color: "#3B82F6"
          },
          teacher: {
            id: "tchr_01HXYZABC789",
            name: "Ada Lovelace"
          },
          room: "Room 101"
        },
        {
          timeSlotId: "timeslot_01HXYZGHI789",
          startTime: "10:00",
          endTime: "10:15",
          label: "Break",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZJKL012",
          startTime: "10:15",
          endTime: "11:15",
          label: "Third Period",
          subject: {
            id: "subj_01HXYZDEF456",
            name: "english",
            code: "ENG101",
            color: "#10B981"
          },
          teacher: {
            id: "tchr_01HXYZDEF012",
            name: "William Shakespeare"
          },
          room: "Room 102"
        },
        {
          timeSlotId: "timeslot_01HXYZMNO345",
          startTime: "11:15",
          endTime: "12:15",
          label: "Fourth Period",
          subject: {
            id: "subj_01HXYZGHI789",
            name: "physics",
            code: "PHY101",
            color: "#EF4444"
          },
          teacher: {
            id: "tchr_01HXYZGHI345",
            name: "Isaac Newton"
          },
          room: "Lab 1"
        },
        {
          timeSlotId: "timeslot_01HXYZPQR678",
          startTime: "12:15",
          endTime: "13:15",
          label: "Lunch",
          subject: null,
          teacher: null,
          room: null
        },
        {
          timeSlotId: "timeslot_01HXYZSTU901",
          startTime: "13:15",
          endTime: "14:15",
          label: "Fifth Period",
          subject: {
            id: "subj_01HXYZMNO345",
            name: "chemistry",
            code: "CHEM101",
            color: "#8B5CF6"
          },
          teacher: {
            id: "tchr_01HXYZMNO678",
            name: "Marie Curie"
          },
          room: "Lab 2"
        },
        {
          timeSlotId: "timeslot_01HXYZVWX234",
          startTime: "14:15",
          endTime: "15:15",
          label: "Sixth Period",
          subject: {
            id: "subj_01HXYZSTU901",
            name: "biology",
            code: "BIO101",
            color: "#06B6D4"
          },
          teacher: {
            id: "tchr_01HXYZSTU234",
            name: "Charles Darwin"
          },
          room: "Lab 3"
        }
      ]
    }
  },
  statusCode: 200
};
