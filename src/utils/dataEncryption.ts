// Enhanced data encryption utilities for sensitive information

export class DataEncryption {
  // Simple encryption for client-side sensitive data
  // Note: This is for basic obfuscation, not cryptographic security
  static encryptSensitiveData(data: string, key?: string): string {
    const encryptionKey = key || 'default-app-key-change-in-production';
    let encrypted = '';
    
    for (let i = 0; i < data.length; i++) {
      const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
      const dataChar = data.charCodeAt(i);
      encrypted += String.fromCharCode(dataChar ^ keyChar);
    }
    
    return btoa(encrypted);
  }

  static decryptSensitiveData(encryptedData: string, key?: string): string {
    try {
      const encryptionKey = key || 'default-app-key-change-in-production';
      const encrypted = atob(encryptedData);
      let decrypted = '';
      
      for (let i = 0; i < encrypted.length; i++) {
        const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
        const encryptedChar = encrypted.charCodeAt(i);
        decrypted += String.fromCharCode(encryptedChar ^ keyChar);
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  // Secure data masking for display purposes
  static maskSensitiveData(data: string, type: 'email' | 'phone' | 'generic' = 'generic'): string {
    if (!data) return '';

    switch (type) {
      case 'email':
        const emailParts = data.split('@');
        if (emailParts.length === 2) {
          const localPart = emailParts[0];
          const domain = emailParts[1];
          const maskedLocal = localPart.length > 2 
            ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
            : '*'.repeat(localPart.length);
          return `${maskedLocal}@${domain}`;
        }
        break;
      
      case 'phone':
        if (data.length > 6) {
          return data.slice(0, 3) + '*'.repeat(data.length - 6) + data.slice(-3);
        }
        break;
      
      case 'generic':
      default:
        if (data.length > 4) {
          return data.slice(0, 2) + '*'.repeat(data.length - 4) + data.slice(-2);
        }
        break;
    }

    return '*'.repeat(data.length);
  }

  // Generate secure hash for data comparison
  static async generateSecureHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Secure storage utilities
  static secureLocalStorage = {
    setItem: (key: string, value: string) => {
      try {
        const encrypted = DataEncryption.encryptSensitiveData(value);
        localStorage.setItem(key, encrypted);
      } catch (error) {
        console.error('Secure storage failed:', error);
      }
    },

    getItem: (key: string): string | null => {
      try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return DataEncryption.decryptSensitiveData(encrypted);
      } catch (error) {
        console.error('Secure retrieval failed:', error);
        return null;
      }
    },

    removeItem: (key: string) => {
      localStorage.removeItem(key);
    }
  };

  // PII (Personally Identifiable Information) detection
  static detectPII(text: string): { hasPII: boolean; types: string[] } {
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
    };

    const detectedTypes: string[] = [];
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      if (pattern.test(text)) {
        detectedTypes.push(type);
      }
    });

    return {
      hasPII: detectedTypes.length > 0,
      types: detectedTypes
    };
  }
}

// Export convenience functions
export const {
  encryptSensitiveData,
  decryptSensitiveData,
  maskSensitiveData,
  generateSecureHash,
  secureLocalStorage,
  detectPII
} = DataEncryption;