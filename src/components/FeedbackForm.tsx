import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { Category } from '../lib/database.types';

const MAX_LENGTH = 500;
const CATEGORIES: Category[] = ['Culture', 'Workflow', 'Technical', 'Other'];

interface FeedbackFormProps {
  onSubmitSuccess: () => void;
}

export function FeedbackForm({ onSubmitSuccess }: FeedbackFormProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('Culture');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Please enter your feedback');
      return;
    }

    if (content.length > MAX_LENGTH) {
      setError(`Feedback must be ${MAX_LENGTH} characters or less`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('feedback')
        .insert({
          content: content.trim(),
          category,
          upvotes: 0,
          downvotes: 0,
        });

      if (submitError) throw submitError;

      setContent('');
      setCategory('Culture');
      onSubmitSuccess();
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_LENGTH - content.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Share Your Feedback</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Your Feedback
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts anonymously..."
            rows={4}
            maxLength={MAX_LENGTH}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-sm"
          />
          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-xs sm:text-sm ${
                remainingChars < 50 ? 'text-red-600 font-medium' : 'text-gray-500'
              }`}
            >
              {remainingChars} characters remaining
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
