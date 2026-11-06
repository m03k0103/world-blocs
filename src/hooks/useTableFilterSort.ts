import { useState, useMemo, useCallback } from 'react';

export interface UseTableFilterSortOptions<T, SortKey extends string = string> {
  data: T[];
  searchQuery?: string;
  searchFilter?: (item: T, query: string) => boolean;
  regionFilter?: (item: T, selectedRegion: string) => boolean;
  initialSortField: SortKey;
  initialSortOrder?: 'asc' | 'desc';
  comparator: (a: T, b: T, field: SortKey, order: 'asc' | 'desc') => number;
}

export interface UseTableFilterSortResult<T, SortKey extends string = string> {
  search: string;
  setSearch: (q: string) => void;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  sortField: SortKey;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: SortKey) => void;
  filteredAndSortedData: T[];
}

/**
 * テーブルの検索、地域フィルタ、ソート（昇順/降順）を統一的に管理するカスタムフック
 */
export function useTableFilterSort<T, SortKey extends string = string>({
  data,
  searchFilter,
  regionFilter,
  initialSortField,
  initialSortOrder = 'asc',
  comparator,
}: UseTableFilterSortOptions<T, SortKey>): UseTableFilterSortResult<T, SortKey> {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortField, setSortField] = useState<SortKey>(initialSortField);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  const handleSort = useCallback((field: SortKey) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortOrder('asc');
      return field;
    });
  }, []);

  const filteredAndSortedData = useMemo(() => {
    const q = search.trim().toLowerCase();

    return data
      .filter((item) => {
        if (q && searchFilter && !searchFilter(item, q)) {
          return false;
        }
        if (selectedRegion !== 'all' && regionFilter && !regionFilter(item, selectedRegion)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => comparator(a, b, sortField, sortOrder));
  }, [data, search, searchFilter, selectedRegion, regionFilter, sortField, sortOrder, comparator]);

  return {
    search,
    setSearch,
    selectedRegion,
    setSelectedRegion,
    sortField,
    sortOrder,
    handleSort,
    filteredAndSortedData,
  };
}
