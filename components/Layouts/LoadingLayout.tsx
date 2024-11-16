import React, { useState, useEffect, ReactNode } from 'react';
interface LoadingLayoutProps {
  children: ReactNode;
}
const LoadingLayout: React.FC<LoadingLayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after the component mounts
    setIsLoading(false);

    // Add router event listeners for route changes
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener('beforeunload', handleStart);
    document.addEventListener('DOMContentLoaded', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      document.removeEventListener('DOMContentLoaded', handleComplete);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 z-50 flex items-center justify-center">
          <div className="relative">
            {/* Spinner */}
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </div>
  );
};

export default LoadingLayout;