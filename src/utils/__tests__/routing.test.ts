import { describe, it, expect } from 'vitest';
import { parseRouteFromUrl, getTargetUrl, formatFrameworkSlug } from '../routing';
import { findFramework } from '../frameworkUtils';

describe('routing', () => {
  const base = '/world-blocs';

  it('parses root path as framework home', () => {
    const res = parseRouteFromUrl(base, '/world-blocs/', '', '');
    expect(res.mode).toBe('framework');
    expect(res.framework).toBeNull();
  });

  it('parses framework path /{ACRONYM}', () => {
    const res = parseRouteFromUrl(base, '/world-blocs/NATO', '', '');
    expect(res.mode).toBe('framework');
    expect(res.framework?.id).toBe('nato');
  });

  it('parses stats and countries paths', () => {
    expect(parseRouteFromUrl(base, '/world-blocs/stats', '', '').mode).toBe('stats');
    expect(parseRouteFromUrl(base, '/world-blocs/countries', '', '').mode).toBe('country');
    expect(parseRouteFromUrl(base, '/world-blocs/country', '', '').mode).toBe('country');
  });

  it('parses compare paths with two segments or combined -vs- slug', () => {
    const res1 = parseRouteFromUrl(base, '/world-blocs/compare/NATO/EU', '', '');
    expect(res1.mode).toBe('compare');
    expect(res1.compareA?.id).toBe('nato');
    expect(res1.compareB?.id).toBe('eu');

    const res2 = parseRouteFromUrl(base, '/world-blocs/compare/G7-vs-BRICS', '', '');
    expect(res2.mode).toBe('compare');
    expect(res2.compareA?.id).toBe('g7');
    expect(res2.compareB?.id).toBe('brics');
  });

  it('parses query parameter fallbacks', () => {
    const resCompare = parseRouteFromUrl(base, '/world-blocs/', '?mode=compare&a=g7&b=brics', '');
    expect(resCompare.mode).toBe('compare');
    expect(resCompare.compareA?.id).toBe('g7');
    expect(resCompare.compareB?.id).toBe('brics');

    const resFw = parseRouteFromUrl(base, '/world-blocs/', '?f=asean', '');
    expect(resFw.mode).toBe('framework');
    expect(resFw.framework?.id).toBe('asean');
  });

  it('parses hash fallbacks', () => {
    const resHashCompare = parseRouteFromUrl(base, '/world-blocs/', '', '#/compare/NATO/EU');
    expect(resHashCompare.mode).toBe('compare');
    expect(resHashCompare.compareA?.id).toBe('nato');
    expect(resHashCompare.compareB?.id).toBe('eu');

    const resHashFw = parseRouteFromUrl(base, '/world-blocs/', '', '#/G20');
    expect(resHashFw.mode).toBe('framework');
    expect(resHashFw.framework?.id).toBe('g20');
  });

  it('builds target URLs correctly via getTargetUrl', () => {
    const nato = findFramework('nato')!;
    const eu = findFramework('eu')!;

    expect(getTargetUrl(base, 'stats', null, null, null)).toBe('/world-blocs/stats');
    expect(getTargetUrl(base, 'country', null, null, null)).toBe('/world-blocs/countries');
    expect(getTargetUrl(base, 'framework', null, null, null)).toBe('/world-blocs/');
    expect(getTargetUrl(base, 'framework', nato, null, null)).toBe(
      `/world-blocs/${formatFrameworkSlug(nato)}`
    );
    expect(getTargetUrl(base, 'compare', null, null, null)).toBe('/world-blocs/compare');
    expect(getTargetUrl(base, 'compare', null, nato, null)).toBe(
      `/world-blocs/compare/${formatFrameworkSlug(nato)}`
    );
    expect(getTargetUrl(base, 'compare', null, nato, eu)).toBe(
      `/world-blocs/compare/${formatFrameworkSlug(nato)}/${formatFrameworkSlug(eu)}`
    );
  });
});
