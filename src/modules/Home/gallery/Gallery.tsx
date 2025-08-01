import React, { memo } from 'react';
import { MasonryCatImageCard } from './MasonryCatImageCard';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { MasonryGrid } from '../../../components/ui/MasonryGrid';
import { useImages } from '../../../queries/useImages';

export const Gallery: React.FC = memo(() => {
  const { data: images = [], isLoading, error, isRefetching } = useImages();

  if (isLoading && images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading adorable cats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">😿</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error instanceof Error ? error.message : 'Failed to load images'}
          </p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🐱</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No cats found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Click the refresh button to load some adorable cats!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Refetching indicator */}
      {isRefetching && (
        <div className="flex items-center justify-center py-2 text-blue-600 dark:text-blue-400">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-sm">Refreshing images...</span>
        </div>
      )}
      
      {/* Masonry Gallery Grid */}
      <MasonryGrid className="w-full">
        {images.map((image) => (
          <MasonryCatImageCard key={image.id} image={image} />
        ))}
      </MasonryGrid>
    </div>
  );
});

Gallery.displayName = 'Gallery';