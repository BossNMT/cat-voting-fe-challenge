export const QUERY_KEYS = {
  // Images
  IMAGES: ['images'] as const,
  IMAGE: (id: string) => ['images', id] as const,
  
  // Votes
  VOTES: ['votes'] as const,
  USER_VOTES: (subId: string) => ['votes', 'user', subId] as const,
  VOTE: (id: string) => ['votes', id] as const,
} as const;

export type QueryKeys = typeof QUERY_KEYS;