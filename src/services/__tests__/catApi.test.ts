/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CatImage, Vote, CreateVoteRequest, CreateVoteResponse } from '../../types/cat.types';

// Mock axios instance
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
};

// Mock axios create method
const mockAxios = {
  create: vi.fn(() => mockAxiosInstance),
};

// Mock axios module
vi.mock('axios', () => ({
  default: mockAxios,
}));

// Mock environment config
vi.mock('../../configs/env.config', () => ({
  envConfig: {
    API_URL: 'https://api.thecatapi.com/v1',
    API_KEY: 'test-api-key'
  }
}));

describe('catApi', () => {
  let catApi: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Dynamically import the module after mocks are set up
    const { catApi: importedCatApi } = await import('../catApi');
    catApi = importedCatApi;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getImages', () => {
    const mockImages: CatImage[] = [
      {
        id: 'image1',
        url: 'https://cdn2.thecatapi.com/images/image1.jpg',
        width: 1200,
        height: 800
      },
      {
        id: 'image2',
        url: 'https://cdn2.thecatapi.com/images/image2.jpg',
        width: 800,
        height: 600
      }
    ];

    it('should fetch images with default limit', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockImages });

      const result = await catApi.getImages();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/images/search?limit=10');
      expect(result).toEqual(mockImages);
    });

    it('should fetch images with custom limit', async () => {
      const customLimit = 5;
      mockAxiosInstance.get.mockResolvedValue({ data: mockImages.slice(0, 1) });

      const result = await catApi.getImages(customLimit);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/images/search?limit=${customLimit}`);
      expect(result).toEqual(mockImages.slice(0, 1));
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Network error';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      await expect(catApi.getImages()).rejects.toThrow('Failed to fetch cat images');
      expect(console.error).toHaveBeenCalledWith('Error fetching cat images:', expect.any(Error));
    });

    it('should return empty array when API returns empty data', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [] });

      const result = await catApi.getImages();

      expect(result).toEqual([]);
    });
  });

  describe('getImage', () => {
    const mockImage: CatImage = {
      id: 'specific-image-id',
      url: 'https://cdn2.thecatapi.com/images/specific-image-id.jpg',
      width: 1024,
      height: 768
    };

    it('should fetch specific image by ID', async () => {
      const imageId = 'specific-image-id';
      mockAxiosInstance.get.mockResolvedValue({ data: mockImage });

      const result = await catApi.getImage(imageId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/images/${imageId}`);
      expect(result).toEqual(mockImage);
    });

    it('should handle API errors when fetching specific image', async () => {
      const imageId = 'non-existent-id';
      const errorMessage = '404 Not Found';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      await expect(catApi.getImage(imageId)).rejects.toThrow(errorMessage);
    });

    it('should handle empty or invalid image ID', async () => {
      const invalidImageId = '';
      mockAxiosInstance.get.mockResolvedValue({ data: null });

      const result = await catApi.getImage(invalidImageId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/images/');
      expect(result).toBeNull();
    });
  });

  describe('createVote', () => {
    const mockVoteRequest: CreateVoteRequest = {
      image_id: 'image123',
      sub_id: 'user123',
      value: 1
    };

    const mockVoteResponse: CreateVoteResponse = {
      message: 'SUCCESS',
      id: 'vote123',
      image_id: 'image123',
      sub_id: 'user123',
      value: 1,
      country_code: 'US'
    };

    it('should create a positive vote successfully', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockVoteResponse });

      const result = await catApi.createVote(mockVoteRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/votes', mockVoteRequest);
      expect(result).toEqual(mockVoteResponse);
    });

    it('should create a negative vote successfully', async () => {
      const negativeVoteRequest: CreateVoteRequest = {
        ...mockVoteRequest,
        value: -1
      };
      const negativeVoteResponse: CreateVoteResponse = {
        ...mockVoteResponse,
        value: -1
      };
      mockAxiosInstance.post.mockResolvedValue({ data: negativeVoteResponse });

      const result = await catApi.createVote(negativeVoteRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/votes', negativeVoteRequest);
      expect(result).toEqual(negativeVoteResponse);
    });

    it('should handle vote creation errors', async () => {
      const errorMessage = 'Vote creation failed';
      mockAxiosInstance.post.mockRejectedValue(new Error(errorMessage));

      await expect(catApi.createVote(mockVoteRequest)).rejects.toThrow('Failed to create vote');
      expect(console.error).toHaveBeenCalledWith('Error creating vote:', expect.any(Error));
    });

    it('should handle invalid vote data', async () => {
      const invalidVoteRequest = {
        image_id: '',
        sub_id: '',
        value: 0 as any
      };
      const validationError = new Error('Invalid vote data');
      mockAxiosInstance.post.mockRejectedValue(validationError);

      await expect(catApi.createVote(invalidVoteRequest)).rejects.toThrow('Failed to create vote');
    });
  });

  describe('getUserVotes', () => {
    const mockVotes: Vote[] = [
      {
        id: 'vote1',
        image_id: 'image1',
        sub_id: 'user123',
        value: 1,
        created_at: '2024-01-01T10:00:00Z'
      },
      {
        id: 'vote2',
        image_id: 'image2',
        sub_id: 'user123',
        value: -1,
        created_at: '2024-01-01T11:00:00Z'
      }
    ];

    it('should fetch user votes successfully', async () => {
      const subId = 'user123';
      mockAxiosInstance.get.mockResolvedValue({ data: mockVotes });

      const result = await catApi.getUserVotes(subId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/votes?sub_id=${subId}`);
      expect(result).toEqual(mockVotes);
    });

    it('should return empty array when user has no votes', async () => {
      const subId = 'new-user';
      mockAxiosInstance.get.mockResolvedValue({ data: [] });

      const result = await catApi.getUserVotes(subId);

      expect(result).toEqual([]);
    });

    it('should handle errors when fetching user votes', async () => {
      const subId = 'user123';
      const errorMessage = 'Failed to fetch votes';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      await expect(catApi.getUserVotes(subId)).rejects.toThrow('Failed to fetch user votes');
      expect(console.error).toHaveBeenCalledWith('Error fetching user votes:', expect.any(Error));
    });

    it('should handle invalid or empty subId', async () => {
      const invalidSubId = '';
      mockAxiosInstance.get.mockResolvedValue({ data: [] });

      const result = await catApi.getUserVotes(invalidSubId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/votes?sub_id=');
      expect(result).toEqual([]);
    });

    it('should properly encode special characters in subId', async () => {
      const specialSubId = 'user@123!';
      mockAxiosInstance.get.mockResolvedValue({ data: mockVotes });

      await catApi.getUserVotes(specialSubId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/votes?sub_id=${specialSubId}`);
    });
  });



  describe('error handling', () => {
    it('should preserve original error for getImage method', async () => {
      const originalError = new Error('Network timeout');
      mockAxiosInstance.get.mockRejectedValue(originalError);

      await expect(catApi.getImage('test-id')).rejects.toThrow('Network timeout');
    });

    it('should log errors before throwing custom error messages', async () => {
      const originalError = new Error('Original error');
      mockAxiosInstance.get.mockRejectedValue(originalError);

      try {
        await catApi.getImages();
      } catch {
        // Expected to throw
      }

      expect(console.error).toHaveBeenCalledWith('Error fetching cat images:', originalError);
    });
  });
});