import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getVisiblePages = (current, total) => {
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-1 mt-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="rounded-full"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getVisiblePages(currentPage, totalPages).map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          variant={currentPage === page ? 'default' : 'ghost'}
          className={`min-w-[36px] h-9 px-3 transition-all duration-200 ${
            currentPage === page ? 'bg-orange-500 text-white font-bold' : ''
          }`}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="rounded-full"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
