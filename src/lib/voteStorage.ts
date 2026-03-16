const VOTES_KEY = 'feedback_votes';

export type VoteType = 'upvote' | 'downvote' | null;

interface VoteRecord {
  [feedbackId: string]: VoteType;
}

export const getVotes = (): VoteRecord => {
  try {
    const votes = localStorage.getItem(VOTES_KEY);
    return votes ? JSON.parse(votes) : {};
  } catch {
    return {};
  }
};

export const getVote = (feedbackId: string): VoteType => {
  const votes = getVotes();
  return votes[feedbackId] || null;
};

export const setVote = (feedbackId: string, voteType: VoteType): void => {
  const votes = getVotes();
  if (voteType === null) {
    delete votes[feedbackId];
  } else {
    votes[feedbackId] = voteType;
  }
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
};
