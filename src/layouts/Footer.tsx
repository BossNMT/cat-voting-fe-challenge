import React, { memo } from 'react';

export const Footer: React.FC = memo(() => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Made with ❤️ for cat lovers everywhere
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';