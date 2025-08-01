import React, { memo, useState, useCallback } from 'react';
import { VotingButton } from '../voting/VotingButton';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useOptimisticVoting } from '../../../queries/useVotes';
import type { CatImage } from '../../../types/cat.types';

interface CatImageCardProps {
  image: CatImage;
}

export const CatImageCard: React.FC<CatImageCardProps> = memo(({ image }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const {
    vote,
    retry,
    hasVoted,
    userVote,
    isError,
  } = useOptimisticVoting(image.id);
  
  const handleVote = useCallback(async (value: 1 | -1) => {
    if (hasVoted && !isError) return;
    
    try {
      await vote(value);
    } catch (error) {
      // Error handling is done by the optimistic voting hook
      console.error('Vote failed:', error);
    }
  }, [hasVoted, isError, vote]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">😿</div>
              <div>Failed to load image</div>
            </div>
          </div>
        ) : (
          <img
            src={image.url}
            alt={`Cat ${image.id}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy" // Native lazy loading
          />
        )}
      </div>

      {/* Voting Section */}
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <VotingButton
            type="up"
            isVoted={hasVoted && !isError}
            isCurrentVote={userVote?.value === 1}
            onClick={() => handleVote(1)}
            hasError={isError && userVote?.value === 1}
            onRetry={retry}
          />
          <VotingButton
            type="down"
            isVoted={hasVoted && !isError}
            isCurrentVote={userVote?.value === -1}
            onClick={() => handleVote(-1)}
            hasError={isError && userVote?.value === -1}
            onRetry={retry}
          />
        </div>

        {/* Vote Status */}
        {hasVoted && userVote && !isError && (
          <div className="text-center">
            <div className={`text-sm font-medium ${
              userVote.value === 1 ? 'text-green-600' : 'text-red-600'
            }`}>
              You voted {userVote.value === 1 ? 'Up' : 'Down'}! 
              {userVote.value === 1 ? ' 👍' : ' 👎'}
            </div>
          </div>
        )}

        {/* Error Status */}
        {isError && (
          <div className="text-center">
            <div className="text-sm font-medium text-red-600">
              Vote failed. Click retry to try again.
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

CatImageCard.displayName = 'CatImageCard';