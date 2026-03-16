import { MessageSquarePlus, Eye, ThumbsUp, Shield, ArrowRight } from 'lucide-react';

type View = 'submit' | 'wall';

interface InstructionCardProps {
  currentView: View;
}

export function InstructionCard({ currentView }: InstructionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">How to Use</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {currentView === 'submit' ? (
          <>
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-100">
                  <MessageSquarePlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-gray-900">Share Your Feedback</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Fill in the form above to share your thoughts, suggestions, or concerns with the team</p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-purple-100">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-gray-900">Completely Anonymous</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Your feedback is never tied to your identity. Speak freely without concerns</p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-teal-100">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-gray-900">View Wall</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Click the "View Wall" button to see all feedback and vote on submissions</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-100">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-gray-900">Browse All Feedback</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">See what feedback the team has shared and explore different perspectives</p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-green-100">
                  <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-gray-900">Support Feedback</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Click the upvote button to show support for feedback you agree with</p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-orange-100">
                  <MessageSquarePlus className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-gray-900">Submit Feedback</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Click the "Submit Feedback" button to share your own thoughts and ideas</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
