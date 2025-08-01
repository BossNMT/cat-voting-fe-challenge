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
        <Tab.List className="flex space-x-1 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm p-1 border border-white/20">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-xl py-3 px-4 text-sm font-semibold leading-5 transition-all duration-200',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 hover:text-gray-900 dark:hover:text-white'
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