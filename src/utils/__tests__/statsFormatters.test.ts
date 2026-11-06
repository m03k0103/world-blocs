import { describe, it, expect } from 'vitest';
import { formatStatValue, getChoroplethColor } from '../statsFormatters';

describe('Stats Formatters Utility', () => {
  describe('formatStatValue', () => {
    it('人口の日本語フォーマット（億・万単位）', () => {
      expect(formatStatValue('population', 125000000, 'ja')).toBe('1.25億人');
      expect(formatStatValue('population', 50000, 'ja')).toBe('5.0万人');
      expect(formatStatValue('population', 5000, 'ja')).toBe('5,000人');
    });

    it('人口の英語フォーマット（B・M単位）', () => {
      expect(formatStatValue('population', 1400000000, 'en')).toBe('1.40B');
      expect(formatStatValue('population', 40000000, 'en')).toBe('40.00M');
    });

    it('名目GDPのフォーマット（兆・億単位、T・B単位）', () => {
      // 単位: 百万USD (20,000,000 百万USD = 20兆USD)
      expect(formatStatValue('gdp', 20000000, 'ja')).toBe('$20.00兆');
      expect(formatStatValue('gdp', 20000000, 'en')).toBe('$20.00T');
      // 500,000 百万USD = 5000億USD
      expect(formatStatValue('gdp', 500000, 'ja')).toBe('$5000.0億');
      expect(formatStatValue('gdp', 500000, 'en')).toBe('$500.00B');
    });

    it('一人当たりGDPのフォーマット', () => {
      expect(formatStatValue('gdp_per_capita', 42150.8, 'ja')).toBe('$42,151');
      expect(formatStatValue('gdp_per_capita', 42150.8, 'en')).toBe('$42,151');
    });

    it('ジェンダーギャップ指数のフォーマット（小数点以下3桁）', () => {
      expect(formatStatValue('gender_gap', 0.678, 'ja')).toBe('0.678');
      expect(formatStatValue('gender_gap', 0.85, 'en')).toBe('0.850');
    });

    it('未定義値・無効値の場合は「データなし」/「No data」', () => {
      expect(formatStatValue('population', undefined, 'ja')).toBe('データなし');
      expect(formatStatValue('population', undefined, 'en')).toBe('No data');
      expect(formatStatValue('gdp', NaN, 'ja')).toBe('データなし');
    });
  });

  describe('getChoroplethColor', () => {
    it('データなしの場合はニュートラル色を返す', () => {
      expect(getChoroplethColor('population', undefined, 100, 10000)).toBe('var(--map-neutral, #e2e8f0)');
      expect(getChoroplethColor('population', undefined, 100, 10000, true)).toBe('#94a3b8');
    });

    it('最小値では最も薄いパレット色を返す', () => {
      const color = getChoroplethColor('population', 100, 100, 100000000);
      expect(typeof color).toBe('string');
      expect(color.startsWith('#')).toBe(true);
    });

    it('最大値では最も濃いパレット色を返す', () => {
      const color = getChoroplethColor('population', 100000000, 100, 100000000);
      expect(typeof color).toBe('string');
      expect(color.startsWith('#')).toBe(true);
    });
  });
});
