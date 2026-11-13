import { describe, it, expect } from 'vitest';
import {
  isNonStateParticipant,
  isStateParticipant,
  isNonStateStatus,
  isStateMemberStatus,
  isFullMemberStatus,
  getEntityShortLabel,
  getEntity,
} from '../entityUtils';

describe('entityUtils', () => {
  it('distinguishes non-state and state participants', () => {
    expect(isNonStateParticipant('EUR')).toBe(true);
    expect(isNonStateParticipant('EU')).toBe(true);
    expect(isNonStateParticipant('AFU')).toBe(true);
    expect(isNonStateParticipant('AU')).toBe(true);
    expect(isNonStateParticipant('JPN')).toBe(false);
    expect(isNonStateParticipant(null)).toBe(false);

    expect(isStateParticipant('JPN')).toBe(true);
    expect(isStateParticipant('EUR')).toBe(false);

    const eur = getEntity('EUR');
    expect(isNonStateParticipant(eur)).toBe(true);
  });

  it('classifies membership statuses accurately', () => {
    expect(isNonStateStatus('non_state_member')).toBe(true);
    expect(isNonStateStatus('non_state_party')).toBe(true);
    expect(isNonStateStatus('member')).toBe(false);

    expect(isStateMemberStatus('member')).toBe(true);
    expect(isStateMemberStatus('party')).toBe(true);
    expect(isStateMemberStatus('participating_state')).toBe(true);
    expect(isStateMemberStatus('non_state_member')).toBe(false);

    expect(isFullMemberStatus('member')).toBe(true);
    expect(isFullMemberStatus('non_state_member')).toBe(true);
    expect(isFullMemberStatus('non_state_party')).toBe(true);
    expect(isFullMemberStatus('candidate')).toBe(false);
    expect(isFullMemberStatus('observer')).toBe(false);
    expect(isFullMemberStatus('withdrawn')).toBe(false);
  });

  it('returns short labels for entities and codes', () => {
    expect(getEntityShortLabel('EUR')).toBe('EU');
    expect(getEntityShortLabel('AFU')).toBe('AU');
    expect(getEntityShortLabel('JPN')).toBe('JP');
    expect(getEntityShortLabel(null)).toBe('');
  });
});
