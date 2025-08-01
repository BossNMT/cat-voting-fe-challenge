export type CatImage = {
  id: string;
  url: string;
  width: number;
  height: number;
}

export type Vote = {
  id: string;
  image_id: string;
  sub_id: string;
  value: 1 | -1;
  created_at: string;
}

export type CreateVoteRequest = {
  image_id: string;
  sub_id: string;
  value: 1 | -1;
}

export type CreateVoteResponse = {
  message: string;
  id: string;
  image_id: string;
  sub_id: string;
  value: 1 | -1;
  country_code: string;
}

export type VotingState = {
  images: CatImage[];
  votes: Record<string, Vote>;
  userVotes: Vote[];
  loading: boolean;
  error: string | null;
  subId: string;
}