import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/* ── Real FIFA World Cup Trophy SVG ─────────────────────────────────────────
   Modelled after the iconic Silvio Gazzaniga design:
   two human figures raising their arms to support the Earth globe.
   Gold body, green malachite base rings.
   ──────────────────────────────────────────────────────────────────────── */
const FIFA_TROPHY = (
  <svg viewBox="0 0 220 300" width="180" height="246" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#FFF0A0"/>
        <stop offset="30%"  stopColor="#FFD700"/>
        <stop offset="65%"  stopColor="#C8960C"/>
        <stop offset="100%" stopColor="#FFD700"/>
      </linearGradient>
      <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#E8B800"/>
        <stop offset="50%"  stopColor="#9A6B00"/>
        <stop offset="100%" stopColor="#C8960C"/>
      </linearGradient>
      <radialGradient id="globe" cx="40%" cy="35%" r="60%">
        <stop offset="0%"   stopColor="#A8E6FF"/>
        <stop offset="40%"  stopColor="#4FC3F7"/>
        <stop offset="100%" stopColor="#0277BD"/>
      </radialGradient>
      <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#FFD70044"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <clipPath id="globeClip">
        <circle cx="110" cy="52" r="32"/>
      </clipPath>
    </defs>

    {/* ── BASE PLATFORM ── */}
    {/* Bottom flat base */}
    <ellipse cx="110" cy="285" rx="52" ry="7" fill="#2a1a00" opacity="0.5"/>
    <rect x="68" y="270" width="84" height="14" rx="4" fill="url(#goldDark)"/>
    <rect x="72" y="272" width="76" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>

    {/* Malachite green rings */}
    <rect x="62" y="252" width="96" height="10" rx="3" fill="#1B5E20"/>
    <rect x="64" y="253" width="92" height="3" rx="1" fill="#2E7D32"/>
    <rect x="64" y="258" width="92" height="3" rx="1" fill="#1B5E20"/>

    <rect x="58" y="238" width="104" height="10" rx="3" fill="#1B5E20"/>
    <rect x="60" y="239" width="100" height="3" rx="1" fill="#388E3C"/>
    <rect x="60" y="244" width="100" height="3" rx="1" fill="#1B5E20"/>

    {/* Gold platform top */}
    <rect x="72" y="228" width="76" height="12" rx="3" fill="url(#gold)"/>
    <rect x="74" y="229" width="72" height="3" rx="1" fill="rgba(255,255,255,0.3)"/>

    {/* ── STEM / COLUMN ── */}
    {/* Narrow gold column */}
    <path d="M97 228 Q95 200 92 175 L128 175 Q125 200 123 228 Z" fill="url(#gold)"/>
    <path d="M100 228 Q99 200 97 175 L103 175 Q104 200 103 228 Z" fill="rgba(255,255,255,0.2)"/>

    {/* Wide flare at bottom of figures */}
    <path d="M80 175 Q85 168 110 165 Q135 168 140 175 Z" fill="url(#gold)"/>
    <path d="M82 175 Q87 170 110 167 Q133 170 138 175 Z" fill="rgba(255,255,255,0.15)"/>

    {/* ── TWO HUMAN FIGURES ── */}
    {/* Left figure — leaning outward, arm raised */}
    {/* Body */}
    <path d="M72 170 Q65 148 62 130 Q60 118 68 110 Q74 105 80 112 Q88 120 86 140 Q85 158 84 170 Z"
      fill="url(#gold)" filter="url(#softGlow)"/>
    {/* Left arm reaching up-right toward globe */}
    <path d="M68 112 Q58 98 64 82 Q68 74 75 76 Q82 80 80 92 Q78 102 80 112 Z"
      fill="url(#gold)"/>
    {/* Left leg suggestion */}
    <path d="M76 170 Q72 175 70 175 L80 175 Q80 172 80 170 Z" fill="url(#goldDark)"/>
    {/* Shine on left figure */}
    <path d="M70 130 Q68 118 72 112" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Right figure — mirror */}
    <path d="M148 170 Q155 148 158 130 Q160 118 152 110 Q146 105 140 112 Q132 120 134 140 Q135 158 136 170 Z"
      fill="url(#gold)" filter="url(#softGlow)"/>
    {/* Right arm */}
    <path d="M152 112 Q162 98 156 82 Q152 74 145 76 Q138 80 140 92 Q142 102 140 112 Z"
      fill="url(#gold)"/>
    {/* Right leg */}
    <path d="M144 170 Q148 175 150 175 L140 175 Q140 172 140 170 Z" fill="url(#goldDark)"/>
    {/* Shine on right figure */}
    <path d="M150 130 Q152 118 148 112" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* ── GLOBE ── */}
    {/* Glow halo */}
    <circle cx="110" cy="52" r="40" fill="url(#globeGlow)"/>
    {/* Ocean */}
    <circle cx="110" cy="52" r="32" fill="url(#globe)" filter="url(#softGlow)"/>
    {/* Continents */}
    <g clipPath="url(#globeClip)" fill="#2E7D32" opacity="0.85">
      {/* Americas */}
      <path d="M90 35 Q87 42 88 52 Q89 62 92 68 Q96 74 98 68 Q100 60 99 50 Q98 40 95 34 Z"/>
      {/* Europe/Africa */}
      <path d="M108 30 Q110 35 112 42 Q116 52 114 60 Q112 66 110 62 Q106 56 106 48 Q106 38 108 30 Z"/>
      {/* Asia */}
      <path d="M118 32 Q122 36 126 42 Q130 50 128 56 Q124 60 120 55 Q117 48 118 40 Z"/>
      {/* Small islands */}
      <ellipse cx="104" cy="72" rx="4" ry="3" transform="rotate(-20 104 72)"/>
    </g>
    {/* Globe shine */}
    <ellipse cx="100" cy="42" rx="10" ry="7" fill="rgba(255,255,255,0.35)" transform="rotate(-20 100 42)"/>
    {/* Globe border ring */}
    <circle cx="110" cy="52" r="32" fill="none" stroke="url(#gold)" strokeWidth="2.5"/>
    {/* Latitude lines suggestion */}
    <ellipse cx="110" cy="52" rx="32" ry="8" fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="1"/>
    <line x1="78" y1="52" x2="142" y2="52" stroke="rgba(255,215,0,0.25)" strokeWidth="1"/>

    {/* ── ARMS CONNECTING TO GLOBE ── */}
    <path d="M76 76 Q88 64 95 58" stroke="url(#gold)" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M144 76 Q132 64 125 58" stroke="url(#gold)" strokeWidth="7" fill="none" strokeLinecap="round"/>

    {/* Overall trophy glow */}
    <circle cx="110" cy="52" r="32" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.4" filter="url(#glow)"/>
  </svg>
);

/* ── Floating confetti dots ─────────────────────────────────────────────── */
const CONFETTI_COLORS = ['#FFD700','#E8001C','#00A550','#FFFFFF','#FF8C00','#00C853'];

function Confetti() {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 5 + (i * 5.5) % 90,
    y: 5 + (i * 7.3) % 85,
    size: 4 + (i % 4) * 3,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i * 0.4) % 3,
    duration: 2.5 + (i % 3),
    shape: i % 3 === 0 ? '2px' : '50%',
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {dots.map(d => (
        <div key={d.id} style={{
          position: 'absolute', left: `${d.x}%`, top: `${d.y}%`,
          width: d.size, height: d.size,
          background: d.color, borderRadius: d.shape,
          opacity: 0.55,
          animation: `cfloat${d.id % 4} ${d.duration}s ${d.delay}s infinite alternate ease-in-out`,
          boxShadow: `0 0 ${d.size}px ${d.color}88`,
        }}/>
      ))}
      <style>{`
        @keyframes cfloat0 { from{transform:translateY(0) rotate(0deg)} to{transform:translateY(-14px) rotate(15deg)} }
        @keyframes cfloat1 { from{transform:translateY(0) rotate(0deg)} to{transform:translateY(-10px) rotate(-20deg)} }
        @keyframes cfloat2 { from{transform:translateY(0) rotate(0deg)} to{transform:translateY(-18px) rotate(10deg)} }
        @keyframes cfloat3 { from{transform:translateY(0) rotate(0deg)} to{transform:translateY(-8px) rotate(-15deg)} }
      `}</style>
    </div>
  );
}

