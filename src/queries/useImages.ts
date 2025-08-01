import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catApi } from '../services/catApi';
import { QUERY_KEYS } from '../constants/query-keys';
import type { CatImage } from '../types/cat.types';

export interface UseImagesOptions {
  limit?: number;
  enabled?: boolean;
}

export const useImages = (options: UseImagesOptions = {}) => {
  const { limit = 10, enabled = true } = options;

  return useQuery({
    queryKey: [...QUERY_KEYS.IMAGES, limit],
    queryFn: () => catApi.getImages(limit),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes - images change frequently
  });
};

export const useImage = (imageId: string | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.IMAGE(imageId!),
    queryFn: () => catApi.getImage(imageId!),
    enabled: !!imageId,
  });
};

export const useRefreshImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (limit: number = 10) => catApi.getImages(limit),
    onSuccess: (newImages: CatImage[], limit: number) => {
      // Update the cache with new images
      queryClient.setQueryData([...QUERY_KEYS.IMAGES, limit], newImages);
    },
  });
};