import React, { memo } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { MasonryCatImageCard } from './MasonryCatImageCard';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { MasonryGrid } from '../../../components/ui/MasonryGrid';
import { useImages, useRefreshImages } from '../../../queries/useImages';

export const Gallery: React.FC = memo(() => {
  const { data: images = [], isLoading, error, isRefetching } = useImages();
  const refreshImagesMutation = useRefreshImages();

  const handleRefresh = () => {
    refreshImagesMutation.mutate(10);
  };

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
      {/* Refresh Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleRefresh}
          disabled={refreshImagesMutation.isPending}
          className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <ArrowPathIcon 
            className={`-ml-1 mr-2 h-5 w-5 ${refreshImagesMutation.isPending ? 'animate-spin' : ''}`} 
          />
          {refreshImagesMutation.isPending ? 'Loading...' : 'Refresh Cats'}
        </button>
      </div>

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