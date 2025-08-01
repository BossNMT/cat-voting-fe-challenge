import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}

export const parseError = (error: unknown): AppError => {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    switch (statusCode) {
      case 400:
        return { message: 'Invalid request. Please check your input.', statusCode };
      case 401:
        return { message: 'Invalid API key. Please check your configuration.', statusCode };
      case 403:
        return { message: 'Access forbidden. Please check your permissions.', statusCode };
      case 404:
        return { message: 'Resource not found.', statusCode };
      case 429:
        return { message: 'Too many requests. Please try again later.', statusCode };
      case 500:
        return { message: 'Server error. Please try again later.', statusCode };
      default:
        return { message, statusCode };
    }
  }
  
  // Handle standard errors
  if (error instanceof Error) {
    return { message: error.message };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return { message: error };
  }
  
  // Default error
  return { message: 'An unexpected error occurred' };
};

export const logError = (error: unknown, context?: string) => {
  const parsedError = parseError(error);
  
  console.error(`[${context || 'ERROR'}]:`, {
    message: parsedError.message,
    statusCode: parsedError.statusCode,
    originalError: error,
    timestamp: new Date().toISOString(),
  });
};

// Error retry utility
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};