import { useMemo, useState } from 'react';

/**
 * Pure client-side pagination hook.
 * Automatically resets to page 1 when `resetKey` or `items.length` changes,
 * without triggering synchronous setState inside useEffect.
 */
export const usePagination = (items = [], pageSize = 10, resetKey = '') => {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const [state, setState] = useState({
    page: 1,
    resetKey,
    totalItems,
  });

  const isStale = state.resetKey !== resetKey || state.totalItems !== totalItems;
  const currentPage = isStale
    ? 1
    : Math.min(Math.max(1, state.page), totalPages);

  const setCurrentPage = (nextPage) => {
    const resolved =
      typeof nextPage === 'function' ? nextPage(currentPage) : nextPage;
    const clamped = Math.min(Math.max(1, resolved), totalPages);
    setState({
      page: clamped,
      resetKey,
      totalItems,
    });
  };

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startItem,
    endItem,
    paginatedItems,
    setCurrentPage,
  };
};
