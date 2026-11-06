/**
 * CSVエクスポート & セルサニタイズ共通ユーティリティ
 * - Formula Injection (数式実行脆弱性) 対策
 * - UTF-8 BOM による日本語 Excel 文字化け対策
 */

export interface CsvExportOptions {
  filename: string;
  headers: string[];
  rows: (string | number | undefined | null)[][];
}

/**
 * CSVセル値のサニタイズ
 * - 先頭が =, +, -, @, \t, \r の場合は ' を付与して数式インジェクションを防止
 * - ダブルクォーテーションを "" にエスケープし、全体をダブルクォーテーションで囲む
 */
export function sanitizeCsvCell(val: string | number | undefined | null): string {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * CSV文字列の生成（BOM付与）
 */
export function generateCsvContent(
  headers: string[],
  rows: (string | number | undefined | null)[][]
): string {
  const headerLine = headers.map(sanitizeCsvCell).join(',');
  const rowLines = rows.map((row) => row.map(sanitizeCsvCell).join(','));
  return '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
}

/**
 * ブラウザ上での CSV ファイルダウンロード実行
 */
export function exportToCsv({ filename, headers, rows }: CsvExportOptions): void {
  const csvContent = generateCsvContent(headers, rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.setAttribute('download', safeFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
