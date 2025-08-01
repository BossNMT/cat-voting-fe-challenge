import React, { memo, useMemo } from 'react';
import type { CatImage } from '../../../types/cat.types';
import { VotingButton } from '../voting/VotingButton';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useOptimisticVoting } from '../../../queries/useVotes';
import { useLazyImage } from '../../../hooks/useLazyImage';
import { useDebouncedCallback } from '../../../utils/performance';

interface OptimizedCatImageCardProps {
  image: CatImage;
}

export const OptimizedCatImageCard: React.FC<OptimizedCatImageCardProps> = memo(({ image }) => {
  const {
    vote,
    retry,
    hasVoted,
    userVote,
    isError,
  } = useOptimisticVoting(image.id);
  
  const {
    imgRef,
    src,
    isLoaded,
    error: imageError,
    handleLoad,
    handleError,
  } = useLazyImage(image.url);
  
  // Debounce voting to prevent accidental double-clicks
  const debouncedVote = useDebouncedCallback(async (value: 1 | -1) => {
    if (hasVoted && !isError) return;
    
    try {
      await vote(value);
    } catch (error) {
      // Error handling is done by the optimistic voting hook
      console.error('Vote failed:', error);
    }
  }, 300);

  // Memoize vote status to prevent unnecessary re-renders
  const voteStatus = useMemo(() => {
    if (!hasVoted || !userVote) return null;
    
    return {
      isUpvote: userVote.value === 1,
      message: `You voted ${userVote.value === 1 ? 'Up' : 'Down'}!`,
      emoji: userVote.value === 1 ? ' 👍' : ' 👎',
    };
  }, [hasVoted, userVote]);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">😿</div>
              <div className="text-sm">Failed to load image</div>
            </div>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt={`Cat ${image.id}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
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
            onClick={() => debouncedVote(1)}
            hasError={isError && userVote?.value === 1}
            onRetry={retry}
          />
          <VotingButton
            type="down"
            isVoted={hasVoted && !isError}
            isCurrentVote={userVote?.value === -1}
            onClick={() => debouncedVote(-1)}
            hasError={isError && userVote?.value === -1}
            onRetry={retry}
          />
        </div>

        {/* Vote Status */}
        {voteStatus && !isError && (
          <div className="text-center">
            <div className={`text-sm font-medium ${
              voteStatus.isUpvote ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {voteStatus.message}{voteStatus.emoji}
            </div>
          </div>
        )}

        {/* Error Status */}
        {isError && (
          <div className="text-center">
            <div className="text-sm font-medium text-red-600 dark:text-red-400">
              Vote failed. Click retry to try again.
            </div>
          </div>
        )}
      </div>
    </article>
  );
});

OptimizedCatImageCard.displayName = 'OptimizedCatImageCard';