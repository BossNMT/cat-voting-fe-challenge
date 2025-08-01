import React, { memo, useMemo } from 'react';
import type { CatImage } from '../../../types/cat.types';
import { VotingButton } from '../voting/VotingButton';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useCreateVote, useHasVoted } from '../../../queries/useVotes';
import { useUIStore } from '../../../store/uiStore';
import { useLazyImage } from '../../../hooks/useLazyImage';
import { useDebouncedCallback } from '../../../utils/performance';

interface OptimizedCatImageCardProps {
  image: CatImage;
}

export const OptimizedCatImageCard: React.FC<OptimizedCatImageCardProps> = memo(({ image }) => {
  const { hasVoted, vote: userVote } = useHasVoted(image.id);
  const createVoteMutation = useCreateVote();
  const { isVoting, setVoting } = useUIStore();
  
  const {
    imgRef,
    src,
    isLoaded,
    error: imageError,
    handleLoad,
    handleError,
  } = useLazyImage(image.url);
  
  const isCurrentlyVoting = isVoting[image.id] || createVoteMutation.isPending;
  
  // Debounce voting to prevent accidental double-clicks
  const debouncedVote = useDebouncedCallback(async (value: 1 | -1) => {
    if (hasVoted || isCurrentlyVoting) return;
    
    setVoting(image.id, true);
    
    try {
      await createVoteMutation.mutateAsync({
        image_id: image.id,
        value,
      });
    } finally {
      setVoting(image.id, false);
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
            isVoted={hasVoted}
            isCurrentVote={userVote?.value === 1}
            onClick={() => debouncedVote(1)}
            disabled={isCurrentlyVoting}
          />
          <VotingButton
            type="down"
            isVoted={hasVoted}
            isCurrentVote={userVote?.value === -1}
            onClick={() => debouncedVote(-1)}
            disabled={isCurrentlyVoting}
          />
        </div>

        {/* Vote Status */}
        {voteStatus && (
          <div className="text-center">
            <div className={`text-sm font-medium ${
              voteStatus.isUpvote ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {voteStatus.message}{voteStatus.emoji}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isCurrentlyVoting && (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Processing vote...</span>
          </div>
        )}
      </div>
    </article>
  );
});

OptimizedCatImageCard.displayName = 'OptimizedCatImageCard';