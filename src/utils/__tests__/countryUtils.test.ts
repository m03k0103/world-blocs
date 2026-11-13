import { describe, it, expect } from 'vitest';
import {
  getEntity,
  COUNTRY_BY_ALPHA3,
  COUNTRY_BY_NUMERIC,
  ENTITY_BY_ALPHA3,
  isHistoricalEntity,
} from '../countryUtils';

describe('countryUtils', () => {
  it('resolves sovereign states by alpha3 and numeric code', () => {
    const jpn = getEntity('JPN');
    expect(jpn).toBeDefined();
    expect(jpn?.nameEn).toBe('Japan');
    expect(COUNTRY_BY_ALPHA3['JPN']?.nameJa).toBe('日本');
    expect(COUNTRY_BY_NUMERIC['392']?.alpha3).toBe('JPN');
  });

  it('resolves non-state participants and their aliases', () => {
    expect(getEntity('EUR')?.alpha3).toBe('EUR');
    expect(getEntity('EU')?.alpha3).toBe('EUR');
    expect(getEntity('AFU')?.alpha3).toBe('AFU');
    expect(getEntity('AU')?.alpha3).toBe('AFU');
  });

  it('resolves historical entities and marks them correctly', () => {
    const sun = getEntity('SUN');
    const jpn = getEntity('JPN');
    expect(sun).toBeDefined();
    expect(sun?.entityType).toBe('historical_state');
    expect(isHistoricalEntity(sun)).toBe(true);
    expect(isHistoricalEntity(jpn)).toBe(false);
    expect(ENTITY_BY_ALPHA3['DDR']?.entityType).toBe('historical_state');
  });

  it('resolves legacy compatibility aliases', () => {
    expect(COUNTRY_BY_ALPHA3['C044']?.alpha3).toBe('BHS');
    expect(COUNTRY_BY_ALPHA3['KOS']?.alpha3).toBe('XKX');
  });

  it('returns undefined for empty or unknown codes', () => {
    expect(getEntity('')).toBeUndefined();
    expect(getEntity('UNKNOWN_999')).toBeUndefined();
  });
});
