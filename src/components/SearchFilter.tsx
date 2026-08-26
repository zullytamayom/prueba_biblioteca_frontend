import React from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export const SearchFilter: React.FC<Props> = ({ value, onChange, placeholder }) => {
  return (
    <input
      aria-label="search"
      placeholder={placeholder ?? 'Buscar...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', minWidth: 220 }}
    />
  );
};

export default SearchFilter;
