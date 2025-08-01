import React, { memo } from 'react';
import Masonry from 'react-masonry-css';

interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
}

export const MasonryGrid: React.FC<MasonryGridProps> = memo(({ children, className = '' }) => {
  // Responsive breakpoints for masonry columns
  const breakpointColumnsObj = {
    default: 4,
    1536: 4,  // 2xl
    1280: 3,  // xl  
    1024: 3,  // lg
    768: 2,   // md
    640: 2,   // sm
    480: 1,   // xs
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={`masonry-grid ${className}`}
      columnClassName="masonry-grid-column"
    >
      {children}
    </Masonry>
  );
});

MasonryGrid.displayName = 'MasonryGrid';