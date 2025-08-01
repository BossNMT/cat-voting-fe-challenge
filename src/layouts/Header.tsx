import React, { memo } from 'react';
import { DarkModeToggle } from '../components/ui/DarkModeToggle';

export const Header: React.FC = memo(() => {

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="text-4xl">🐱</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cat Voting App
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">
                Vote on adorable cat photos and see your choices!
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';