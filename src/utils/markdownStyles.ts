import { StyleSheet } from 'react-native';

// Professional markdown styles for AI chat responses
export const markdownStyles = StyleSheet.create({
  body: {
    color: '#1F2937', // gray-800
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'System',
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
    color: '#1F2937',
  },
  heading1: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#111827', // gray-900
    lineHeight: 28,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    color: '#111827',
    lineHeight: 26,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#111827',
    lineHeight: 24,
  },
  heading4: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    color: '#111827',
    lineHeight: 22,
  },
  heading5: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#111827',
    lineHeight: 20,
  },
  heading6: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
    color: '#111827',
    lineHeight: 18,
  },
  code_inline: {
    backgroundColor: '#F3F4F6', // gray-100
    color: '#DC2626', // red-600
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Courier New',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
  },
  code_block: {
    backgroundColor: '#F8FAFC', // slate-50
    color: '#1E293B', // slate-800
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    fontFamily: 'Courier New',
    fontSize: 13,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0', // slate-200
    overflow: 'hidden',
  },
  blockquote: {
    backgroundColor: '#F0F9FF', // blue-50
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', // blue-500
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 12,
    marginVertical: 12,
    borderRadius: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    color: '#1E40AF', // blue-800
    fontStyle: 'italic',
  },
  list_item: {
    marginVertical: 4,
    color: '#1F2937',
    lineHeight: 22,
  },
  bullet_list: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  ordered_list: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  strong: {
    fontWeight: '700',
    color: '#111827',
  },
  em: {
    fontStyle: 'italic',
    color: '#374151',
  },
  link: {
    color: '#3B82F6', // blue-500
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  thead: {
    backgroundColor: '#F9FAFB',
  },
  tbody: {
    backgroundColor: '#FFFFFF',
  },
  th: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    fontWeight: '600',
    color: '#111827',
    textAlign: 'left',
  },
  td: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    color: '#374151',
  },
  hr: {
    backgroundColor: '#E5E7EB',
    height: 1,
    marginVertical: 16,
  },
  image: {
    borderRadius: 8,
    marginVertical: 8,
  },
});

// Dark mode markdown styles
export const darkMarkdownStyles = StyleSheet.create({
  body: {
    color: '#F9FAFB', // gray-50
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'System',
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
    color: '#F9FAFB',
  },
  heading1: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#FFFFFF',
    lineHeight: 28,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    color: '#FFFFFF',
    lineHeight: 26,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  heading4: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  heading5: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  heading6: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  code_inline: {
    backgroundColor: '#374151', // gray-700
    color: '#F87171', // red-400
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Courier New',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#4B5563', // gray-600
  },
  code_block: {
    backgroundColor: '#1F2937', // gray-800
    color: '#E5E7EB', // gray-200
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    fontFamily: 'Courier New',
    fontSize: 13,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: '#374151', // gray-700
    overflow: 'hidden',
  },
  blockquote: {
    backgroundColor: '#1E3A8A', // blue-900
    borderLeftWidth: 4,
    borderLeftColor: '#60A5FA', // blue-400
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 12,
    marginVertical: 12,
    borderRadius: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    color: '#93C5FD', // blue-300
    fontStyle: 'italic',
  },
  list_item: {
    marginVertical: 4,
    color: '#F9FAFB',
    lineHeight: 22,
  },
  bullet_list: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  ordered_list: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  strong: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  em: {
    fontStyle: 'italic',
    color: '#D1D5DB',
  },
  link: {
    color: '#60A5FA', // blue-400
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  table: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    marginVertical: 12,
    backgroundColor: '#1F2937',
  },
  thead: {
    backgroundColor: '#374151',
  },
  tbody: {
    backgroundColor: '#1F2937',
  },
  th: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  td: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    color: '#D1D5DB',
  },
  hr: {
    backgroundColor: '#374151',
    height: 1,
    marginVertical: 16,
  },
  image: {
    borderRadius: 8,
    marginVertical: 8,
  },
});

// Additional professional styles for better readability
export const professionalMarkdownStyles = {
  ...markdownStyles,
  // Reduce overall font size for better mobile display
  body: {
    ...markdownStyles.body,
    fontSize: 14,
    lineHeight: 22,
  },
  paragraph: {
    ...markdownStyles.paragraph,
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 22,
  },
  // Enhanced code block with syntax highlighting colors
  code_block: {
    ...markdownStyles.code_block,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // Enhanced blockquote with better visual hierarchy
  blockquote: {
    ...markdownStyles.blockquote,
    backgroundColor: '#F0F9FF',
    borderLeftColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  // Better list styling - minimal indentation to save space
  bullet_list: {
    ...markdownStyles.bullet_list,
    paddingLeft: 16,
    marginLeft: 0,
    marginVertical: 8,
  },
  ordered_list: {
    ...markdownStyles.ordered_list,
    paddingLeft: 16,
    marginLeft: 0,
    marginVertical: 8,
  },
  list_item: {
    ...markdownStyles.list_item,
    marginVertical: 4,
    paddingLeft: 0,
    paddingRight: 0,
    lineHeight: 20,
    fontSize: 14,
  },
  // Enhanced table styling
  table: {
    ...markdownStyles.table,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
};

export const professionalDarkMarkdownStyles = {
  ...darkMarkdownStyles,
  // Reduce overall font size for better mobile display
  body: {
    ...darkMarkdownStyles.body,
    fontSize: 14,
    lineHeight: 22,
  },
  paragraph: {
    ...darkMarkdownStyles.paragraph,
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 22,
  },
  // Enhanced dark code block
  code_block: {
    ...darkMarkdownStyles.code_block,
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  // Enhanced dark blockquote
  blockquote: {
    ...darkMarkdownStyles.blockquote,
    backgroundColor: '#1E3A8A',
    borderLeftColor: '#60A5FA',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  // Better dark list styling - minimal indentation to save space
  bullet_list: {
    ...darkMarkdownStyles.bullet_list,
    paddingLeft: 16,
    marginLeft: 0,
    marginVertical: 8,
  },
  ordered_list: {
    ...darkMarkdownStyles.ordered_list,
    paddingLeft: 16,
    marginLeft: 0,
    marginVertical: 8,
  },
  list_item: {
    ...darkMarkdownStyles.list_item,
    marginVertical: 4,
    paddingLeft: 0,
    paddingRight: 0,
    lineHeight: 20,
    fontSize: 14,
  },
  // Enhanced dark table styling
  table: {
    ...darkMarkdownStyles.table,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
};
