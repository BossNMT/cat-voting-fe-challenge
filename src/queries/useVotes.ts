import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catApi } from '../services/catApi';
import { QUERY_KEYS } from '../constants/query-keys';
import { subIdUtils } from '../utils/subId';
import type { Vote, CreateVoteRequest } from '../types/cat.types';

export const useUserVotes = (subId?: string) => {
  const userSubId = subId || subIdUtils.getSubId();

  return useQuery({
    queryKey: QUERY_KEYS.USER_VOTES(userSubId),
    queryFn: () => catApi.getUserVotes(userSubId),
    staleTime: 30 * 1000, // 30 seconds - votes might change
  });
};

export const useCreateVote = () => {
  const queryClient = useQueryClient();
  const subId = subIdUtils.getSubId();

  return useMutation({
    mutationFn: (voteData: Omit<CreateVoteRequest, 'sub_id'>) =>
      catApi.createVote({ ...voteData, sub_id: subId }),
    
    onMutate: async (voteData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USER_VOTES(subId) });

      // Snapshot the previous value
      const previousVotes = queryClient.getQueryData<Vote[]>(QUERY_KEYS.USER_VOTES(subId));

      // Optimistically update to the new value
      const optimisticVote: Vote = {
        id: `temp-${Date.now()}`,
        image_id: voteData.image_id,
        sub_id: subId,
        value: voteData.value,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Vote[]>(
        QUERY_KEYS.USER_VOTES(subId),
        (old = []) => [...old, optimisticVote]
      );

      // Return a context object with the snapshotted value
      return { previousVotes, optimisticVote };
    },

    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousVotes) {
        queryClient.setQueryData(QUERY_KEYS.USER_VOTES(subId), context.previousVotes);
      }
    },

    onSuccess: (data, _, context) => {
      // Update with real data from server
      queryClient.setQueryData<Vote[]>(
        QUERY_KEYS.USER_VOTES(subId),
        (old = []) => {
          // Remove optimistic vote and add real vote
          const withoutOptimistic = old.filter(vote => vote.id !== context?.optimisticVote.id);
          return [...withoutOptimistic, {
            id: data.id,
            image_id: data.image_id,
            sub_id: data.sub_id,
            value: data.value,
            created_at: new Date().toISOString(),
          }];
        }
      );
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_VOTES(subId) });
    },
  });
};

// Helper hook to check if user has voted on a specific image
export const useHasVoted = (imageId: string, subId?: string) => {
  const userSubId = subId || subIdUtils.getSubId();
  const { data: votes = [] } = useUserVotes(userSubId);
  
  const vote = votes.find(vote => vote.image_id === imageId);
  
  return {
    hasVoted: !!vote,
    vote,
  };
};