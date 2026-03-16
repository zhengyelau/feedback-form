import { useState } from 'react';
import { Users, MessageSquarePlus, Eye } from 'lucide-react';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { InstructionCard } from './components/InstructionCard';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';

type View = 'submit' | 'wall';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentView, setCurrentView] = useState<View>('submit');
  const { toasts, removeToast, showSuccess } = useToast();

  const handleSubmitSuccess = () => {
    showSuccess('Feedback submitted successfully!');
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Team Feedback Loop</h1>
          </div>
          <p className="text-gray-600">Share your thoughts anonymously and help improve our team</p>
        </header>

        <InstructionCard currentView={currentView} />

        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setCurrentView('submit')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              currentView === 'submit'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <MessageSquarePlus className="w-5 h-5" />
            Submit Feedback
          </button>
          <button
            onClick={() => setCurrentView('wall')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              currentView === 'wall'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <Eye className="w-5 h-5" />
            View Wall
          </button>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {currentView === 'submit' ? (
            <div key="submit" className="animate-fadeIn">
              <FeedbackForm onSubmitSuccess={handleSubmitSuccess} />
            </div>
          ) : (
            <div key="wall" className="animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Wall</h2>
              <FeedbackList refreshTrigger={refreshTrigger} />
            </div>
          )}
        </div>

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
