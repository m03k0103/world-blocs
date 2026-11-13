import { describe, it, expect } from 'vitest';
import {
  computeMembershipStatusAtYear,
  computeFrameworkMembersAtYear,
} from '../membershipUtils';
import type { Framework, MembershipRecord } from '../../types';

describe('membershipUtils', () => {
  it('transitions full member through candidate -> signatory -> member', () => {
    const member: MembershipRecord = {
      countryCode: 'SWE',
      status: 'member',
      applied: '20220518',
      signed: '20220705',
      joined: '20240307',
    };
    expect(computeMembershipStatusAtYear(member, 1949, 2021)).toBeNull();
    expect(computeMembershipStatusAtYear(member, 1949, 2022)).toBe('signatory');
    expect(computeMembershipStatusAtYear(member, 1949, 2023)).toBe('signatory');
    expect(computeMembershipStatusAtYear(member, 1949, 2024)).toBe('member');
  });

  it('transitions candidate -> signatory when candidate precedes signing', () => {
    const member: MembershipRecord = {
      countryCode: 'ALB',
      status: 'member',
      candidate: '2000',
      signed: '2008',
      joined: '2009',
    };
    expect(computeMembershipStatusAtYear(member, 1949, 1999)).toBeNull();
    expect(computeMembershipStatusAtYear(member, 1949, 2005)).toBe('candidate');
    expect(computeMembershipStatusAtYear(member, 1949, 2008)).toBe('signatory');
    expect(computeMembershipStatusAtYear(member, 1949, 2009)).toBe('member');
  });

  it('transitions withdrawn member from signatory -> party -> withdrawn', () => {
    const member: MembershipRecord = {
      countryCode: 'PHL',
      status: 'withdrawn',
      signed: '20001228',
      ratified: '20110830',
      withdrawn: '20190317',
    };
    expect(computeMembershipStatusAtYear(member, 1998, 1999)).toBeNull();
    expect(computeMembershipStatusAtYear(member, 1998, 2005)).toBe('signatory');
    expect(computeMembershipStatusAtYear(member, 1998, 2015)).toBe('party');
    expect(computeMembershipStatusAtYear(member, 1998, 2019)).toBe('withdrawn');
  });

  it('transitions suspended member from member -> suspended', () => {
    const member: MembershipRecord = {
      countryCode: 'VEN',
      status: 'suspended',
      joined: '20120731',
      suspended: '20161202',
    };
    expect(computeMembershipStatusAtYear(member, 1991, 2010)).toBeNull();
    expect(computeMembershipStatusAtYear(member, 1991, 2014)).toBe('member');
    expect(computeMembershipStatusAtYear(member, 1991, 2016)).toBe('suspended');
  });

  it('transitions unsigned country from signatory -> unsigned', () => {
    const member: MembershipRecord = {
      countryCode: 'USA',
      status: 'unsigned',
      signed: '20001231',
      withdrawn: '20020506',
    };
    expect(computeMembershipStatusAtYear(member, 1998, 1999)).toBeNull();
    expect(computeMembershipStatusAtYear(member, 1998, 2001)).toBe('signatory');
    expect(computeMembershipStatusAtYear(member, 1998, 2002)).toBe('unsigned');
  });

  it('handles non_party and candidate/observer without explicit start year using establishedYear', () => {
    const nonParty: MembershipRecord = { countryCode: 'IND', status: 'non_party' };
    const observer: MembershipRecord = { countryCode: 'VAT', status: 'observer' };

    expect(computeMembershipStatusAtYear(nonParty, 1970, 1969)).toBeNull();
    expect(computeMembershipStatusAtYear(nonParty, 1970, 1970)).toBe('non_party');
    expect(computeMembershipStatusAtYear(observer, 1970, 1969)).toBeNull();
    expect(computeMembershipStatusAtYear(observer, 1970, 1975)).toBe('observer');
  });

  it('computeFrameworkMembersAtYear filters out null statuses and handles null framework', () => {
    expect(computeFrameworkMembersAtYear(null, 2026)).toEqual([]);

    const fw: Framework = {
      id: 'test-fw',
      acronym: 'TEST',
      nameJa: 'テスト',
      nameEn: 'Test',
      category: 'security',
      established: '2000',
      establishedYear: 2000,
      description: 'Test',
      members: [
        { countryCode: 'JPN', status: 'member', joined: '2000' },
        { countryCode: 'FIN', status: 'member', joined: '2023' },
      ],
    };

    const at2010 = computeFrameworkMembersAtYear(fw, 2010);
    expect(at2010).toHaveLength(1);
    expect(at2010[0].countryCode).toBe('JPN');
    expect(at2010[0].currentStatus).toBe('member');

    const at2025 = computeFrameworkMembersAtYear(fw, 2025);
    expect(at2025).toHaveLength(2);
  });
});
