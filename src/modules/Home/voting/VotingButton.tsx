import React, { memo } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon, HandThumbDownIcon as HandThumbDownSolidIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface VotingButtonProps {
  type: 'up' | 'down';
  isVoted: boolean;
  isCurrentVote: boolean;
  onClick: () => void;
  disabled?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

export const VotingButton: React.FC<VotingButtonProps> = memo(({
  type,
  isVoted,
  isCurrentVote,
  onClick,
  disabled = false,
  hasError = false,
  onRetry,
}) => {
  const isUp = type === 'up';
  
  const baseClasses = 'flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const getClasses = () => {
    if (hasError) {
      return `${baseClasses} bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200`;
    }
    
    if (isCurrentVote) {
      return isUp
        ? `${baseClasses} bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200`
        : `${baseClasses} bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200`;
    }
    
    if (disabled || isVoted) {
      return `${baseClasses} bg-gray-100 text-gray-500 border-2 border-gray-200`;
    }
    
    return isUp
      ? `${baseClasses} bg-white text-green-600 border-2 border-green-200 hover:bg-green-50 hover:border-green-300`
      : `${baseClasses} bg-white text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300`;
  };

  const getIcon = () => {
    if (hasError) {
      return ArrowPathIcon;
    }
    
    return isUp
      ? (isCurrentVote ? HandThumbUpSolidIcon : HandThumbUpIcon)
      : (isCurrentVote ? HandThumbDownSolidIcon : HandThumbDownIcon);
  };

  const getButtonText = () => {
    if (hasError) {
      return 'Retry';
    }
    return isUp ? 'Up' : 'Down';
  };

  const handleClick = () => {
    if (hasError && onRetry) {
      onRetry();
    } else {
      onClick();
    }
  };

  const Icon = getIcon();

  return (
    <button
      className={getClasses()}
      onClick={handleClick}
      disabled={disabled || (isVoted && !hasError)}
      aria-label={hasError ? `Retry vote ${type}` : `Vote ${type}`}
    >
      <Icon className={`w-5 h-5 ${hasError ? 'animate-spin' : ''}`} />
      {getButtonText()}
    </button>
  );
});

VotingButton.displayName = 'VotingButton';