import { describe, it, expect } from 'vitest';
import { extractYear, formatDateString, getEffectiveMembershipYear } from '../date';
import type { MembershipRecord } from '../../types';

describe('Date Utility', () => {
  describe('extractYear', () => {
    it('YYYYMMDD から年を抽出する', () => {
      expect(extractYear('19490404')).toBe(1949);
      expect(extractYear('20241215')).toBe(2024);
    });

    it('ハイフン付き日付から年を抽出する', () => {
      expect(extractYear('1991-12-26')).toBe(1991);
    });

    it('数値の場合はそのまま返す', () => {
      expect(extractYear(2025)).toBe(2025);
    });

    it('空値または無効値は undefined を返す', () => {
      expect(extractYear('')).toBeUndefined();
      expect(extractYear(undefined)).toBeUndefined();
    });
  });

  describe('formatDateString', () => {
    it('8桁の日付を日本語・英語でフォーマットする', () => {
      expect(formatDateString('19490404', 'ja')).toBe('1949年4月4日');
      expect(formatDateString('19490404', 'en')).toBe('Apr 4, 1949');
    });

    it('6桁の年月をフォーマットする', () => {
      expect(formatDateString('202403', 'ja')).toBe('2024年3月');
      expect(formatDateString('202403', 'en')).toBe('Mar 2024');
    });

    it('4桁の年をフォーマットする', () => {
      expect(formatDateString('1949', 'ja')).toBe('1949年');
      expect(formatDateString('1949', 'en')).toBe('1949');
    });
  });

  describe('getEffectiveMembershipYear', () => {
    it('joined を最優先で有効年次とする', () => {
      const record: MembershipRecord = {
        countryCode: 'USA',
        status: 'member',
        joined: '19490824',
        signed: '19490404',
      };
      expect(getEffectiveMembershipYear(record)).toBe(1949);
    });

    it('joined がない場合は ratified や signed をフォールバックとする', () => {
      const record: MembershipRecord = {
        countryCode: 'JPN',
        status: 'signatory',
        signed: '20211105',
      };
      expect(getEffectiveMembershipYear(record)).toBe(2021);
    });
  });
});
