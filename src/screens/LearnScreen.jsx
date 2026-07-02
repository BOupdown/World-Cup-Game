import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { worldCups } from '../data/worldcups.js';
import { Flag, FlagText } from '../components/Flag.jsx';

function Card({ wc, onNext, onPrev, isFirst, isLast, index, total }) {
  const [flipped, setFlipped] = useState(false);
  const dragStart = useRef(0);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -60 && !isLast)  onNext();
    if (info.offset.x >  60 && !isFirst) onPrev();
  };

  return (
    <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 280 }}>
        {worldCups.map((_, i) => (
          <div key={i} style={{
            width: i === index ? 18 : 6, height: 6, borderRadius: 99,
            background: i === index ? wc.color || '#FFD700'
              : i < index ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
            transition: 'width 0.3s, background 0.3s',
          }}/>
        ))}
      </div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        onClick={() => setFlipped(f => !f)}
        style={{ width: '100%', cursor: 'pointer', perspective: 1000, userSelect: 'none' }}
        whileTap={{ scale: 0.98 }}>

        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ position: 'relative', width: '100%', transformStyle: 'preserve-3d' }}>

          {/* FRONT */}
          <div style={{
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: `linear-gradient(145deg, ${wc.color}33, ${wc.color}11)`,
            border: `1.5px solid ${wc.color}55`,
            borderRadius: 24, padding: '24px 20px',
            boxShadow: `0 8px 40px ${wc.color}33, 0 2px 12px rgba(0,0,0,0.5)`,
          }}>
            {/* Year badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: wc.color, borderRadius: 99, padding: '4px 16px',
              marginBottom: 14, boxShadow: `0 2px 12px ${wc.color}88`,
            }}>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
                fontSize: 18, color: '#fff' }}>{wc.year}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Flag emoji={wc.flag} size={42} style={{ borderRadius: 6 }} />
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: 1, marginBottom: 2 }}>
                  ORGANISATEUR
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{wc.host}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>VAINQUEUR</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFD700' }}><FlagText text={wc.winner} size={15}/></div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>FINALISTE</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}><FlagText text={wc.runnerUp} size={15}/></div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>ÉQUIPES</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#00C853' }}>{wc.teams}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>BUTS</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#E8001C' }}>{wc.goals}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 3 }}>⚽ MEILLEUR BUTEUR</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{wc.topScorer}</div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11,
              color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>
              Appuie pour voir les anecdotes →
            </div>
          </div>

          {/* BACK */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(145deg, ${wc.color}44, ${wc.color}22)`,
            border: `1.5px solid ${wc.color}88`,
            borderRadius: 24, padding: '24px 20px',
            boxShadow: `0 8px 40px ${wc.color}44`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
              fontSize: 16, color: wc.color, marginBottom: 18, letterSpacing: 1,
              textShadow: `0 0 16px ${wc.color}88`,
              display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flag emoji={wc.flag} size={18}/>
              <span>{wc.year} — Le saviez-vous ?</span>
            </div>
            {wc.facts.map((fact, i) => (
              <motion.div key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                  {['🏆','⭐','🎯','💡'][i % 4]}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.5, fontWeight: 500 }}>
                  {fact}
                </span>
              </motion.div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11,
              color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>
              ← Retourner la carte
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Nav arrows */}
      <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onPrev} disabled={isFirst}
          style={{
            width: 48, height: 48, borderRadius: 99,
            background: isFirst ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
            border: `1.5px solid ${isFirst ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)'}`,
            fontSize: 20, cursor: isFirst ? 'not-allowed' : 'pointer',
            opacity: isFirst ? 0.3 : 1,
          }}>←</motion.button>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 12,
          color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: 1 }}>
          {index + 1} / {total}
        </div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={onNext} disabled={isLast}
          style={{
            width: 48, height: 48, borderRadius: 99,
            background: isLast ? 'rgba(255,255,255,0.04)' : `${wc.color}44`,
            border: `1.5px solid ${isLast ? 'rgba(255,255,255,0.08)' : wc.color + '88'}`,
            fontSize: 20, cursor: isLast ? 'not-allowed' : 'pointer',
            opacity: isLast ? 0.3 : 1,
            boxShadow: isLast ? 'none' : `0 0 14px ${wc.color}55`,
          }}>→</motion.button>
      </div>
    </div>
  );
}

export default function LearnScreen({ onBack, onPlay }) {
  const [index, setIndex] = useState(0);

  const wc     = worldCups[index];
  const isFirst = index === 0;
  const isLast  = index === worldCups.length - 1;

  return (
    <div className="no-select" style={{
      position: 'relative', width: '100%', height: '100%',
      background: `
        radial-gradient(ellipse at 50% 0%, ${wc.color}18 0%, transparent 55%),
        linear-gradient(160deg, #0a1505 0%, #0d1000 50%, #0f0a00 100%)
      `,
      display: 'flex', flexDirection: 'column',
      padding: '16px 16px 24px', overflow: 'hidden',
      transition: 'background 0.5s ease',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, zIndex: 1 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.07)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            borderRadius: 12, padding: '8px 14px',
            color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700,
            cursor: 'pointer',
          }}>
          ← Retour
        </motion.button>

        <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
          fontSize: 13, color: '#FFD700', letterSpacing: 2 }}>
          📚 APPRENDRE
        </div>

        <motion.button whileTap={{ scale: 0.95 }} onClick={onPlay}
          style={{
            background: 'linear-gradient(135deg, #00A550, #FFD700)',
            border: 'none', borderRadius: 12, padding: '8px 14px',
            color: '#fff', fontSize: 13, fontWeight: 900,
            cursor: 'pointer', letterSpacing: 1,
            boxShadow: '0 2px 12px #00A55066',
          }}>
          Jouer ⚽
        </motion.button>
      </div>

      {/* Card area */}
      <AnimatePresence mode="wait">
        <motion.div key={index}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25,0.46,0.45,0.94] }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Card
            wc={wc} index={index} total={worldCups.length}
            isFirst={isFirst} isLast={isLast}
            onNext={() => setIndex(i => Math.min(i + 1, worldCups.length - 1))}
            onPrev={() => setIndex(i => Math.max(i - 1, 0))}
          />
        </motion.div>
      </AnimatePresence>

      {/* Hint */}
      <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)',
        letterSpacing: 1, marginTop: 8 }}>
        Swipe ou flèches pour naviguer · Tape pour retourner
      </div>
    </div>
  );
}
