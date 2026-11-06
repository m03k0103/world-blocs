import type { Framework, FrameworkCategory } from '../types';
import { FRAMEWORKS } from '../data/frameworksData';
import { isFullMemberStatus } from './entityUtils';

/**
 * 枠組みIDをキーとする O(1) 高速引当マップ
 */
export const FRAMEWORK_MAP: Record<string, Framework> = Object.fromEntries(
  FRAMEWORKS.map((f) => [f.id, f])
);

/**
 * 略称（acronym）をキーとする O(1) 引当マップ（小文字正規化）
 */
export const FRAMEWORK_BY_ACRONYM: Record<string, Framework> = Object.fromEntries(
  FRAMEWORKS.map((f) => [f.acronym.toLowerCase(), f])
);

/**
 * 文字列を正規化して比較（ハイフン・アンダースコア・スペースを無視して小文字化）
 */
export function normalizeFrameworkKey(str: string): string {
  return str.toLowerCase().replace(/[-_\s]+/g, '');
}

/**
 * 枠組みIDから枠組みオブジェクトを取得（O(1)）
 */
export function getFrameworkById(id: string | null | undefined): Framework | null {
  if (!id) return null;
  return FRAMEWORK_MAP[id] ?? null;
}

/**
 * ID・略称・エイリアスから枠組みを柔軟かつ正確に特定
 */
export function findFramework(key: string | null | undefined): Framework | null {
  if (!key) return null;
  const decoded = decodeURIComponent(key).trim();
  // まず O(1) ルックアップ
  const exact = FRAMEWORK_MAP[decoded] ?? FRAMEWORK_BY_ACRONYM[decoded.toLowerCase()];
  if (exact) return exact;

  // 正規化比較（エイリアス・ハイフン対応）
  const norm = normalizeFrameworkKey(decoded);
  return (
    FRAMEWORKS.find((f) => {
      if (normalizeFrameworkKey(f.id) === norm) return true;
      if (normalizeFrameworkKey(f.acronym) === norm) return true;
      if (f.aliases && f.aliases.some((a) => normalizeFrameworkKey(a) === norm)) return true;
      return false;
    }) || null
  );
}

/**
 * 指定カテゴリに属する枠組み一覧を取得
 */
export function getFrameworksByCategory(category: FrameworkCategory | 'all'): Framework[] {
  if (category === 'all') return FRAMEWORKS;
  return FRAMEWORKS.filter((f) => f.category === category);
}

/**
 * 枠組みの正式加盟国・締約国（isFullMemberStatus）メンバーコードの Set を取得
 */
export function getFrameworkFullMemberCodes(framework: Framework | null | undefined): Set<string> {
  const set = new Set<string>();
  if (!framework) return set;
  framework.members.forEach((m) => {
    if (isFullMemberStatus(m.status)) {
      set.add(m.countryCode);
    }
  });
  return set;
}
