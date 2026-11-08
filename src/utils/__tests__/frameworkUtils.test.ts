import { describe, it, expect } from 'vitest';
import {
  getFrameworkById,
  findFramework,
  getFrameworksByCategory,
  getFrameworkFullMemberCodes,
} from '../frameworkUtils';

describe('Framework Utility (frameworkUtils)', () => {
  describe('getFrameworkById', () => {
    it('存在する枠組みIDからオブジェクトを取得できる (O(1))', () => {
      const nato = getFrameworkById('nato');
      expect(nato).not.toBeNull();
      expect(nato?.id).toBe('nato');
      expect(nato?.acronym).toBe('NATO');
    });

    it('存在しないIDの場合は null を返す', () => {
      expect(getFrameworkById('unknown-id')).toBeNull();
      expect(getFrameworkById(undefined)).toBeNull();
    });
  });

  describe('findFramework', () => {
    it('略称（大文字・小文字・ハイフン問わず）で検索できる', () => {
      expect(findFramework('NATO')?.id).toBe('nato');
      expect(findFramework('nato')?.id).toBe('nato');
      expect(findFramework('CPTPP')?.id).toBe('cptpp');
      expect(findFramework('cptpp')?.id).toBe('cptpp');
      expect(findFramework('five-eyes')?.id).toBe('five_eyes');
    });

    it('エイリアス（別名）でも検索できる', () => {
      const eea = findFramework('EEA');
      expect(eea?.id).toBe('eea');
    });

    it('存在しないキーの場合は null を返す', () => {
      expect(findFramework('invalid-query-xyz')).toBeNull();
      expect(findFramework('')).toBeNull();
    });
  });

  describe('getFrameworksByCategory', () => {
    it('カテゴリごとの枠組み一覧を取得できる', () => {
      const security = getFrameworksByCategory('security');
      expect(security.length).toBe(9);
      expect(security.every((f) => f.category === 'security')).toBe(true);

      const all = getFrameworksByCategory('all');
      expect(all.length).toBe(40);
    });
  });

  describe('getFrameworkFullMemberCodes', () => {
    it('正式加盟国・締約国（member, party, participating_state等）のみを抽出する', () => {
      const nato = getFrameworkById('nato');
      const codes = getFrameworkFullMemberCodes(nato);
      // NATO 32カ国が含まれること
      expect(codes.has('USA')).toBe(true);
      expect(codes.has('GBR')).toBe(true);
      expect(codes.has('JPN')).toBe(false); // 日本は非加盟
    });
  });
});
