import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Framework } from '../types';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FrameworkComboboxProps {
  frameworks: Framework[];
  selectedFramework: Framework | null;
  onSelect: (framework: Framework | null) => void;
  placeholder?: string;
  variant?: 'default' | 'blue' | 'red';
  className?: string;
}

export const FrameworkCombobox: React.FC<FrameworkComboboxProps> = ({
  frameworks,
  selectedFramework,
  onSelect,
  placeholder,
  variant = 'default',
  className = '',
}) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // 表示名（日本語名/英語名の後にアクロニムを表示）
  const selectedLabel = useMemo(() => {
    if (!selectedFramework) return '';
    const name = language === 'en' ? selectedFramework.nameEn : selectedFramework.nameJa;
    return `${name} (${selectedFramework.acronym})`;
  }, [selectedFramework, language]);

  // 入力欄に表示するテキスト
  // ドロップダウンが開いていて検索中の場合は searchQuery、閉じている場合は selectedLabel
  const displayValue = isOpen ? searchQuery : selectedLabel;

  // 検索フィルタリング
  const filteredFrameworks = useMemo(() => {
    if (!searchQuery.trim()) return frameworks;
    const q = searchQuery.toLowerCase().trim();

    return frameworks.filter((f) => {
      const matchAcronym = f.acronym.toLowerCase().includes(q);
      const matchJa = f.nameJa.toLowerCase().includes(q);
      const matchEn = f.nameEn.toLowerCase().includes(q);
      const matchId = f.id.toLowerCase().includes(q);

      return matchAcronym || matchJa || matchEn || matchId;
    });
  }, [frameworks, searchQuery]);

  // 外部クリック検知で閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 候補リストの変化に応じてハイライト位置をリセット
  useEffect(() => {
    if (isOpen) {
      if (filteredFrameworks.length > 0) {
        // 現在選択中のアイテムがあればその位置をハイライト
        const idx = selectedFramework
          ? filteredFrameworks.findIndex((f) => f.id === selectedFramework.id)
          : 0;
        setHighlightedIndex(idx >= 0 ? idx : 0);
      } else {
        setHighlightedIndex(-1);
      }
    }
  }, [isOpen, filteredFrameworks, selectedFramework]);

  // ハイライトされたアイテムを視界内にスクロール
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const el = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setSearchQuery('');
      // 入力欄にフォーカス
      setTimeout(() => inputRef.current?.select(), 0);
    }
  };

  const handleSelectFramework = (f: Framework) => {
    onSelect(f);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setSearchQuery('');
    setHighlightedIndex(-1);
    if (isOpen) {
      inputRef.current?.focus();
    }
  };

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredFrameworks.length === 0) return;
      setHighlightedIndex((prev) => (prev + 1) % filteredFrameworks.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredFrameworks.length === 0) return;
      setHighlightedIndex((prev) => (prev - 1 + filteredFrameworks.length) % filteredFrameworks.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredFrameworks.length) {
        handleSelectFramework(filteredFrameworks[highlightedIndex]);
      } else if (filteredFrameworks.length === 1) {
        handleSelectFramework(filteredFrameworks[0]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // バリアント別のボダースタイル & フォーカスリング
  const variantStyles = {
    default:
      'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
    blue: 'bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
    red: 'bg-white dark:bg-slate-800 border-red-300 dark:border-red-700 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20',
  }[variant];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* 入力コンテナ */}
      <div
        onClick={handleOpen}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all cursor-text shadow-sm ${variantStyles}`}
      >
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => {
            if (!isOpen) setIsOpen(true);
            setSearchQuery(e.target.value);
          }}
          onFocus={handleOpen}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (t('comboboxSearchPlaceholder') as string) || (t('frameworkPlaceholder') as string)}
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-bold truncate"
        />

        {/* クリアボタン */}
        {(selectedFramework || searchQuery) && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
            title={t('clearSelection') as string}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* 展開矢印 */}
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            if (isOpen) {
              setIsOpen(false);
              setSearchQuery('');
            } else {
              handleOpen();
            }
          }}
          className="p-0.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-transform cursor-pointer"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* ドロップダウン候補リスト */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <ul
            ref={listboxRef}
            role="listbox"
            className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
          >
            {filteredFrameworks.length === 0 ? (
              <li className="px-4 py-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                {t('noFrameworkFound') as string}
              </li>
            ) : (
              filteredFrameworks.map((f, idx) => {
                const isSelected = selectedFramework?.id === f.id;
                const isHighlighted = idx === highlightedIndex;
                const name = language === 'en' ? f.nameEn : f.nameJa;

                return (
                  <li
                    key={f.id}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectFramework(f)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 font-bold'
                        : isHighlighted
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">
                        {name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono font-bold text-[11px] shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {f.acronym}
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
