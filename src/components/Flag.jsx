/* ── Flag rendering that works on every platform ──────────────────────────
   Windows doesn't render regional-indicator flag emojis (shows "FR", "BR"…).
   We decode the emoji to its ISO country code and serve a real SVG image
   from flagcdn.com instead. Non-flag emojis pass through unchanged.
   ──────────────────────────────────────────────────────────────────────── */

/* Decode a flag emoji (two regional indicators) → ISO 3166-1 alpha-2 code */
function flagEmojiToCode(str) {
  if (!str) return null;
  const cps = [...str].map(c => c.codePointAt(0));
  const letters = cps
    .filter(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF)
    .map(cp => String.fromCharCode(cp - 0x1F1E6 + 65));
  if (letters.length === 2) return letters.join('').toLowerCase();
  return null;
}

/* Special sub-national / non-standard flags */
function specialCode(str) {
  if (!str) return null;
  // England black-flag tag sequence 🏴󠁧󠁢󠁥󠁮󠁧󠁿
  if (str.includes('\u{1F3F4}') && str.includes('\u{E0065}')) {
    if (str.includes('\u{E006E}')) return 'gb-eng'; // ...eng
    if (str.includes('\u{E0073}')) return 'gb-sct'; // ...sct
    if (str.includes('\u{E0077}')) return 'gb-wls'; // ...wls
  }
  return null;
}

export function codeFromString(str) {
  return flagEmojiToCode(str) || specialCode(str);
}

/* Single flag image (or the original emoji if not a flag) */
export function Flag({ emoji, size = 24, style = {} }) {
  const code = codeFromString(emoji);
  if (!code) {
    // Not a flag (globe, etc.) — render as-is
    return <span style={{ fontSize: size, ...style }}>{emoji}</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      width={Math.round(size * 1.33)}
      height={size}
      loading="lazy"
      style={{
        display: 'inline-block',
        borderRadius: 3,
        objectFit: 'cover',
        verticalAlign: 'middle',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        ...style,
      }}
    />
  );
}

/* A label like "🇧🇷 Brésil" → flag image + " Brésil" */
export function FlagText({ text, size = 18, style = {}, gap = 7 }) {
  if (!text) return null;
  // Grab the leading emoji cluster (everything up to the first space)
  const spaceIdx = text.indexOf(' ');
  const head = spaceIdx === -1 ? text : text.slice(0, spaceIdx);
  const rest = spaceIdx === -1 ? '' : text.slice(spaceIdx + 1);
  const code = codeFromString(head);

  if (!code) {
    // No flag (e.g. "???") — plain text
    return <span style={style}>{text}</span>;
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap, ...style }}>
      <Flag emoji={head} size={size} />
      <span>{rest}</span>
    </span>
  );
}
