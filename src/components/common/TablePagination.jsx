import { ChevronLeft, ChevronRight } from 'lucide-react';

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push('ellipsis-start');
  }

  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis-end');
  }

  pages.push(totalPages);
  return pages;
};

const TablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  startItem,
  endItem,
  onPageChange,
}) => {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="px-5 py-3.5 border-t border-[#f1f5f9] bg-[#fcfdff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-xs font-medium text-[#64748b]">
        {totalItems === 0 ? (
          'Showing 0 of 0 entries'
        ) : (
          <>
            Showing{' '}
            <strong className="font-bold text-[#0f172a]">
              {startItem}–{endItem}
            </strong>{' '}
            of <strong className="font-bold text-[#0f172a]">{totalItems}</strong>{' '}
            <span className="text-[#94a3b8] ml-1">
              (Page {currentPage} of {totalPages})
            </span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || totalItems === 0}
          className="h-8 px-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f3f6fb] hover:text-[#0b57d0] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#475569] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {visiblePages.map((page) =>
          typeof page === 'string' ? (
            <span
              key={page}
              className="px-1.5 text-xs font-bold text-[#94a3b8] select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={totalItems === 0}
              className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                currentPage === page
                  ? 'bg-[#0b57d0] text-white shadow-[0_4px_12px_rgba(11,87,208,0.22)]'
                  : 'bg-[#f3f6fb] text-[#475569] hover:bg-[#e8effa] hover:text-[#0b57d0]'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalItems === 0}
          className="h-8 px-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f3f6fb] hover:text-[#0b57d0] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#475569] transition-colors cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
