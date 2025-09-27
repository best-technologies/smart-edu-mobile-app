import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface QuickLinkItem {
  id: string;
  display_title: string;
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface TeacherQuickLinksProps {
  onQuickLinkPress: (message: string, displayTitle: string) => void;
  isDisabled?: boolean;
}

// Quick link data based on the image and educational tools
const TEACHER_QUICK_LINKS: QuickLinkItem[] = [
  {
    id: 'lesson-plan',
    display_title: 'Lesson Plan',
    message: 'From the material I uploaded, I want you to help me create a comprehensive lesson plan with learning objectives, activities, and assessment methods.',
    icon: 'document-text',
    color: '#3B82F6'
  },
  {
    id: 'study-plan',
    display_title: 'Study Plan',
    message: 'From the material I uploaded, I want you to help me create a professional study plan with timeline, milestones, and learning goals.',
    icon: 'calendar',
    color: '#8B5CF6'
  },
  {
    id: 'teaching-coach',
    display_title: 'Teaching Coach',
    message: 'Act as my teaching coach. Help me improve my teaching methods and suggest effective strategies for this material.',
    icon: 'school',
    color: '#10B981'
  },
  {
    id: 'question-bank',
    display_title: 'Question Bank',
    message: 'Generate a comprehensive question bank with various difficulty levels based on this material. Include multiple choice, short answer, and essay questions.',
    icon: 'help-circle',
    color: '#F59E0B'
  },
  {
    id: 'analytics',
    display_title: 'Analytics',
    message: 'Analyze this material and provide insights on key concepts, difficulty level, and suggested teaching approaches.',
    icon: 'analytics',
    color: '#06B6D4'
  },
  {
    id: 'create-assessment',
    display_title: 'Create Assessment',
    message: 'Help me create a comprehensive assessment (quiz/test/exam) based on this material with proper scoring rubrics.',
    icon: 'clipboard',
    color: '#EF4444'
  },
  {
    id: 'interactive-activities',
    display_title: 'Interactive Activities',
    message: 'Suggest creative and engaging interactive activities and exercises that I can use to teach this material effectively.',
    icon: 'game-controller',
    color: '#EC4899'
  },
  {
    id: 'homework-assignment',
    display_title: 'Homework & Assignment',
    message: 'Create meaningful homework assignments and projects based on this material that will reinforce student learning.',
    icon: 'home',
    color: '#8B5CF6'
  },
  {
    id: 'suggested-videos',
    display_title: 'Suggested Videos',
    message: 'Recommend educational videos, documentaries, or multimedia resources that complement this material.',
    icon: 'play-circle',
    color: '#F97316'
  },
  {
    id: 'real-world-examples',
    display_title: 'Real-World Examples',
    message: 'Provide real-world examples, case studies, and practical applications that relate to this material.',
    icon: 'globe',
    color: '#14B8A6'
  },
  {
    id: 'definitions-concepts',
    display_title: 'Definitions/Concepts',
    message: 'Extract and explain all key definitions, concepts, and terminology from this material in a clear, student-friendly manner.',
    icon: 'book',
    color: '#7C3AED'
  },
  {
    id: 'chapter-summary',
    display_title: 'Chapter Summary',
    message: 'Create a comprehensive summary of this material highlighting the main points, key takeaways, and important concepts.',
    icon: 'list',
    color: '#059669'
  }
];

export default function TeacherQuickLinks({ onQuickLinkPress, isDisabled = false }: TeacherQuickLinksProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleQuickLinkPress = (item: QuickLinkItem) => {
    onQuickLinkPress(item.message, item.display_title);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    if (!isDisabled) {
      setIsDropdownVisible(!isDropdownVisible);
    }
  };

  return (
    <>
      {/* Fixed Quick Links Button */}
      <View className="absolute top-16 right-16 z-50">
        <TouchableOpacity
          onPress={toggleDropdown}
          disabled={isDisabled}
          className={`w-8 h-8 rounded-full items-center justify-center shadow-lg ${
            isDisabled 
              ? 'bg-gray-300 dark:bg-gray-600' 
              : 'bg-red-500 dark:bg-red-600'
          }`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Ionicons 
            name={isDropdownVisible ? "close" : "flash"} 
            size={18} 
            color={isDisabled ? "#9CA3AF" : "white"} 
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsDropdownVisible(false)}
          className="flex-1 bg-black/50"
        >
          <View className="absolute top-20 left-4 right-4 max-h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            {/* Header */}
            <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full items-center justify-center mr-3">
                    <Ionicons name="flash" size={18} color="#8B5CF6" />
                  </View>
                  <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Quick Teaching Tools
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsDropdownVisible(false)}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Select a teaching tool to get AI assistance
              </Text>
            </View>

            {/* Quick Links Grid */}
            <ScrollView 
              className="flex-1 p-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              <View className="flex-row flex-wrap justify-between">
                {TEACHER_QUICK_LINKS.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleQuickLinkPress(item)}
                    className="w-[48%] mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                    activeOpacity={0.7}
                  >
                    <View className="items-center">
                      <View 
                        className="w-12 h-12 rounded-full items-center justify-center mb-2"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Ionicons 
                          name={item.icon} 
                          size={24} 
                          color={item.color} 
                        />
                      </View>
                      <Text 
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center leading-4"
                        numberOfLines={2}
                      >
                        {item.display_title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Footer */}
            <View className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">
                These tools will send optimized prompts to help you with teaching tasks
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export { TEACHER_QUICK_LINKS };
