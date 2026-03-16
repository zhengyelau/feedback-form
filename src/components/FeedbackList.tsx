import { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { Feedback, Category } from '../lib/database.types';
import { FeedbackCard } from './FeedbackCard';

const CATEGORIES: (Category | 'All')[] = ['All', 'Culture', 'Workflow', 'Technical', 'Other'];
const ITEMS_PER_PAGE = 10;

interface FeedbackListProps {
  refreshTrigger: number;
}

export function FeedbackList({ refreshTrigger }: FeedbackListProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<Category | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchFeedback();
  }, [refreshTrigger, filteredCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCategory]);

  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('feedback')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (filteredCategory !== 'All') {
        query = query.eq('category', filteredCategory);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setFeedback(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError('Failed to load feedback. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteUpdate = (feedbackId: string, upvotes: number, downvotes: number) => {
    setFeedback((prevFeedback) =>
      prevFeedback.map((item) =>
        item.id === feedbackId
          ? { ...item, upvotes, downvotes }
          : item
      )
    );
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={filteredCategory}
            onChange={(e) => setFilteredCategory(e.target.value as Category | 'All')}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <span className="text-sm text-gray-600">
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading feedback...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
          {error}
        </div>
      ) : feedback.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-12 rounded-lg text-center">
          {filteredCategory === 'All' ? (
            <p>No feedback yet. Be the first to share!</p>
          ) : (
            <p>No feedback in the {filteredCategory} category yet.</p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {feedback.map((item) => (
              <FeedbackCard key={item.id} feedback={item} onVoteUpdate={handleVoteUpdate} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  typeof page === 'number' ? (
                    <button
                      key={index}
                      onClick={() => handlePageClick(page)}
                      className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={index} className="px-2 text-gray-500">
                      {page}
                    </span>
                  )
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <span className="text-sm font-medium">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
