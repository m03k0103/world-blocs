import type { Framework, MembershipRecord, MembershipStatus } from '../types';
import { extractYear, getEffectiveMembershipYear } from './date';
import { isFullMemberStatus } from './entityUtils';

export type ComputedMember = MembershipRecord & { currentStatus: MembershipStatus };

/**
 * 選択された年における単一加盟主体のステータスを計算する
 */
export function computeMembershipStatusAtYear(
  m: MembershipRecord,
  establishedYear: number,
  targetYear: number
): MembershipStatus | null {
  let currentStatus: MembershipStatus | null = null;
  const effectiveJoinYear = getEffectiveMembershipYear(m);
  const candidateStartYear =
    extractYear(m.candidate) ||
    extractYear(m.negotiationsApproved) ||
    extractYear(m.negotiationsStarted) ||
    extractYear(m.applied) ||
    m.candidateYear ||
    m.negotiationsStartedYear ||
    m.appliedYear;
  const signedYear = extractYear(m.signed) || m.signedYear;
  const withdrawnYear =
    extractYear(m.withdrawn) || extractYear(m.withdrawalNotified) || m.withdrawnYear;
  const suspendedYear = extractYear(m.suspended) || m.suspendedYear;

  // 1. 加盟候補国、オブザーバー、パートナー、対話パートナーの場合
  if (
    m.status === 'candidate' ||
    m.status === 'observer' ||
    m.status === 'partner' ||
    m.status === 'dialogue'
  ) {
    const startYear = candidateStartYear || signedYear;
    if (startYear) {
      currentStatus = targetYear >= startYear ? m.status : null;
    } else {
      currentStatus = targetYear >= establishedYear ? m.status : null;
    }
  }
  // 2. 脱退国の場合
  else if (m.status === 'withdrawn') {
    if (withdrawnYear && targetYear >= withdrawnYear) {
      currentStatus = 'withdrawn';
    } else if (effectiveJoinYear && targetYear >= effectiveJoinYear) {
      currentStatus = m.joined || m.joinedYear ? 'member' : 'party';
    } else if (signedYear && targetYear >= signedYear) {
      currentStatus = 'signatory';
    } else {
      currentStatus = null;
    }
  }
  // 3. 参加資格停止国の場合 (suspended)
  else if (m.status === 'suspended') {
    if (suspendedYear && targetYear >= suspendedYear) {
      currentStatus = 'suspended';
    } else if (effectiveJoinYear && targetYear >= effectiveJoinYear) {
      currentStatus = m.joined || m.joinedYear ? 'member' : 'party';
    } else if (signedYear && targetYear >= signedYear) {
      currentStatus = 'signatory';
    } else {
      currentStatus = null;
    }
  }
  // 4. 署名撤回国 (unsigned)
  else if (m.status === 'unsigned') {
    if (withdrawnYear && targetYear >= withdrawnYear) {
      currentStatus = 'unsigned';
    } else if (signedYear && targetYear >= signedYear) {
      currentStatus = 'signatory';
    } else {
      currentStatus = null;
    }
  }
  // 5. 未締結・非当事国 (non_party / non-party)
  else if (m.status === 'non_party' || m.status === 'non-party') {
    currentStatus = targetYear >= establishedYear ? 'non_party' : null;
  }
  // 6. 正式加盟国・条約締約国・参加国・非国家参加者 (isFullMemberStatus)
  else if (isFullMemberStatus(m.status)) {
    if (effectiveJoinYear && targetYear >= effectiveJoinYear) {
      currentStatus = m.status;
    } else if (signedYear && targetYear >= signedYear) {
      currentStatus = 'signatory';
    } else if (candidateStartYear && targetYear >= candidateStartYear) {
      currentStatus = 'candidate';
    } else {
      currentStatus = null;
    }
  }
  // 7. 署名国 (signatory / signed)
  else if (m.status === 'signatory' || m.status === 'signed') {
    if (signedYear && targetYear >= signedYear) {
      currentStatus = m.status;
    } else {
      currentStatus = null;
    }
  }

  return currentStatus;
}

/**
 * 選択された年における枠組み内の有効メンバー一覧を算出する
 */
export function computeFrameworkMembersAtYear(
  framework: Framework | null,
  targetYear: number
): ComputedMember[] {
  if (!framework) return [];
  return framework.members
    .map((m) => ({
      ...m,
      currentStatus: computeMembershipStatusAtYear(m, framework.establishedYear, targetYear),
    }))
    .filter((m): m is ComputedMember => m.currentStatus !== null);
}
