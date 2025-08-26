// Poll types for the application

export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export type Poll = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  votesCount: number;
};

export type PollDetail = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  options: PollOption[];
  totalVotes: number;
};

export type CreatePollInput = {
  title: string;
  description?: string;
  options: { text: string }[];
};

export type VoteInput = {
  pollId: string;
  optionId: string;
};