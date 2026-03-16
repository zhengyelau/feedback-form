import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { Feedback, Comment } from '../lib/database.types';
import { getVote, setVote, type VoteType } from '../lib/voteStorage';
import { getAnonymousIdentity } from '../lib/anonymousIdentity';

interface FeedbackCardProps {
  feedback: Feedback;
  onVoteUpdate: (feedbackId: string, upvotes: number, downvotes: number) => void;
}

export function FeedbackCard({ feedback, onVoteUpdate }: FeedbackCardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [userVote, setUserVote] = useState<VoteType>(null);

  useEffect(() => {
    setUserVote(getVote(feedback.id));
    fetchCommentCount();
  }, [feedback.id]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, feedback.id]);

  const fetchCommentCount = async () => {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('feedback_id', feedback.id);

    if (!error && count !== null) {
      setCommentCount(count);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('feedback_id', feedback.id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    const currentVote = getVote(feedback.id);

    let newUpvotes = feedback.upvotes;
    let newDownvotes = feedback.downvotes;

    if (currentVote === voteType) {
      return;
    }

    if (currentVote === 'upvote') {
      newUpvotes -= 1;
    } else if (currentVote === 'downvote') {
      newDownvotes -= 1;
    }

    if (voteType === 'upvote') {
      newUpvotes += 1;
    } else {
      newDownvotes += 1;
    }

    const { error } = await supabase
      .from('feedback')
      .update({
        upvotes: newUpvotes,
        downvotes: newDownvotes,
      })
      .eq('id', feedback.id);

    if (!error) {
      setVote(feedback.id, voteType);
      setUserVote(voteType);
      onVoteUpdate(feedback.id, newUpvotes, newDownvotes);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      const anonymousName = getAnonymousIdentity();

      const { error } = await supabase
        .from('comments')
        .insert({
          feedback_id: feedback.id,
          content: newComment.trim(),
          anonymous_name: anonymousName,
        });

      if (!error) {
        setNewComment('');
        await fetchComments();
        await fetchCommentCount();
      }
    } catch (err) {
      console.error('Comment submit error:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Culture: 'bg-purple-100 text-purple-700',
      Workflow: 'bg-blue-100 text-blue-700',
      Technical: 'bg-green-100 text-green-700',
      Other: 'bg-gray-100 text-gray-700',
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0 mb-3">
        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
          {feedback.category}
        </span>
        <span className="text-xs text-gray-500">{formatDate(feedback.created_at)}</span>
      </div>

      <p className="text-sm sm:text-base text-gray-800 mb-4 leading-relaxed">{feedback.content}</p>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleVote('upvote')}
            disabled={userVote === 'upvote'}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors ${
              userVote === 'upvote'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
            } disabled:cursor-not-allowed`}
            aria-label="Upvote"
          >
            <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{feedback.upvotes}</span>
          </button>

          <button
            onClick={() => handleVote('downvote')}
            disabled={userVote === 'downvote'}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors ${
              userVote === 'downvote'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
            } disabled:cursor-not-allowed`}
            aria-label="Downvote"
          >
            <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{feedback.downvotes}</span>
          </button>
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-medium">{commentCount}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            {comments.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold text-blue-600">
                      {comment.anonymous_name}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-800">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="flex gap-1.5 sm:gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmittingComment}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
