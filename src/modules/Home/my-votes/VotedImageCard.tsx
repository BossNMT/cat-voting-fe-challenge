import React, { memo, useState, useCallback, useMemo } from 'react';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useImage } from '../../../queries/useImages';
import type { Vote } from '../../../types/cat.types';

interface VotedImageCardProps {
  vote: Vote;
}

export const VotedImageCard: React.FC<VotedImageCardProps> = memo(({ vote }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const { data: image, isLoading: isImageQueryLoading } = useImage(vote.image_id);
  
  const voteDate = new Date(vote.created_at).toLocaleDateString();
  const isUpvote = vote.value === 1;

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  // Calculate aspect ratio for natural image display
  const aspectRatio = useMemo(() => {
    if (image?.width && image?.height) {
      return image.height / image.width;
    }
    return 1; // Default square if no dimensions
  }, [image?.width, image?.height]);

  const showLoading = imageLoading || isImageQueryLoading;
  const showError = imageError || (!isImageQueryLoading && !image);

  // Vote status info
  const voteStatus = useMemo(() => ({
    text: isUpvote ? 'Upvoted' : 'Downvoted',
    icon: isUpvote ? '👍' : '👎',
    color: isUpvote ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    bgColor: isUpvote ? 'bg-green-500' : 'bg-red-500',
  }), [isUpvote]);

  return (
    <article className="image-card relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group">
      {/* Image Container with Natural Aspect Ratio */}
      <div 
        className="relative w-full bg-gray-100 dark:bg-gray-700"
        style={{ paddingBottom: `${aspectRatio * 100}%` }}
      >
        {showLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        
        {showError ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🐱</div>
              <div className="text-sm">Image unavailable</div>
            </div>
          </div>
        ) : image ? (
          <img
            src={image.url}
            alt={`Cat ${image.id}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              !showLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : null}

        {/* Vote Status Badge */}
        <div className={`vote-status ${isUpvote ? 'vote-status-up' : 'vote-status-down'}`}>
          {voteStatus.icon} {voteStatus.text}
        </div>

        {/* Vote Date Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white text-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                <HandThumbUpIcon className={`w-4 h-4 inline mr-1 ${voteStatus.color}`} />
                {voteStatus.text}
              </span>
              <span className="text-xs opacity-75">
                {voteDate}
              </span>
            </div>
            {image && (
              <div className="text-xs opacity-75 mt-1">
                Cat #{image.id.slice(0, 8)} • {image.width} × {image.height}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

VotedImageCard.displayName = 'VotedImageCard';