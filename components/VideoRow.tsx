
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { TELEGRAM_LINK } from '../constants';

interface VideoRowProps {
  title: string;
  items: string[];
}

const VideoRow: React.FC<VideoRowProps> = ({ title, items }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleRedirect = () => {
    // Only redirect if we weren't just dragging
    if (!isDragging) {
      window.open(TELEGRAM_LINK, '_blank');
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Drag Handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    // Small delay to prevent click trigger immediately after drag release
    setTimeout(() => setIsDragging(false), 50); 
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !rowRef.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    rowRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="space-y-2 mb-8 px-4 md:px-12 group relative">
      <h2 
        className="text-white text-lg md:text-2xl font-semibold cursor-pointer hover:text-gray-300 transition w-fit"
        onClick={handleRedirect}
      >
        {title}
      </h2>
      
      <div className="relative group/row">
        {/* Left Arrow */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-12 items-center justify-center hidden md:flex opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <ChevronLeft className="text-white w-8 h-8" />
        </button>

        {/* Scroll Container */}
        <div 
          ref={rowRef}
          className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth py-4 cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {items.map((imgUrl, index) => (
            <div 
              key={index}
              onClick={(e) => {
                // Prevent click if it was a drag operation
                 if (isDragging) {
                   e.preventDefault(); 
                   e.stopPropagation();
                 } else {
                   handleRedirect();
                 }
              }}
              className="relative min-w-[240px] md:min-w-[320px] aspect-video rounded overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:z-50 shadow-lg group/item select-none"
            >
              <img 
                src={imgUrl} 
                alt={`Thumbnail ${index}`} 
                className="w-full h-full object-cover pointer-events-none" // Prevent img drag default behavior
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <PlayCircle className="text-white w-12 h-12 drop-shadow-lg" />
              </div>

              {/* Badges */}
              <div className="absolute top-2 right-2 bg-[#E50914] text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/item:opacity-100 transition duration-300">
                NOVO
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-12 items-center justify-center hidden md:flex opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <ChevronRight className="text-white w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default VideoRow;