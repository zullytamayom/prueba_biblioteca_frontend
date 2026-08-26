import React from 'react';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
};

export const PaginationControls: React.FC<Props> = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
      <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
        ◀ Prev
      </button>
      <div style={{ display: 'flex', gap: 6 }}>
        {pages.map((p) => (
          <button key={p} onClick={() => onPageChange(p)} style={{ fontWeight: p === currentPage ? 800 : 400 }}>
            {p}
          </button>
        ))}
      </div>
      <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
        Next ▶
      </button>
      {onPageSizeChange && (
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} style={{ marginLeft: 12 }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      )}
    </div>
  );
};

export default PaginationControls;
