import type { MembershipRecord, Language } from '../types';

/**
 * 日付文字列（または数値）から西暦4桁年を取り出すヘルパー
 * 例: "1949" -> 1949, "202412" -> 2024, "20241215" -> 2024, "2024-12-15" -> 2024
 */
export function extractYear(dateVal?: string | number): number | undefined {
  if (!dateVal) return undefined;
  if (typeof dateVal === 'number') return dateVal;
  const match = String(dateVal).trim().match(/^(\d{4})/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * yyyy, yyyymm, yyyymmdd 形式の日付文字列をユーザー向けにフォーマット
 */
export function formatDateString(dateStr?: string, lang: Language = 'ja'): string {
  if (!dateStr) return '';
  const clean = String(dateStr).trim().replace(/-/g, '');

  if (/^\d{8}$/.test(clean)) {
    const y = clean.slice(0, 4);
    const m = parseInt(clean.slice(4, 6), 10);
    const d = parseInt(clean.slice(6, 8), 10);
    if (lang === 'en') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[m - 1] || m} ${d}, ${y}`;
    }
    return `${y}年${m}月${d}日`;
  }

  if (/^\d{6}$/.test(clean)) {
    const y = clean.slice(0, 4);
    const m = parseInt(clean.slice(4, 6), 10);
    if (lang === 'en') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[m - 1] || m} ${y}`;
    }
    return `${y}年${m}月`;
  }

  if (/^\d{4}$/.test(clean)) {
    return lang === 'ja' ? `${clean}年` : clean;
  }

  return dateStr;
}

/**
 * 加盟・締結の代表年次（西暦数値）を取得
 * タイムラインアニメーションやスライダー判定、ソート用
 */
export function getEffectiveMembershipYear(m: MembershipRecord): number | undefined {
  // 優先度: joined -> accession -> inForce -> ratified -> firstParticipated -> declarationSigned
  //        -> candidate -> applied -> signed -> (移行互換プロパティ)
  const candidateVal =
    m.joined ||
    m.accession ||
    m.inForce ||
    m.ratified ||
    m.firstParticipated ||
    m.declarationSigned ||
    m.candidate ||
    m.applied ||
    m.signed ||
    m.joinedYear ||
    m.accessionYear ||
    m.inForceYear ||
    m.ratifiedYear ||
    m.candidateYear ||
    m.appliedYear ||
    m.signedYear;

  return extractYear(candidateVal);
}

/**
 * 資格停止・脱退の年次（西暦数値）を取得
 */
export function getInactiveYear(m: MembershipRecord): number | undefined {
  const inactiveVal = m.withdrawn || m.suspended || m.withdrawalNotified || m.withdrawnYear || m.suspendedYear;
  return extractYear(inactiveVal);
}

/**
 * 詳細表示用の年次ラベルとフォーマット済み文字列を生成
 * テーブル一覧や国詳細モーダル用
 */
export function getMembershipDateDetail(
  m: MembershipRecord,
  lang: Language = 'ja'
): {
  type: string;
  label: string;
  dateText: string;
  displayText: string;
} {
  // 1. 脱退
  if (m.status === 'withdrawn' && (m.withdrawn || m.withdrawnYear)) {
    const d = m.withdrawn ? formatDateString(m.withdrawn, lang) : `${m.withdrawnYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '脱退' : 'Withdrawn';
    return { type: 'withdrawn', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 2. 資格停止
  if (m.status === 'suspended' && (m.suspended || m.suspendedYear)) {
    const d = m.suspended ? formatDateString(m.suspended, lang) : `${m.suspendedYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '停止' : 'Suspended';
    return { type: 'suspended', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 3. 加入 (Accession)
  if (m.accession || m.accessionYear) {
    const d = m.accession ? formatDateString(m.accession, lang) : `${m.accessionYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '加入' : 'Accession';
    return { type: 'accession', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 4. 正式参加・加盟 (Joined)
  if (m.joined || m.joinedYear) {
    const d = m.joined ? formatDateString(m.joined, lang) : `${m.joinedYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '参加/加盟' : 'Joined';
    return { type: 'joined', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 5. 批准 (Ratified)
  if (m.ratified || m.ratifiedYear) {
    const d = m.ratified ? formatDateString(m.ratified, lang) : `${m.ratifiedYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '批准' : 'Ratified';
    return { type: 'ratified', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 6. 発効 (In force)
  if (m.inForce || m.inForceYear) {
    const d = m.inForce ? formatDateString(m.inForce, lang) : `${m.inForceYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '発効' : 'In Force';
    return { type: 'inForce', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 7. 初参加 (First Participated)
  if (m.firstParticipated) {
    const d = formatDateString(m.firstParticipated, lang);
    const label = lang === 'ja' ? '初参加' : 'First Participated';
    return { type: 'firstParticipated', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 8. 共同宣言署名 (Declaration Signed)
  if (m.declarationSigned) {
    const d = formatDateString(m.declarationSigned, lang);
    const label = lang === 'ja' ? '宣言署名' : 'Declaration Signed';
    return { type: 'declarationSigned', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 9. 候補認定 (Candidate)
  if (m.candidate || m.candidateYear) {
    const d = m.candidate ? formatDateString(m.candidate, lang) : `${m.candidateYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '候補認定' : 'Candidate';
    return { type: 'candidate', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 10. 署名 (Signed)
  if (m.signed || m.signedYear) {
    const d = m.signed ? formatDateString(m.signed, lang) : `${m.signedYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '署名' : 'Signed';
    return { type: 'signed', label, dateText: d, displayText: `${d} (${label})` };
  }

  // 11. 加盟申請 (Applied)
  if (m.applied || m.appliedYear) {
    const d = m.applied ? formatDateString(m.applied, lang) : `${m.appliedYear}${lang === 'ja' ? '年' : ''}`;
    const label = lang === 'ja' ? '申請' : 'Applied';
    return { type: 'applied', label, dateText: d, displayText: `${d} (${label})` };
  }

  return { type: 'none', label: '', dateText: '', displayText: '' };
}
