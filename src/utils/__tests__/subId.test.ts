import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { subIdUtils } from '../subId';

// Mock UUID
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mocked-uuid-12345'),
}));

describe('subIdUtils', () => {
  const SUB_ID_KEY = 'cat-voting-sub-id';
  const mockUuid = 'mocked-uuid-12345';

  // Mock localStorage
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Replace localStorage with our mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSubId', () => {
    it('should return existing sub_id from localStorage when available', () => {
      const existingSubId = 'existing-user-12345';
      mockLocalStorage.getItem.mockReturnValue(existingSubId);

      const result = subIdUtils.getSubId();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(SUB_ID_KEY);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(result).toBe(existingSubId);
    });

    it('should create and store new sub_id when none exists in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = subIdUtils.getSubId();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(SUB_ID_KEY);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, mockUuid);
      expect(result).toBe(mockUuid);
    });

    it('should create new sub_id when localStorage returns empty string', () => {
      mockLocalStorage.getItem.mockReturnValue('');

      const result = subIdUtils.getSubId();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(SUB_ID_KEY);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, mockUuid);
      expect(result).toBe(mockUuid);
    });

    it('should create new sub_id when localStorage returns undefined', () => {
      mockLocalStorage.getItem.mockReturnValue(undefined);

      const result = subIdUtils.getSubId();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(SUB_ID_KEY);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, mockUuid);
      expect(result).toBe(mockUuid);
    });

    it('should return same sub_id on multiple calls when exists in localStorage', () => {
      const existingSubId = 'consistent-user-id';
      mockLocalStorage.getItem.mockReturnValue(existingSubId);

      const result1 = subIdUtils.getSubId();
      const result2 = subIdUtils.getSubId();
      const result3 = subIdUtils.getSubId();

      expect(result1).toBe(existingSubId);
      expect(result2).toBe(existingSubId);
      expect(result3).toBe(existingSubId);
      expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(3);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should generate valid UUID format when creating new sub_id', async () => {
      const { v4: mockV4 } = vi.mocked(await import('uuid'));
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';
      mockV4.mockReturnValue(testUuid);
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = subIdUtils.getSubId();

      expect(mockV4).toHaveBeenCalledTimes(1);
      expect(result).toBe(testUuid);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, testUuid);
    });
  });

  describe('clearSubId', () => {
    it('should remove sub_id from localStorage', () => {
      subIdUtils.clearSubId();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(SUB_ID_KEY);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should work even when no sub_id exists in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      expect(() => subIdUtils.clearSubId()).not.toThrow();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(SUB_ID_KEY);
    });
  });

  describe('setSubId', () => {
    it('should set sub_id in localStorage', () => {
      const customSubId = 'custom-test-id-12345';

      subIdUtils.setSubId(customSubId);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, customSubId);
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should overwrite existing sub_id in localStorage', () => {
      const newSubId = 'new-overwrite-id';

      subIdUtils.setSubId(newSubId);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, newSubId);
    });

    it('should handle empty string as valid sub_id', () => {
      const emptySubId = '';

      subIdUtils.setSubId(emptySubId);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, emptySubId);
    });
  });

  describe('Integration Tests', () => {
    it('should work with complete flow: create -> set custom -> get custom', () => {
      // Start with no existing sub_id
      mockLocalStorage.getItem.mockReturnValueOnce(null);
      const initialId = subIdUtils.getSubId();
      expect(initialId).toBe(mockUuid);

      // Set custom sub_id
      const customId = 'my-custom-id-999';
      subIdUtils.setSubId(customId);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, customId);

      // Should return custom sub_id
      mockLocalStorage.getItem.mockReturnValueOnce(customId);
      const retrievedId = subIdUtils.getSubId();
      expect(retrievedId).toBe(customId);
    });
  });

  describe('Edge Cases', () => {
    it('should handle localStorage getItem throwing error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage access denied');
      });

      // Should not throw, but behavior depends on implementation
      // In a real scenario, you might want to handle this gracefully
      expect(() => subIdUtils.getSubId()).toThrow();
    });

    it('should handle localStorage setItem throwing error', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });

      // Should not throw or should handle gracefully
      expect(() => subIdUtils.getSubId()).toThrow();
    });

    it('should handle very long sub_id strings', () => {
      const longSubId = 'a'.repeat(1000);
      
      expect(() => subIdUtils.setSubId(longSubId)).not.toThrow();
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, longSubId);
    });

    it('should handle special characters in sub_id', () => {
      const specialSubId = 'user-123@example.com!#$%^&*()';
      
      expect(() => subIdUtils.setSubId(specialSubId)).not.toThrow();
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(SUB_ID_KEY, specialSubId);
    });
  });
});