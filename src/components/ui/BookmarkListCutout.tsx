'use client';

export const BookmarkListCutout = () => {
  const items = Array.from({ length: 15 });

  return (
    <div className="absolute gap-2 flex w-full h-full left-0 top-0 z-10">
      {items.map((_, index) => 
        <div 
          key={index} 
          className="min-w-16 max-w-18 flex flex-1 h-full border-2 border-dashed rounded-md border-gray-200"/>
      )}
    </div>
  )
}