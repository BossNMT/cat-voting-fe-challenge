import axios from 'axios';
import type { CatImage, Vote, CreateVoteRequest, CreateVoteResponse } from '../types/cat.types';
import { envConfig } from '../configs/env.config';

const API_BASE_URL = envConfig.API_URL || 'https://api.thecatapi.com/v1';
const API_KEY = envConfig.API_KEY;

const catApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export const catApi = {
  // Get random cat images
  async getImages(limit: number = 10): Promise<CatImage[]> {
    try {
      const response = await catApiClient.get<CatImage[]>(`/images/search?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cat images:', error);
      throw new Error('Failed to fetch cat images');
    }
  },

  // Get specific image by ID
  async getImage(imageId: string): Promise<CatImage> {
    const response = await catApiClient.get<CatImage>(`/images/${imageId}`);
    return response.data;
  },

  // Create a vote for an image
  async createVote(voteData: CreateVoteRequest): Promise<CreateVoteResponse> {
    try {
      const response = await catApiClient.post<CreateVoteResponse>('/votes', voteData);
      return response.data;
    } catch (error) {
      console.error('Error creating vote:', error);
      throw new Error('Failed to create vote');
    }
  },

  // Get user votes by sub_id
  async getUserVotes(subId: string): Promise<Vote[]> {
    try {
      const response = await catApiClient.get<Vote[]>(`/votes?sub_id=${subId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user votes:', error);
      throw new Error('Failed to fetch user votes');
    }
  },
};