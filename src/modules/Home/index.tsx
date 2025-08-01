import React, { memo } from 'react';
import { useUIStore } from '../../store/uiStore';
import { Gallery } from './gallery/Gallery';
import { MyVotes } from './my-votes/MyVotes';

export const Home: React.FC = memo(() => {
  const { activeTab } = useUIStore();

  return (
    <>
      {activeTab === 0 ? <Gallery /> : <MyVotes />}
    </>
  );
});

Home.displayName = 'Home';