import React, { memo, useMemo } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import type { CatImage } from '../../../types/cat.types';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useOptimisticVoting } from '../../../queries/useVotes';
import { useLazyImage } from '../../../hooks/useLazyImage';
import { useDebouncedCallback } from '../../../utils/performance';

interface MasonryCatImageCardProps {
  image: CatImage;
}

export const MasonryCatImageCard: React.FC<MasonryCatImageCardProps> = memo(({ image }) => {
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
  
  // Calculate aspect ratio for natural image display
  const aspectRatio = useMemo(() => {
    if (image.width && image.height) {
      return image.height / image.width;
    }
    return 1; // Default square if no dimensions
  }, [image.width, image.height]);

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

  // Memoize vote status
  const voteStatus = useMemo(() => {
    if (!hasVoted || !userVote) return null;
    
    return {
      isUpvote: userVote.value === 1,
      text: userVote.value === 1 ? 'Upvoted' : 'Downvoted',
      icon: userVote.value === 1 ? '👍' : '👎',
    };
  }, [hasVoted, userVote]);

  return (
    <article className="image-card relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group cursor-pointer">
      {/* Image Container with Natural Aspect Ratio */}
      <div 
        className="relative w-full bg-gray-100 dark:bg-gray-700"
        style={{ paddingBottom: `${aspectRatio * 100}%` }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 image-loading flex items-center justify-center">
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
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        )}

        {/* Vote Status Badge - Show only when voted and no error */}
        {voteStatus && !isError && (
          <div className={`vote-status ${voteStatus.isUpvote ? 'vote-status-up' : 'vote-status-down'}`}>
            {voteStatus.icon} {voteStatus.text}
          </div>
        )}

        {/* Error Status Badge */}
        {isError && (
          <div className="vote-status vote-status-error">
            ⚠️ Failed
          </div>
        )}

        {/* Voting Overlay - Show on hover when not voted OR when there's an error */}
        {(!hasVoted || isError) && (
          <div className="voting-overlay">
            <div className="voting-buttons">
              {isError ? (
                <button
                  className="vote-button vote-button-retry group"
                  onClick={(e) => {
                    e.stopPropagation();
                    retry();
                  }}
                  aria-label="Retry vote"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-bold">Retry</span>
                </button>
              ) : (
                <>
                  <button
                    className="vote-button vote-button-up group"
                    onClick={(e) => {
                      e.stopPropagation();
                      debouncedVote(1);
                    }}
                    aria-label="Vote up"
                  >
                    <HandThumbUpIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-bold">Up</span>
                  </button>
                  <button
                    className="vote-button vote-button-down group"
                    onClick={(e) => {
                      e.stopPropagation();
                      debouncedVote(-1);
                    }}
                    aria-label="Vote down"
                  >
                    <HandThumbDownIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-bold">Down</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Info (Optional - can be shown on hover) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium">Cat #{image.id.slice(0, 8)}</span>
            <span className="text-xs opacity-75">
              {image.width} × {image.height}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
});

MasonryCatImageCard.displayName = 'MasonryCatImageCard';