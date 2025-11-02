'use client';
import { useRouter } from 'next/navigation';

export default function ErrorDisplay({ 
  error, 
  onRetry, 
  title = "Something went wrong", 
  showRetry = true,
  showGoHome = true 
}) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {error || 'We encountered an unexpected error. Please try again.'}
        </p>
        <div className="space-y-3">
          {showRetry && (
            <button
              onClick={handleRetry}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          )}
          {showGoHome && (
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
