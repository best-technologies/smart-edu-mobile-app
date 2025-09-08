# 🎯 CBT System Usage Examples

## 📋 Quick Start Guide

This document provides practical examples of how to use the CBT (Computer-Based Test) system to create quizzes, add questions, and manage assessments.

---

## 🚀 Creating Your First Quiz

### Step 1: Create a Basic Quiz

```bash
POST /teachers/assessments/cbt
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Mathematics Quiz - Chapter 1",
  "description": "Test your understanding of basic algebra concepts",
  "instructions": "Answer all questions carefully. You have 30 minutes to complete this quiz.",
  "topic_id": "topic_123", //optinoal
  "duration": 30,
  "max_attempts": 2,
  "passing_score": 60,
  "total_points": 100,
  "shuffle_questions": true,
  "shuffle_options": false,
  "show_correct_answers": true,
  "show_feedback": true,
  "allow_review": true,
  "start_date": "2024-01-15T09:00:00Z",
  "end_date": "2024-01-20T23:59:59Z",
  "grading_type": "AUTOMATIC",
  "auto_submit": true,
  "tags": ["algebra", "mathematics", "chapter1"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "id": "quiz_123",
    "title": "Mathematics Quiz - Chapter 1",
    "description": "Test your understanding of basic algebra concepts",
    "status": "DRAFT",
    "is_published": false,
    "topic": {
      "id": "topic_123",
      "title": "Introduction to Algebra",
      "subject": {
        "id": "subject_456",
        "name": "Mathematics"
      }
    },
    "createdBy": {
      "id": "teacher_789",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

---

## 📝 Adding Questions to Your Quiz

### Example 1: Multiple Choice Question (Single Answer)

```bash
POST /teachers/assessments/cbt/cbt-id/questions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "question_text": "What is the capital of France?",
  "question_type": "MULTIPLE_CHOICE_SINGLE",
  "order": 1,
  "points": 2.0,
  "is_required": true,
  "time_limit": 60,
  "image_url": "https://example.com/france-map.jpg",
  "show_hint": true,
  "hint_text": "Think about European capitals",
  "explanation": "Paris is the capital and largest city of France.",
  "difficulty_level": "EASY",
  "options": [
    {
      "option_text": "Paris",
      "order": 1,
      "is_correct": true
    },
    {
      "option_text": "London",
      "order": 2,
      "is_correct": false
    },
    {
      "option_text": "Berlin",
      "order": 3,
      "is_correct": false
    },
    {
      "option_text": "Madrid",
      "order": 4,
      "is_correct": false
    }
  ],
  "correct_answers": [
    {
      "option_ids": ["option_1"]
    }
  ]
}
```

### Example 2: Multiple Choice Question (Multiple Answers)

```bash
POST /teachers/assessments/cbt/cbt-id/questions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "question_text": "Which of the following are programming languages? (Select all that apply)",
  "question_type": "MULTIPLE_CHOICE_MULTIPLE",
  "order": 2,
  "points": 3.0,
  "is_required": true,
  "explanation": "JavaScript, Python, and Java are all programming languages, while HTML is a markup language.",
  "difficulty_level": "MEDIUM",
  "options": [
    {
      "option_text": "JavaScript",
      "order": 1,
      "is_correct": true
    },
    {
      "option_text": "Python",
      "order": 2,
      "is_correct": true
    },
    {
      "option_text": "HTML",
      "order": 3,
      "is_correct": false
    },
    {
      "option_text": "Java",
      "order": 4,
      "is_correct": true
    }
  ],
  "correct_answers": [
    {
      "option_ids": ["option_1", "option_2", "option_4"]
    }
  ]
}
```

### Example 3: Short Answer Question

```bash
POST /teachers/assessments/cbt/cbt-id/questions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "question_text": "Define photosynthesis in one sentence.",
  "question_type": "SHORT_ANSWER",
  "order": 3,
  "points": 3.0,
  "is_required": true,
  "min_length": 10,
  "max_length": 200,
  "explanation": "Photosynthesis is the process by which plants convert sunlight into energy.",
  "difficulty_level": "MEDIUM",
  "correct_answers": [
    {
      "answer_text": "Photosynthesis is the process by which plants convert sunlight into energy."
    },
    {
      "answer_text": "Photosynthesis is how plants make food using sunlight."
    }
  ]
}
```

### Example 4: Long Answer Question (Essay)

```bash
POST /teachers/assessments/cbt/cbt-id/questions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "question_text": "Explain the causes of World War II and its impact on global politics.",
  "question_type": "LONG_ANSWER",
  "order": 4,
  "points": 10.0,
  "is_required": true,
  "min_length": 100,
  "max_length": 1000,
  "explanation": "This question requires a comprehensive understanding of historical events and their consequences.",
  "difficulty_level": "HARD"
}
```

### Example 5: True/False Question

```bash
POST /teachers/assessments/cbt/cbt-id/questions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "question_text": "The Earth is flat.",
  "question_type": "TRUE_FALSE",
  "order": 5,
  "points": 1.0,
  "is_required": true,
  "explanation": "The Earth is approximately spherical, not flat.",
  "difficulty_level": "EASY",
  "correct_answers": [
    {
      "answer_text": "false"
    }
  ]
}
```

### Example 6: Numeric Question

```bash
POST /teachers/assessments/cbt/cbt-id/questions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "question_text": "What is 15% of 200?",
  "question_type": "NUMERIC",
  "order": 6,
  "points": 2.0,
  "is_required": true,
  "min_value": 0,
  "max_value": 100,
  "explanation": "15% of 200 = 0.15 × 200 = 30",
  "difficulty_level": "EASY",
  "correct_answers": [
    {
      "answer_number": 30
    }
  ]
}
```

### Example 7: File Upload Question

```bash
POST /teachers/assessments/cbt/cbt-id/questions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "question_text": "Upload a diagram showing the water cycle with proper labels.",
  "question_type": "FILE_UPLOAD",
  "order": 7,
  "points": 5.0,
  "is_required": true,
  "explanation": "This question will be graded manually by the teacher.",
  "difficulty_level": "MEDIUM"
}
```

---

## 🔍 Managing Your Quiz

### Get Quiz Details

```bash
GET /teachers/assessments/cbt/quiz_123
Authorization: Bearer <your-jwt-token>
```

### Update Quiz Settings

```bash
PATCH /teachers/assessments/cbt/quiz_123
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "duration": 45,
  "passing_score": 70,
  "show_correct_answers": false
}
```

### Publish Quiz (Make Available to Students)

```bash
POST /teachers/assessments/cbt/cbt-id/publish
Authorization: Bearer <your-jwt-token>
```

### Get All Quizzes for a Topic

```bash
GET /teachers/assessments/cbt/topic/topic_123
Authorization: Bearer <your-jwt-token>
```

---

## 📊 Quiz Configuration Examples

### Example 1: Timed Exam (Strict)

```json
{
  "title": "Final Mathematics Exam",
  "description": "Comprehensive exam covering all chapters",
  "instructions": "This is a timed exam. You have exactly 2 hours. Auto-submit is enabled.",
  "topic_id": "topic_123",
  "duration": 120,
  "max_attempts": 1,
  "passing_score": 70,
  "total_points": 100,
  "shuffle_questions": true,
  "shuffle_options": true,
  "show_correct_answers": false,
  "show_feedback": false,
  "allow_review": false,
  "start_date": "2024-01-15T09:00:00Z",
  "end_date": "2024-01-15T11:00:00Z",
  "grading_type": "AUTOMATIC",
  "auto_submit": true,
  "tags": ["exam", "final", "mathematics"]
}
```

### Example 2: Practice Quiz (Flexible)

```json
{
  "title": "Algebra Practice Quiz",
  "description": "Practice questions to help you learn",
  "instructions": "Take your time and learn from your mistakes. You can retake this quiz multiple times.",
  "topic_id": "topic_123",
  "duration": 60,
  "max_attempts": 5,
  "passing_score": 50,
  "total_points": 50,
  "shuffle_questions": false,
  "shuffle_options": false,
  "show_correct_answers": true,
  "show_feedback": true,
  "allow_review": true,
  "grading_type": "AUTOMATIC",
  "auto_submit": false,
  "tags": ["practice", "algebra", "learning"]
}
```

### Example 3: Mixed Grading Quiz

```json
{
  "title": "Comprehensive Assessment",
  "description": "Combination of objective and subjective questions",
  "instructions": "Answer all questions. Some will be graded automatically, others will be reviewed by your teacher.",
  "topic_id": "topic_123",
  "duration": 90,
  "max_attempts": 2,
  "passing_score": 60,
  "total_points": 100,
  "shuffle_questions": true,
  "shuffle_options": false,
  "show_correct_answers": true,
  "show_feedback": true,
  "allow_review": true,
  "grading_type": "MIXED",
  "auto_submit": true,
  "tags": ["assessment", "mixed", "comprehensive"]
}
```

---

## 🎯 Best Practices

### 1. Quiz Design
- **Start with a clear title** that describes the content
- **Provide detailed instructions** so students know what to expect
- **Set appropriate time limits** based on question complexity
- **Use tags** to organize and categorize your quizzes

### 2. Question Creation
- **One concept per question** - focus on testing one thing at a time
- **Clear, unambiguous language** - avoid trick questions
- **Appropriate difficulty progression** - start easy, get harder
- **Provide explanations** to help students learn from mistakes

### 3. Security Considerations
- **Use shuffle options** for high-stakes exams
- **Limit attempts** to prevent cheating
- **Set strict time limits** for important assessments
- **Consider proctoring** for critical exams

### 4. Student Experience
- **Enable feedback** to help students learn
- **Allow review** for practice quizzes
- **Show correct answers** for learning purposes
- **Provide clear instructions** and expectations

---

## 🚨 Common Issues and Solutions

### Issue: "Teacher does not have access to topic"
**Solution:** Ensure the teacher is assigned to teach the subject that contains the topic.

### Issue: "Cannot publish quiz without questions"
**Solution:** Add at least one question to the quiz before publishing.

### Issue: "Cannot delete quiz with attempts"
**Solution:** Archive the quiz instead of deleting it, or wait until all attempts are cleared.

### Issue: "Quiz not found or access denied"
**Solution:** Verify the quiz ID and ensure you're the creator of the quiz.

---

## 📈 Next Steps

1. **Create your first quiz** using the examples above
2. **Add questions** of different types to test various skills
3. **Publish the quiz** and test it with students
4. **Review analytics** to understand student performance
5. **Iterate and improve** based on feedback and results

---

*For more detailed information, refer to the [CBT System Guide](./CBT_SYSTEM_GUIDE.md)*
