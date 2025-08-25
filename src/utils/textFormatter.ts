/**
 * Text formatting utilities for consistent text display across the app
 */

/**
 * Capitalizes the first letter of each word in a string
 * @param text - The input text to format
 * @returns Formatted text with first letter of each word capitalized
 * 
 * @example
 * capitalizeWords("english language") // "English Language"
 * capitalizeWords("mathematics jss2") // "Mathematics Jss2"
 * capitalizeWords("PHYSICS") // "Physics"
 * capitalizeWords("") // ""
 */
export function capitalizeWords(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Capitalizes the first letter of a string only
 * @param text - The input text to format
 * @returns Formatted text with first letter capitalized
 * 
 * @example
 * capitalizeFirst("hello world") // "Hello world"
 * capitalizeFirst("") // ""
 */
export function capitalizeFirst(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formats class names with proper spacing and capitalization
 * @param className - The class name to format
 * @returns Formatted class name
 * 
 * @example
 * formatClassName("jss1") // "JSS 1"
 * formatClassName("ss2") // "SS 2"
 * formatClassName("class10a") // "Class 10A"
 */
export function formatClassName(className: string): string {
  if (!className || typeof className !== 'string') return '';
  
  // Handle common class name patterns
  const classPatterns = [
    { pattern: /^jss(\d+)$/i, format: (match: RegExpMatchArray) => `JSS ${match[1]}` },
    { pattern: /^ss(\d+)$/i, format: (match: RegExpMatchArray) => `SS ${match[1]}` },
    { pattern: /^class(\d+)([a-z])$/i, format: (match: RegExpMatchArray) => `Class ${match[1]}${match[2].toUpperCase()}` },
    { pattern: /^grade(\d+)$/i, format: (match: RegExpMatchArray) => `Grade ${match[1]}` },
  ];
  
  for (const { pattern, format } of classPatterns) {
    const match = className.match(pattern);
    if (match) {
      return format(match);
    }
  }
  
  // Fallback to general capitalization
  return capitalizeWords(className);
}

/**
 * Formats subject names with proper capitalization
 * @param subjectName - The subject name to format
 * @returns Formatted subject name
 * 
 * @example
 * formatSubjectName("english language") // "English Language"
 * formatSubjectName("mathematics") // "Mathematics"
 * formatSubjectName("PHYSICS") // "Physics"
 */
export function formatSubjectName(subjectName: string): string {
  if (!subjectName || typeof subjectName !== 'string') return '';
  
  // Handle common subject name patterns
  const subjectPatterns = [
    { pattern: /^english\s+language$/i, format: 'English Language' },
    { pattern: /^mathematics$/i, format: 'Mathematics' },
    { pattern: /^physics$/i, format: 'Physics' },
    { pattern: /^chemistry$/i, format: 'Chemistry' },
    { pattern: /^biology$/i, format: 'Biology' },
    { pattern: /^history$/i, format: 'History' },
    { pattern: /^geography$/i, format: 'Geography' },
    { pattern: /^literature$/i, format: 'Literature' },
    { pattern: /^art$/i, format: 'Art' },
    { pattern: /^music$/i, format: 'Music' },
    { pattern: /^physical\s+education$/i, format: 'Physical Education' },
    { pattern: /^computer\s+science$/i, format: 'Computer Science' },
  ];
  
  for (const { pattern, format } of subjectPatterns) {
    if (pattern.test(subjectName)) {
      return format;
    }
  }
  
  // Fallback to general capitalization
  return capitalizeWords(subjectName);
}

/**
 * Formats teacher names with proper capitalization
 * @param teacherName - The teacher name to format
 * @returns Formatted teacher name
 * 
 * @example
 * formatTeacherName("john doe") // "John Doe"
 * formatTeacherName("MARY JANE") // "Mary Jane"
 */
export function formatTeacherName(teacherName: string): string {
  if (!teacherName || typeof teacherName !== 'string') return '';
  
  return capitalizeWords(teacherName);
}

/**
 * Formats room names with proper capitalization
 * @param roomName - The room name to format
 * @returns Formatted room name
 * 
 * @example
 * formatRoomName("room 101") // "Room 101"
 * formatRoomName("lab 201") // "Lab 201"
 * formatRoomName("art studio") // "Art Studio"
 */
export function formatRoomName(roomName: string): string {
  if (!roomName || typeof roomName !== 'string') return '';
  
  // Handle common room name patterns
  const roomPatterns = [
    { pattern: /^room\s+(\d+)$/i, format: (match: RegExpMatchArray) => `Room ${match[1]}` },
    { pattern: /^lab\s+(\d+)$/i, format: (match: RegExpMatchArray) => `Lab ${match[1]}` },
    { pattern: /^art\s+studio$/i, format: 'Art Studio' },
    { pattern: /^music\s+room$/i, format: 'Music Room' },
    { pattern: /^computer\s+lab$/i, format: 'Computer Lab' },
  ];
  
  for (const { pattern, format } of roomPatterns) {
    const match = roomName.match(pattern);
    if (match) {
      return typeof format === 'function' ? format(match) : format;
    }
  }
  
  // Fallback to general capitalization
  return capitalizeWords(roomName);
}

/**
 * Formats time strings with proper formatting
 * @param time - The time string to format
 * @returns Formatted time string
 * 
 * @example
 * formatTime("08:30") // "8:30 AM"
 * formatTime("14:30") // "2:30 PM"
 */
export function formatTime(time: string): string {
  if (!time || typeof time !== 'string') return '';
  
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    // Fallback to original time if parsing fails
    return time;
  }
}

/**
 * Formats day names with proper capitalization
 * @param day - The day name to format
 * @returns Formatted day name
 * 
 * @example
 * formatDay("monday") // "Monday"
 * formatDay("MONDAY") // "Monday"
 */
export function formatDay(day: string): string {
  if (!day || typeof day !== 'string') return '';
  
  return capitalizeFirst(day);
}



