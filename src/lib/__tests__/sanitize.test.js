import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../sanitize';

describe('escapeHtml', () => {
  it('escapes <, >, &, ", \'', () => {
    expect(escapeHtml('<script>alert("x")</script>'))
      .toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });

  it('returns empty string for non-strings', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(123)).toBe('');
  });

  it('preserves safe text', () => {
    expect(escapeHtml('Hello world')).toBe('Hello world');
  });
});
