import type { Language } from '../types';

/**
 * 日本語・英語名称を持つエンティティから、指定言語の名称を安全に取得
 */
export function getLocalizedName(
  entity: { nameJa: string; nameEn: string } | null | undefined,
  language: Language
): string {
  if (!entity) return '';
  return language === 'en' ? entity.nameEn : entity.nameJa;
}

/**
 * `fieldBaseJa` / `fieldBaseEn` 形式のプロパティを持つオブジェクトから多言語フィールドを取得
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T | null | undefined,
  fieldBase: string,
  language: Language
): string {
  if (!obj) return '';
  const key = `${fieldBase}${language === 'en' ? 'En' : 'Ja'}`;
  const val = obj[key];
  return typeof val === 'string' ? val : '';
}
