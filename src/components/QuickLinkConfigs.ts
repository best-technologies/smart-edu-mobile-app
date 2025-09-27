import { QuickLinkConfig } from './QuickLinkConfigModal';

// Question Bank Configuration
export const QUESTION_BANK_CONFIG: QuickLinkConfig = {
  id: 'question-bank',
  display_title: 'Question Bank',
  icon: 'help-circle',
  color: '#F59E0B',
  description: 'Generate a customized question bank with different types and difficulty levels',
  fields: [
    {
      id: 'mcq_easy',
      label: 'Multiple Choice (Easy)',
      type: 'number',
      placeholder: 'e.g., 5',
      defaultValue: 5,
      min: 0,
      max: 20,
      required: false
    },
    {
      id: 'mcq_medium',
      label: 'Multiple Choice (Medium)',
      type: 'number',
      placeholder: 'e.g., 3',
      defaultValue: 5,
      min: 0,
      max: 20,
      required: false
    },
    {
      id: 'mcq_hard',
      label: 'Multiple Choice (Hard)',
      type: 'number',
      placeholder: 'e.g., 2',
      defaultValue: 3,
      min: 0,
      max: 15,
      required: false
    },
    {
      id: 'short_answer_easy',
      label: 'Short Answer (Easy)',
      type: 'number',
      placeholder: 'e.g., 3',
      defaultValue: 3,
      min: 0,
      max: 15,
      required: false
    },
    {
      id: 'short_answer_medium',
      label: 'Short Answer (Medium)',
      type: 'number',
      placeholder: 'e.g., 2',
      defaultValue: 2,
      min: 0,
      max: 15,
      required: false
    },
    {
      id: 'short_answer_hard',
      label: 'Short Answer (Hard)',
      type: 'number',
      placeholder: 'e.g., 1',
      defaultValue: 1,
      min: 0,
      max: 10,
      required: false
    },
    {
      id: 'essay_questions',
      label: 'Essay Questions',
      type: 'number',
      placeholder: 'e.g., 2',
      defaultValue: 1,
      min: 0,
      max: 5,
      required: false
    },
    {
      id: 'include_answers',
      label: 'Include Answer Key',
      type: 'select',
      options: [
        { label: 'Yes, with explanations', value: 'with_explanations' },
        { label: 'Yes, answers only', value: 'answers_only' },
        { label: 'No', value: 'no' }
      ],
      defaultValue: 'with_explanations',
      required: true
    }
  ],
  generateMessage: (values) => {
    const sections = [];
    
    if (values.mcq_easy > 0) sections.push(`${values.mcq_easy} multiple choice questions (Easy level)`);
    if (values.mcq_medium > 0) sections.push(`${values.mcq_medium} multiple choice questions (Medium level)`);
    if (values.mcq_hard > 0) sections.push(`${values.mcq_hard} multiple choice questions (Hard level)`);
    if (values.short_answer_easy > 0) sections.push(`${values.short_answer_easy} short answer questions (Easy level)`);
    if (values.short_answer_medium > 0) sections.push(`${values.short_answer_medium} short answer questions (Medium level)`);
    if (values.short_answer_hard > 0) sections.push(`${values.short_answer_hard} short answer questions (Hard level)`);
    if (values.essay_questions > 0) sections.push(`${values.essay_questions} essay questions`);

    let answerKeyInstruction = '';
    if (values.include_answers === 'with_explanations') {
      answerKeyInstruction = ' Please include a complete answer key with detailed explanations for each question.';
    } else if (values.include_answers === 'answers_only') {
      answerKeyInstruction = ' Please include an answer key with correct answers only.';
    } else {
      answerKeyInstruction = ' Please provide questions only, no answer key needed.';
    }

    return `Generate a comprehensive question bank based on this material with the following specifications:

${sections.map((section, index) => `${index + 1}. ${section}`).join('\n')}

${answerKeyInstruction}

Please ensure questions are well-structured, cover different aspects of the material, and are appropriate for the specified difficulty levels. Format the output clearly with proper numbering and sections.`;
  }
};

