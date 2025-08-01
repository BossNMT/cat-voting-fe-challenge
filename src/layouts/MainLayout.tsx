import React, { useEffect } from 'react';
import { Footer } from './Footer';
import { ToastContainer } from '../components/ui/ToastContainer';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { useUIStore } from '../store/uiStore';
import { useToast } from '../hooks/useToast';
import { Header } from './Header';
import { Navigation } from './Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { globalError, clearGlobalError } = useUIStore();
  const { showToast } = useToast();

  // Show toast when there's a global error
  useEffect(() => {
    if (globalError) {
      showToast(globalError, 'error');
      clearGlobalError();
    }
  }, [globalError, showToast, clearGlobalError]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12">
            <Navigation />
          </div>
          
          <div className="min-h-[60vh]">
            {children}
          </div>
        </main>
        
        <Footer />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};