/* ── Volume slider ──────────────────────────────────────────────────────── */
function VolumeSlider({ label, icon, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, minWidth: 72, fontWeight: 600 }}>{label}</span>
      <div style={{ flex: 1, position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
          <div style={{ width: `${value * 100}%`, height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`, transition: 'width 0.1s' }}/>
        </div>
        <input type="range" min="0" max="1" step="0.05" value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', cursor: 'pointer' }}/>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, minWidth: 30, textAlign: 'right' }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

/* ── Main HomeScreen ────────────────────────────────────────────────────── */
export default function HomeScreen({ onPlay, sfxVol, setSfxVol, musicVol, setMusicVol, highScore }) {
  const [showOptions, setShowOptions] = useState(false);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setGlow(g => !g), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="no-select" style={{
      position: 'relative', width: '100%', height: '100%',
      /* Rich dark green field feel with vignette */
      background: `
        radial-gradient(ellipse at 50% 110%, #003300 0%, transparent 55%),
        radial-gradient(ellipse at 20% 0%, #8B000022 0%, transparent 50%),
        radial-gradient(ellipse at 80% 0%, #FFD70022 0%, transparent 50%),
        linear-gradient(170deg, #0a1f0d 0%, #0d1500 40%, #150000 100%)
      `,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 20px 36px',
      overflow: 'hidden',
    }}>
      <Confetti />

      {/* Grass texture lines */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: `repeating-linear-gradient(
          0deg,
          rgba(0,165,80,0.07) 0px, rgba(0,165,80,0.07) 12px,
          rgba(0,80,20,0.04) 12px, rgba(0,80,20,0.04) 24px
        )`,
        pointerEvents: 'none',
      }}/>

      {/* Red arc top-left */}
      <div style={{
        position: 'absolute', top: -80, left: -80, width: 220, height: 220,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #E8001C33 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>
      {/* Yellow arc top-right */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #FFD70033 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* ── HEADER ── */}
      <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        style={{ textAlign: 'center', zIndex: 2 }}>

        {/* FIFA badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #E8001C, #B30016)',
          borderRadius: 99, padding: '5px 16px',
          marginBottom: 10,
          boxShadow: '0 2px 16px #E8001C66',
        }}>
          <span style={{ fontSize: 14 }}>⚽</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: 3 }}>FIFA 2026</span>
          <span style={{ fontSize: 14 }}>⚽</span>
        </div>

        <h1 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(30px, 9vw, 52px)',
          fontWeight: 900, lineHeight: 1.05, letterSpacing: 1,
          /* Green → Yellow → Red diagonal — the 3 WC colors */
          background: 'linear-gradient(135deg, #00C853 0%, #FFD700 50%, #E8001C 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 12px rgba(255,215,0,0.4))',
        }}>
          WORLD CUP<br/>QUIZ
        </h1>
      </motion.div>

      {/* ── TROPHY ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15, type: 'spring', bounce: 0.35 }}
        style={{
          zIndex: 2,
          filter: 'drop-shadow(0 0 30px #FFD70099) drop-shadow(0 8px 40px rgba(0,0,0,0.6))',
          animation: 'trophyFloat 3.5s ease-in-out infinite',
        }}>
        {FIFA_TROPHY}
        <style>{`
          @keyframes trophyFloat {
            0%,100% { transform: translateY(0px) rotate(-0.5deg); }
            50%      { transform: translateY(-12px) rotate(0.5deg); }
          }
        `}</style>
      </motion.div>

      {/* ── BUTTONS ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.35, ease: 'easeOut' }}
        style={{ zIndex: 2, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* JOUER */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onPlay}
          style={{
            position: 'relative', width: '100%', padding: '20px 0',
            borderRadius: 22, border: 'none', cursor: 'pointer', overflow: 'hidden',
            /* Green-Yellow-Red gradient — FIFA colors */
            background: 'linear-gradient(135deg, #00A550 0%, #FFD700 50%, #E8001C 100%)',
            fontSize: 22, fontWeight: 900, color: '#fff',
            fontFamily: 'Orbitron, sans-serif', letterSpacing: 4,
            boxShadow: glow
              ? '0 0 0 3px #FFD70066, 0 0 40px #FFD70055, 0 0 80px #E8001C33, 0 10px 30px rgba(0,0,0,0.5)'
              : '0 0 0 2px #FFD70033, 0 0 20px #00A55044, 0 10px 30px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.8s ease',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}>
          {/* Shine overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }}/>
          ⚽  JOUER
        </motion.button>

        {/* OPTIONS */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowOptions(o => !o)}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 16,
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 3,
          }}>
          ⚙️  OPTIONS
        </motion.button>

        {/* Options panel */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1.5px solid rgba(255,215,0,0.25)',
                borderRadius: 18, padding: '18px 18px 6px',
                backdropFilter: 'blur(10px)',
              }}>
                <VolumeSlider label="Musique" icon="🎵" value={musicVol} onChange={setMusicVol} color="#FFD700"/>
                <VolumeSlider label="Effets"  icon="🔊" value={sfxVol}   onChange={setSfxVol}   color="#00C853"/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <div style={{ zIndex: 2, textAlign: 'center' }}>
        {highScore > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)',
              borderRadius: 99, padding: '5px 14px', marginBottom: 8,
            }}>
            <span style={{ fontSize: 14 }}>🏆</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>RECORD</span>
            <span style={{ fontSize: 14, fontFamily: 'Orbitron, sans-serif', fontWeight: 900, color: '#FFD700' }}>
              {highScore}
            </span>
          </motion.div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
          color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: 3 }}>
          <span style={{ color: '#00A550' }}>●</span>
          <span>USA · CANADA · MEXIQUE</span>
          <span style={{ color: '#E8001C' }}>●</span>
        </div>
      </div>
    </div>
  );
}
