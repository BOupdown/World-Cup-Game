import { motion } from 'framer-motion';

function getRank(score) {
  if (score >= 5000) return { label: 'CHAMPION DU MONDE !', emoji: '🏆', color: '#FFD700' };
  if (score >= 3000) return { label: 'STAR DE LA COUPE',    emoji: '⭐', color: '#00C853' };
  if (score >= 1500) return { label: 'PRO DU BALLON',       emoji: '⚽', color: '#FF8C00' };
  if (score >= 800)  return { label: 'AMATEUR PASSIONNÉ',   emoji: '🎯', color: '#E8001C' };
  return                    { label: 'SUPPORTER MOTIVÉ',    emoji: '📺', color: '#FFD700' };
}

function StatRow({ label, value, color, big }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{ fontSize: big ? 14 : 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: big ? 20 : 15, color, fontWeight: 900, fontFamily: big ? 'Orbitron, sans-serif' : undefined }}>
        {value}
      </span>
    </div>
  );
}

export default function GameOverScreen({ score, questionCount, highScore, isNewHigh, onReplay, onHome }) {
  const rank = getRank(score);

  return (
    <div className="no-select" style={{
      position: 'relative', width: '100%', height: '100%',
      background: `
        radial-gradient(ellipse at 50% 20%, ${rank.color}1a 0%, transparent 55%),
        radial-gradient(ellipse at 50% 100%, #003300 0%, transparent 50%),
        linear-gradient(160deg, #0f1505 0%, #100d00 50%, #1a0505 100%)
      `,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '28px 22px', overflow: 'hidden',
    }}>
      {/* Corner accents */}
      {[['top:0,left:0','135deg','#E8001C'],['top:0,right:0','225deg','#00A550'],
        ['bottom:0,left:0','45deg','#FFD700'],['bottom:0,right:0','315deg','#E8001C']].map(([pos,deg,c], i) => {
        const s = Object.fromEntries(pos.split(',').map(p => p.split(':')));
        return <div key={i} style={{ position:'absolute', ...s, width:70, height:70,
          background:`linear-gradient(${deg},${c}33,transparent)`, pointerEvents:'none' }}/>;
      })}

      {/* Emoji */}
      <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}
        style={{ fontSize: 70, marginBottom: 6, filter: `drop-shadow(0 0 22px ${rank.color}88)` }}>
        {rank.emoji}
      </motion.div>

      {/* New high score flash */}
      {isNewHigh && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
            borderRadius: 99, padding: '5px 18px', marginBottom: 8,
            fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 13,
            color: '#1a0d00', letterSpacing: 2,
            boxShadow: '0 0 30px #FFD70088',
          }}>
          🏆 NOUVEAU RECORD !
        </motion.div>
      )}

      {/* Rank */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(13px, 4vw, 18px)',
          fontWeight: 900, color: rank.color, letterSpacing: 2,
          textAlign: 'center', marginBottom: 4,
          textShadow: `0 0 18px ${rank.color}88`,
        }}>
        {rank.label}
      </motion.div>

      {/* Big score */}
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', bounce: 0.35 }}
        style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(58px, 18vw, 82px)', fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #00C853 0%, #FFD700 50%, #E8001C 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {score}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 2, fontWeight: 600 }}>
          points · {questionCount} questions
        </div>
      </motion.div>

      {/* Stats card */}
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          width: '100%', maxWidth: 340,
          background: 'rgba(0,0,0,0.45)',
          border: '1.5px solid rgba(255,215,0,0.18)',
          borderRadius: 20, padding: '4px 20px',
          marginBottom: 24, backdropFilter: 'blur(8px)',
        }}>
        <StatRow label="SCORE" value={score} color={rank.color} big/>
        <StatRow label="MEILLEUR RECORD" value={isNewHigh ? score : highScore} color="#FFD700" big/>
        <StatRow label="QUESTIONS RÉPONDUES" value={questionCount} color="rgba(255,255,255,0.7)"/>
        <StatRow label="MOYENNE PAR QUESTION" value={questionCount > 0 ? Math.round(score / questionCount) : 0} color="rgba(255,255,255,0.7)"/>
      </motion.div>

      {/* Buttons */}
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 340 }}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onReplay}
          style={{
            padding: '19px 0', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #00A550 0%, #FFD700 50%, #E8001C 100%)',
            color: '#fff', fontSize: 18, fontWeight: 900,
            fontFamily: 'Orbitron, sans-serif', letterSpacing: 3,
            boxShadow: '0 0 28px #FFD70055, 0 8px 24px rgba(0,0,0,0.5)',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
          🔄  REJOUER
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onHome}
          style={{
            padding: '14px 0', borderRadius: 16,
            border: '1.5px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 700, letterSpacing: 2,
            cursor: 'pointer',
          }}>
          🏠  MENU PRINCIPAL
        </motion.button>
      </motion.div>
    </div>
  );
}
