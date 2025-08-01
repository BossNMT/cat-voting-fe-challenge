import React, { memo } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon, HandThumbDownIcon as HandThumbDownSolidIcon } from '@heroicons/react/24/solid';

interface VotingButtonProps {
  type: 'up' | 'down';
  isVoted: boolean;
  isCurrentVote: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const VotingButton: React.FC<VotingButtonProps> = memo(({
  type,
  isVoted,
  isCurrentVote,
  onClick,
  disabled = false,
}) => {
  const isUp = type === 'up';
  
  const baseClasses = 'flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const getClasses = () => {
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

  const Icon = isUp
    ? (isCurrentVote ? HandThumbUpSolidIcon : HandThumbUpIcon)
    : (isCurrentVote ? HandThumbDownSolidIcon : HandThumbDownIcon);

  return (
    <button
      className={getClasses()}
      onClick={onClick}
      disabled={disabled || isVoted}
      aria-label={`Vote ${type}`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {isUp ? 'Up' : 'Down'}
    </button>
  );
});

VotingButton.displayName = 'VotingButton';