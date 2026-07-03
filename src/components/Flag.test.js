import { describe, it, expect } from 'vitest';
import { codeFromString } from './Flag.jsx';

describe('codeFromString (flag emoji → ISO country code)', () => {
  it('decodes standard flag emojis', () => {
    expect(codeFromString('🇫🇷')).toBe('fr');
    expect(codeFromString('🇧🇷')).toBe('br');
    expect(codeFromString('🇺🇾')).toBe('uy');
    expect(codeFromString('🇩🇪')).toBe('de');
  });

  it('decodes the England tag-sequence flag', () => {
    expect(codeFromString('🏴󠁧󠁢󠁥󠁮󠁧󠁿')).toBe('gb-eng');
  });

  it('returns null for non-flag emojis', () => {
    expect(codeFromString('🌍')).toBeNull();
    expect(codeFromString('⚽')).toBeNull();
    expect(codeFromString('🏆')).toBeNull();
  });

  it('returns null for empty or missing input', () => {
    expect(codeFromString('')).toBeNull();
    expect(codeFromString(undefined)).toBeNull();
  });
});
