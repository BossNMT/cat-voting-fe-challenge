import { describe, it, expect, beforeEach, vi } from 'vitest';
import { subIdUtils } from '../subId';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mocked-uuid-12345',
}));

describe('subIdUtils', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('getSubId', () => {
    it('should return existing sub_id from localStorage', () => {
      const existingSubId = 'existing-sub-id';
      localStorageMock.getItem.mockReturnValue(existingSubId);

      const result = subIdUtils.getSubId();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('cat-voting-sub-id');
      expect(result).toBe(existingSubId);
    });

    it('should generate and store new sub_id when none exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = subIdUtils.getSubId();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('cat-voting-sub-id');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cat-voting-sub-id', 'mocked-uuid-12345');
      expect(result).toBe('mocked-uuid-12345');
    });
  });

  describe('clearSubId', () => {
    it('should remove sub_id from localStorage', () => {
      subIdUtils.clearSubId();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cat-voting-sub-id');
    });
  });

  describe('setSubId', () => {
    it('should set specific sub_id in localStorage', () => {
      const testSubId = 'test-sub-id';

      subIdUtils.setSubId(testSubId);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('cat-voting-sub-id', testSubId);
    });
  });
});