import { securityLogger } from './securityLogger';

// Enhanced validation with security logging
export const validateAndSanitizeInput = (input: string, type: 'email' | 'text' | 'phone' | 'company'): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} => {
  const errors: string[] = [];
  let sanitized = input.trim();

  // Check for potential XSS attempts
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi
  ];

  const hasXSSAttempt = xssPatterns.some(pattern => pattern.test(input));
  if (hasXSSAttempt) {
        securityLogger.logSuspiciousActivity('xss_attempt', undefined, {
          input: input.substring(0, 100), // Log first 100 chars only
          type
        });
    errors.push('Invalid input detected');
    return { isValid: false, sanitized: '', errors };
  }

  // Remove HTML tags and encode special characters
  sanitized = sanitized
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Type-specific validation
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitized)) {
        errors.push('Invalid email format');
      }
      break;

    case 'phone':
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = sanitized.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        errors.push('Invalid phone number format');
      }
      sanitized = cleanPhone;
      break;

    case 'company':
      const companyRegex = /^[a-zA-Z0-9\s\.\,\&\-\_]+$/;
      if (!companyRegex.test(sanitized) || sanitized.length < 2 || sanitized.length > 100) {
        errors.push('Company name must be 2-100 characters and contain only valid characters');
      }
      break;

    case 'text':
      if (sanitized.length > 1000) {
        errors.push('Text input too long');
      }
      break;
  }

  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bcreate\b|\balter\b)/gi,
    /(\bunion\b|\bor\b\s+\d+\s*=\s*\d+)/gi,
    /(--|\/\*|\*\/|;)/g
  ];

  const hasSQLInjection = sqlPatterns.some(pattern => pattern.test(input));
  if (hasSQLInjection) {
    securityLogger.logSuspiciousActivity('sql_injection_attempt', undefined, {
      input: input.substring(0, 100),
      type
    });
    errors.push('Invalid input detected');
    return { isValid: false, sanitized: '', errors };
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  canAttempt(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key);

    if (!userAttempts || now > userAttempts.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userAttempts.count >= maxAttempts) {
      securityLogger.logSuspiciousActivity('rate_limit_exceeded', undefined, {
        key,
        attempts: userAttempts.count,
        windowMs
      });
      return false;
    }

    userAttempts.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();