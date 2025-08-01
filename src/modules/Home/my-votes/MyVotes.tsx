import React, { memo } from 'react';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { MasonryGrid } from '../../../components/ui/MasonryGrid';
import { useUserVotes } from '../../../queries/useVotes';
import { VotedImageCard } from './VotedImageCard';

export const MyVotes: React.FC = memo(() => {
  const { data: userVotes = [], isLoading, error } = useUserVotes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your votes...</p>
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
            Failed to load votes
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

  if (userVotes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🗳️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No votes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Start voting on some adorable cats in the Gallery tab!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Voting History
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          You've voted on {userVotes.length} cat{userVotes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <MasonryGrid className="w-full">
        {userVotes.map((vote) => (
          <VotedImageCard key={vote.id} vote={vote} />
        ))}
      </MasonryGrid>
    </div>
  );
});

MyVotes.displayName = 'MyVotes';