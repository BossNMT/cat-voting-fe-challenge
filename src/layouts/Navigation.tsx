import React, { memo } from 'react';
import { Tab } from '@headlessui/react';
import { useUIStore } from '../store/uiStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Navigation: React.FC = memo(() => {
  const { activeTab, setActiveTab } = useUIStore();

  const tabs = [
    { name: 'Gallery', icon: '🖼️' },
    { name: 'My Votes', icon: '📊' },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-2xl bg-gray-100 dark:bg-gray-800 backdrop-blur-sm p-1 border border-gray-300 dark:border-gray-600 shadow-md">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-xl py-3 px-4 text-sm font-semibold leading-5 transition-all duration-200',
                  'ring-gray-400 ring-opacity-60 ring-offset-2 ring-offset-gray-200 dark:ring-offset-gray-700 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg transform scale-105 border border-gray-400 dark:border-gray-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                )
              }
            >
              <span className="mr-2 text-lg">{tab.icon}</span>
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
});

Navigation.displayName = 'Navigation';