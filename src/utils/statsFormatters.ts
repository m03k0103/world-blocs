import type { StatIndicatorId } from '../types';
import { STAT_INDICATORS } from '../data/statIndicators';

/**
 * 指標に応じた数値の表示フォーマット
 */
export function formatStatValue(
  indicatorId: StatIndicatorId,
  value: number | undefined,
  language: 'ja' | 'en'
): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return language === 'ja' ? 'データなし' : 'No data';
  }

  if (indicatorId === 'population') {
    if (language === 'ja') {
      if (value >= 100000000) {
        return `${(value / 100000000).toFixed(2)}億人`;
      }
      if (value >= 10000) {
        return `${(value / 10000).toFixed(1)}万人`;
      }
      return `${value.toLocaleString()}人`;
    } else {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(2)}B`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)}M`;
      }
      return value.toLocaleString();
    }
  }

  if (indicatorId === 'gdp') {
    // gdp は百万USD単位
    const usd = value * 1000000;
    if (language === 'ja') {
      if (usd >= 1000000000000) {
        return `$${(usd / 1000000000000).toFixed(2)}兆`;
      }
      if (usd >= 100000000) {
        return `$${(usd / 100000000).toFixed(1)}億`;
      }
      return `$${value.toLocaleString()}M`;
    } else {
      if (usd >= 1000000000000) {
        return `$${(usd / 1000000000000).toFixed(2)}T`;
      }
      if (usd >= 1000000000) {
        return `$${(usd / 1000000000).toFixed(2)}B`;
      }
      return `$${value.toLocaleString()}M`;
    }
  }

  if (indicatorId === 'gdp_per_capita') {
    return `$${Math.round(value).toLocaleString()}`;
  }

  if (indicatorId === 'gender_gap') {
    return value.toFixed(3);
  }

  return String(value);
}

/**
 * 統計値に応じたグラデーションカラーの計算
 */
export function getChoroplethColor(
  indicatorId: StatIndicatorId,
  value: number | undefined,
  minVal: number,
  maxVal: number,
  isHovered = false
): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return isHovered ? '#94a3b8' : 'var(--map-neutral, #e2e8f0)';
  }

  const meta = STAT_INDICATORS[indicatorId];
  const palette = meta.palette;

  // 比率 (0.0 〜 1.0) の計算
  let ratio = 0;
  if (meta.scaleType === 'log') {
    const safeMin = Math.max(minVal, 1);
    const safeVal = Math.max(value, 1);
    const safeMax = Math.max(maxVal, safeMin + 1);
    const logMin = Math.log10(safeMin);
    const logMax = Math.log10(safeMax);
    const logVal = Math.log10(safeVal);
    ratio = (logVal - logMin) / (logMax - logMin);
  } else {
    // 線形スケール (ジェンダーギャップ指数など)
    const span = maxVal - minVal;
    ratio = span > 0 ? (value - minVal) / span : 0.5;
  }

  const clampedRatio = Math.max(0, Math.min(1, ratio));
  const index = Math.min(palette.length - 1, Math.floor(clampedRatio * palette.length));
  return palette[index];
}