// Create Assessment Configuration  
export const CREATE_ASSESSMENT_CONFIG: QuickLinkConfig = {
  id: 'create-assessment',
  display_title: 'Create Assessment',
  icon: 'clipboard',
  color: '#EF4444',
  description: 'Create a customized assessment with specific question types and scoring',
  fields: [
    {
      id: 'assessment_type',
      label: 'Assessment Type',
      type: 'select',
      options: [
        { label: 'Quiz', value: 'quiz' },
        { label: 'Test', value: 'test' },
        { label: 'Exam', value: 'exam' },
        { label: 'Assignment', value: 'assignment' }
      ],
      defaultValue: 'quiz',
      required: true
    },
    {
      id: 'duration',
      label: 'Duration (minutes)',
      type: 'number',
      placeholder: 'e.g., 30',
      defaultValue: 30,
      min: 5,
      max: 180,
      required: true
    },
    {
      id: 'total_questions',
      label: 'Total Questions',
      type: 'number',
      placeholder: 'e.g., 10',
      defaultValue: 10,
      min: 1,
      max: 50,
      required: true
    },
    {
      id: 'difficulty_level',
      label: 'Overall Difficulty',
      type: 'select',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Mixed', value: 'mixed' }
      ],
      defaultValue: 'medium',
      required: true
    },
    {
      id: 'question_types',
      label: 'Primary Question Type',
      type: 'select',
      options: [
        { label: 'Multiple Choice', value: 'mcq' },
        { label: 'Short Answer', value: 'short_answer' },
        { label: 'Mixed Types', value: 'mixed' },
        { label: 'Essay Questions', value: 'essay' }
      ],
      defaultValue: 'mixed',
      required: true
    },
    {
      id: 'include_rubric',
      label: 'Include Scoring Rubric',
      type: 'select',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ],
      defaultValue: 'yes',
      required: true
    }
  ],
  generateMessage: (values) => {
    return `Create a comprehensive ${values.assessment_type} based on this material with the following specifications:

Assessment Details:
- Type: ${values.assessment_type.charAt(0).toUpperCase() + values.assessment_type.slice(1)}
- Duration: ${values.duration} minutes
- Total Questions: ${values.total_questions}
- Difficulty Level: ${values.difficulty_level}
- Question Type: ${values.question_types === 'mcq' ? 'Multiple Choice' : 
                   values.question_types === 'short_answer' ? 'Short Answer' :
                   values.question_types === 'essay' ? 'Essay Questions' : 'Mixed Types'}

Requirements:
- Ensure questions cover all key concepts from the material
- Include clear instructions for students
- Provide appropriate point values for each question
${values.include_rubric === 'yes' ? '- Include a detailed scoring rubric' : ''}
- Format the assessment professionally with proper numbering

Please create an assessment that accurately measures student understanding of the material.`;
  }
};

// Interactive Activities Configuration
export const INTERACTIVE_ACTIVITIES_CONFIG: QuickLinkConfig = {
  id: 'interactive-activities',
  display_title: 'Interactive Activities',
  icon: 'game-controller',
  color: '#EC4899',
  description: 'Design engaging activities and exercises for your lessons',
  fields: [
    {
      id: 'activity_count',
      label: 'Number of Activities',
      type: 'number',
      placeholder: 'e.g., 3',
      defaultValue: 3,
      min: 1,
      max: 8,
      required: true
    },
    {
      id: 'activity_types',
      label: 'Activity Types',
      type: 'select',
      options: [
        { label: 'Group Activities', value: 'group' },
        { label: 'Individual Exercises', value: 'individual' },
        { label: 'Hands-on Activities', value: 'hands_on' },
        { label: 'Mixed Types', value: 'mixed' }
      ],
      defaultValue: 'mixed',
      required: true
    },
    {
      id: 'duration_per_activity',
      label: 'Duration per Activity (minutes)',
      type: 'number',
      placeholder: 'e.g., 15',
      defaultValue: 15,
      min: 5,
      max: 60,
      required: true
    },
    {
      id: 'class_size',
      label: 'Class Size',
      type: 'select',
      options: [
        { label: 'Small (1-15 students)', value: 'small' },
        { label: 'Medium (16-25 students)', value: 'medium' },
        { label: 'Large (26+ students)', value: 'large' }
      ],
      defaultValue: 'medium',
      required: true
    }
  ],
  generateMessage: (values) => {
    return `Create ${values.activity_count} engaging interactive activities based on this material with the following specifications:

Activity Requirements:
- Number of activities: ${values.activity_count}
- Activity type: ${values.activity_types === 'group' ? 'Group-based activities' :
                   values.activity_types === 'individual' ? 'Individual exercises' :
                   values.activity_types === 'hands_on' ? 'Hands-on activities' : 'Mixed activity types'}
- Duration per activity: ${values.duration_per_activity} minutes
- Class size: ${values.class_size === 'small' ? 'Small class (1-15 students)' :
               values.class_size === 'medium' ? 'Medium class (16-25 students)' : 'Large class (26+ students)'}

Please ensure each activity:
- Reinforces key concepts from the material
- Is age-appropriate and engaging
- Includes clear instructions for implementation
- Lists required materials or resources
- Has defined learning outcomes
- Considers the specified class size for effective participation

Format each activity with a clear title, objectives, materials needed, step-by-step instructions, and expected outcomes.`;
  }
};

// Export all configurations
export const CONFIGURABLE_QUICK_LINKS = {
  'question-bank': QUESTION_BANK_CONFIG,
  'create-assessment': CREATE_ASSESSMENT_CONFIG,
  'interactive-activities': INTERACTIVE_ACTIVITIES_CONFIG
};
