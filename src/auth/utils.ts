// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (basic)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Format email for display (hide part of email)
export const formatEmailForDisplay = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

// Generate random code for password reset
export const generateResetCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Debounce function for input validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
