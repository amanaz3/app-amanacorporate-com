import { useMemo, useCallback, useState, useRef, useEffect } from 'react';

interface VirtualizedTableOptions {
  data: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualizedTableResult {
  visibleItems: any[];
  totalHeight: number;
  offsetY: number;
  scrollElementProps: {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
  containerProps: {
    style: React.CSSProperties;
  };
  scrollToItem: (index: number, align?: 'start' | 'center' | 'end') => void;
}

export const useVirtualizedTable = ({
  data,
  itemHeight,
  containerHeight,
  overscan = 5
}: VirtualizedTableOptions): VirtualizedTableResult => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { visibleItems, offsetY, totalHeight } = useMemo(() => {
    const totalHeight = data.length * itemHeight;
    
    if (containerHeight >= totalHeight) {
      // No need for virtualization if all items fit
      return {
        visibleItems: data,
        offsetY: 0,
        totalHeight
      };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      data.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = data.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      virtualIndex: startIndex + index,
      absoluteIndex: startIndex + index
    }));

    const offsetY = startIndex * itemHeight;

    return {
      visibleItems,
      offsetY,
      totalHeight
    };
  }, [data, itemHeight, containerHeight, scrollTop, overscan]);

  const scrollElementProps = useMemo(() => ({
    onScroll: handleScroll,
    style: {
      height: containerHeight,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const
    }
  }), [handleScroll, containerHeight]);

  const containerProps = useMemo(() => ({
    style: {
      height: totalHeight,
      position: 'relative' as const,
      paddingTop: offsetY
    }
  }), [totalHeight, offsetY]);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!scrollElementRef.current) return;

    let scrollTop: number;
    
    switch (align) {
      case 'center':
        scrollTop = index * itemHeight - containerHeight / 2 + itemHeight / 2;
        break;
      case 'end':
        scrollTop = index * itemHeight - containerHeight + itemHeight;
        break;
      default: // 'start'
        scrollTop = index * itemHeight;
    }

    scrollTop = Math.max(0, Math.min(scrollTop, totalHeight - containerHeight));
    scrollElementRef.current.scrollTop = scrollTop;
  }, [itemHeight, containerHeight, totalHeight]);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    scrollElementProps,
    containerProps,
    scrollToItem
  };
};

// Hook for virtualized list with search
export const useVirtualizedSearch = <T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  itemHeight: number,
  containerHeight: number
) => {
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, searchFields]);

  const virtualized = useVirtualizedTable({
    data: filteredData,
    itemHeight,
    containerHeight,
    overscan: 3
  });

  return {
    ...virtualized,
    filteredData,
    totalItems: data.length,
    filteredItems: filteredData.length,
    isFiltered: searchTerm.trim().length > 0
  };
};