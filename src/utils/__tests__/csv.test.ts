import { describe, it, expect } from 'vitest';
import { sanitizeCsvCell, generateCsvContent } from '../csv';

describe('CSV Utility (sanitizeCsvCell & generateCsvContent)', () => {
  it('null または undefined の場合は空の引用符を返す', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('通常の文字列や数値をダブルクォートで囲む', () => {
    expect(sanitizeCsvCell('Japan')).toBe('"Japan"');
    expect(sanitizeCsvCell(12345)).toBe('"12345"');
  });

  it('文字列内のダブルクォートをエスケープする', () => {
    expect(sanitizeCsvCell('He said "Hello"')).toBe('"He said ""Hello"""');
  });

  it('Formula Injection (数式実行攻撃) 記号をシングルクォートでエスケープする', () => {
    // =, +, -, @, \t, \r で始まる悪意ある数式
    expect(sanitizeCsvCell('=1+1')).toBe("\"'=1+1\"");
    expect(sanitizeCsvCell('+123')).toBe("\"'+123\"");
    expect(sanitizeCsvCell('-50')).toBe("\"'-50\"");
    expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe("\"'@SUM(A1:A10)\"");
    expect(sanitizeCsvCell('\tcmd')).toBe("\"'\tcmd\"");
  });

  it('generateCsvContent で UTF-8 BOM と行末 CRLF が正しく生成される', () => {
    const headers = ['Country', 'Value'];
    const rows = [
      ['Japan', 100],
      ['USA', 200],
    ];
    const content = generateCsvContent(headers, rows);
    expect(content.startsWith('\uFEFF')).toBe(true);
    expect(content).toContain('"Country","Value"\r\n"Japan","100"\r\n"USA","200"');
  });
});
