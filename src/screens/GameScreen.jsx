import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/Particles.jsx';
import { Flag } from '../components/Flag.jsx';
import { haptic } from '../hooks/useHaptic.js';
import { nextQuestion } from '../data/questions.js';

const TIME_LIMIT   = 10;      // seconds per question
const BASE_POINTS  = 100;
const SPEED_BONUS  = 400;     // max extra points for instant answer

const BTN_COLORS = [
  { base: '#E8001C', dark: '#A3001A' },
  { base: '#00A550', dark: '#006B35' },
  { base: '#C8A000', dark: '#8a6e00' },
  { base: '#FF6B00', dark: '#B34B00' },
];
const LETTERS = ['A', 'B', 'C', 'D'];

/* ── Streak badge ── */
function StreakBadge({ streak, multiplier }) {
  if (streak < 2) return null;
  return (
    <motion.div
      key={streak}
      initial={{ scale: 0.5, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0.6 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: multiplier >= 3
          ? 'linear-gradient(135deg, #E8001C, #FF4560)'
          : multiplier >= 2
            ? 'linear-gradient(135deg, #FF6B00, #FFD700)'
            : 'linear-gradient(135deg, #00A550, #00C853)',
        borderRadius: 99, padding: '4px 10px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: 1,
      }}>
      🔥 {streak} série{multiplier > 1 && ` · x${multiplier}`}
    </motion.div>
  );
}

/* ── Timer bar ── */
function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100;
  const color = pct > 50 ? '#00C853' : pct > 25 ? '#FFD700' : '#E8001C';
  return (
    <div style={{ width: '100%', height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
      <motion.div
        animate={{ width: `${pct}%`, background: color }}
        transition={{ duration: 0.1, ease: 'linear' }}
        style={{ height: '100%', borderRadius: 99, boxShadow: `0 0 8px ${color}99` }}
      />
    </div>
  );
}

/* ── Points popup ── */
function PointsPopup({ points, multiplier }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{ y: -60, opacity: 0, scale: 1.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
        fontSize: multiplier > 1 ? 32 : 24,
        color: multiplier >= 3 ? '#E8001C' : multiplier >= 2 ? '#FFD700' : '#00C853',
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        pointerEvents: 'none', zIndex: 200, whiteSpace: 'nowrap',
      }}>
      +{points}{multiplier > 1 ? ` ×${multiplier}` : ''}
    </motion.div>
  );
}

/* ── Answer button ── */
function AnswerButton({ text, index, onClick, selected, correct, revealed }) {
  const c = BTN_COLORS[index];
  const isCorrect = revealed && index === correct;
  const isWrong   = revealed && index === selected && index !== correct;
  const isDimmed  = revealed && !isCorrect && !isWrong;

  let bg, border, shadow;
  if (!revealed) {
    bg = `rgba(255,255,255,0.06)`; border = `2px solid ${c.base}66`; shadow = 'none';
  } else if (isCorrect) {
    bg = `linear-gradient(135deg,${c.base}33,${c.base}55)`; border = `2px solid ${c.base}`; shadow = `0 0 20px ${c.base}77`;
  } else if (isWrong) {
    bg = 'linear-gradient(135deg,#E8001C22,#E8001C44)'; border = '2px solid #FF4560'; shadow = '0 0 20px #E8001C77';
  } else {
    bg = 'rgba(255,255,255,0.02)'; border = '2px solid rgba(255,255,255,0.06)'; shadow = 'none';
  }

  return (
    <motion.button
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.28, delay: 0.06 + index * 0.06, ease: [0.25,0.46,0.45,0.94] }}
      whileTap={!revealed ? { scale: 0.97 } : {}}
      onClick={() => !revealed && onClick(index)}
      style={{
        width: '100%', padding: '14px 16px', borderRadius: 14,
        border, background: bg, boxShadow: shadow,
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: revealed ? 'default' : 'pointer',
        transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
      }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: isDimmed ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg,${c.base},${c.dark})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: 14,
        color: isDimmed ? 'rgba(255,255,255,0.18)' : '#fff',
        boxShadow: isDimmed ? 'none' : `0 2px 8px ${c.base}55`,
      }}>
        {LETTERS[index]}
      </div>
      <span style={{
        fontSize: 14, fontWeight: 600, lineHeight: 1.3, flex: 1, textAlign: 'left',
        color: isDimmed ? 'rgba(255,255,255,0.2)' : '#fff',
      }}>
        {text}
      </span>
      {isCorrect && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.7 }} style={{ fontSize: 20 }}>✅</motion.span>
      )}
      {isWrong && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.7 }} style={{ fontSize: 20 }}>❌</motion.span>
      )}
    </motion.button>
  );
}

/* ── Main ── */
export default function GameScreen({ onGameOver, onQuit, playSfx, musicMuted, onToggleMute, highScore }) {
  const [q, setQ]               = useState(() => nextQuestion());
  const [score, setScore]       = useState(0);
  const [streak, setStreak]     = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showParts, setShowParts] = useState(false);
  const [cardKey, setCardKey]   = useState(0);
  const [lastPoints, setLastPoints] = useState(null);
  const [showPoints, setShowPoints] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const timerRef  = useRef(null);
  const advRef    = useRef(null);
  const timeRef   = useRef(TIME_LIMIT);
  const pausedRef = useRef(false);

  const multiplier = streak >= 6 ? 3 : streak >= 3 ? 2 : 1;

  /* ── Quit handlers ── */
  const handleQuitRequest = useCallback(() => {
    pausedRef.current = true;     // freeze countdown while deciding
    setShowQuitConfirm(true);
  }, []);

  const handleQuitCancel = useCallback(() => {
    pausedRef.current = false;    // resume countdown
    setShowQuitConfirm(false);
  }, []);

  const handleQuitConfirm = useCallback(() => {
    clearInterval(timerRef.current);
    clearTimeout(advRef.current);
    onQuit();
  }, [onQuit]);

  /* ── Advance to next question ── */
  const advance = useCallback((newScore, newStreak) => {
    advRef.current = setTimeout(() => {
      playSfx('transition');
      setTimeout(() => {
        setQ(nextQuestion());
        setQuestionCount(c => c + 1);
        setSelected(null);
        setRevealed(false);
        setShowFlash(false);
        setShowParts(false);
        setShowPoints(false);
        setTimeLeft(TIME_LIMIT);
        timeRef.current = TIME_LIMIT;
        setCardKey(k => k + 1);
      }, 280);
    }, 1100);
  }, [playSfx]);

  /* ── Handle answer ── */
  const handleAnswer = useCallback((ansIdx) => {
    if (revealed) return;
    clearInterval(timerRef.current);
    clearTimeout(advRef.current);

    const elapsed    = TIME_LIMIT - timeRef.current;
    const speedRatio = Math.max(0, 1 - elapsed / TIME_LIMIT);
    const correct    = ansIdx === q.correct;

    setSelected(ansIdx);
    setRevealed(true);
    setIsCorrect(correct);
    setShowFlash(true);

    if (correct) {
      const newStreak = streak + 1;
      const mult      = newStreak >= 6 ? 3 : newStreak >= 3 ? 2 : 1;
      const pts       = Math.round((BASE_POINTS + SPEED_BONUS * speedRatio) * mult);
      const newScore  = score + pts;

      setStreak(newStreak);
      setScore(newScore);
      setLastPoints(pts);
      setShowPoints(true);
      setShowParts(true);
      playSfx('correct');
      haptic('medium');
      advance(newScore, newStreak);
    } else {
      playSfx('wrong');
      haptic('error');
      clearTimeout(advRef.current);
      setTimeout(() => onGameOver(score, questionCount), 1600);
    }
  }, [revealed, q, streak, score, questionCount, advance, onGameOver, playSfx]);

  /* ── Countdown timer ── */
  useEffect(() => {
    timeRef.current = TIME_LIMIT;
    setTimeLeft(TIME_LIMIT);
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;   // frozen during quit confirmation
      timeRef.current -= 0.1;
      setTimeLeft(Math.max(0, timeRef.current));
      if (timeRef.current <= 0) {
        clearInterval(timerRef.current);
        if (!revealed) {
          playSfx('wrong');
          haptic('error');
          setRevealed(true);
          setIsCorrect(false);
          setShowFlash(true);
          setTimeout(() => onGameOver(score, questionCount), 1600);
        }
      }
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [cardKey]); // eslint-disable-line

  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(advRef.current); }, []);

  const isNewHigh = score > highScore;

  return (
    <div className="no-select" style={{
      position: 'relative', width: '100%', height: '100%',
      background: `
        radial-gradient(ellipse at 50% 100%, #002200 0%, transparent 55%),
        linear-gradient(160deg, #0f1a0a 0%, #0d1200 50%, #1a0500 100%)
      `,
      display: 'flex', flexDirection: 'column',
      padding: '14px 16px 24px', overflow: 'hidden',
    }}>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, zIndex: 1 }}>
        {/* Score */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700, #F5A623)',
          borderRadius: 12, padding: '5px 12px', flexShrink: 0,
          fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 18, color: '#1a0d00',
          boxShadow: '0 0 16px #FFD70055',
        }}>
          {score}
        </div>

        {/* Timer bar + question count */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
              Q.{questionCount}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: timeLeft < 3 ? '#E8001C' : timeLeft < 5 ? '#FFD700' : 'rgba(255,255,255,0.4)',
            }}>
              {timeLeft.toFixed(1)}s
            </span>
          </div>
          <TimerBar timeLeft={timeLeft} total={TIME_LIMIT}/>
        </div>

        {/* Mute */}
        <motion.button whileTap={{ scale: 0.88 }} onClick={onToggleMute}
          style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: musicMuted ? 'rgba(232,0,28,0.2)' : 'rgba(255,255,255,0.07)',
            border: musicMuted ? '1.5px solid #E8001C66' : '1.5px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, cursor: 'pointer',
          }}>
          {musicMuted ? '🔇' : '🎵'}
        </motion.button>

        {/* Quit */}
        <motion.button whileTap={{ scale: 0.88 }} onClick={handleQuitRequest}
          style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: 'rgba(232,0,28,0.12)',
            border: '1.5px solid rgba(232,0,28,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#FF4560', cursor: 'pointer',
          }}>
          ✕
        </motion.button>
      </div>

      {/* High score + streak row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>RECORD</span>
          <span style={{
            fontSize: 12, fontWeight: 800,
            color: isNewHigh ? '#FFD700' : 'rgba(255,255,255,0.4)',
          }}>
            {isNewHigh ? score : highScore}
          </span>
          {isNewHigh && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              style={{ fontSize: 12 }}>🏆</motion.span>
          )}
        </div>
        <StreakBadge streak={streak} multiplier={multiplier}/>
      </div>

      {/* ── QUESTION CARD ── */}
      <AnimatePresence mode="wait">
        <motion.div key={cardKey}
          initial={{ x: 80, opacity: 0, scale: 0.96 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -80, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.25,0.46,0.45,0.94] }}
          style={{
            background: 'linear-gradient(135deg,rgba(255,255,255,0.09) 0%,rgba(255,255,255,0.04) 100%)',
            border: '1.5px solid rgba(255,215,0,0.18)',
            borderRadius: 22, padding: '18px 16px',
            marginBottom: 12, zIndex: 1,
            boxShadow: '0 4px 28px rgba(0,0,0,0.4)',
          }}>
          <div style={{ fontSize: 34, textAlign: 'center', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
            <Flag emoji={q.emoji} size={34} style={{ borderRadius: 5 }}/>
          </div>
          <p style={{
            fontSize: 'clamp(14px, 4vw, 17px)', fontWeight: 700,
            color: '#fff', textAlign: 'center', lineHeight: 1.4,
          }}>
            {q.question}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ── ANSWERS ── */}
      <AnimatePresence mode="wait">
        <motion.div key={`ans-${cardKey}`}
          style={{ display: 'flex', flexDirection: 'column', gap: 9, zIndex: 1, flex: 1 }}>
          {q.answers.map((ans, i) => (
            <AnswerButton key={i} text={ans} index={i}
              onClick={handleAnswer} selected={selected} correct={q.correct} revealed={revealed}/>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── OVERLAYS ── */}
      {showFlash && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 60, pointerEvents: 'none',
            background: isCorrect
              ? 'radial-gradient(circle, #00A55044, transparent 70%)'
              : 'radial-gradient(circle, #E8001C55, transparent 70%)',
          }}
        />
      )}
      {showParts && <Particles count={26}/>}
      {showPoints && lastPoints && (
        <PointsPopup points={lastPoints} multiplier={multiplier}/>
      )}

      {/* ── QUIT CONFIRMATION ── */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleQuitCancel}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}>
            <motion.div
              initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 320,
                background: 'linear-gradient(160deg, #1a1208, #14100a)',
                border: '1.5px solid rgba(255,215,0,0.25)',
                borderRadius: 24, padding: '28px 24px', textAlign: 'center',
                boxShadow: '0 12px 50px rgba(0,0,0,0.6)',
              }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🏳️</div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 17,
                color: '#fff', marginBottom: 6, letterSpacing: 1,
              }}>
                Quitter la partie ?
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 22, lineHeight: 1.4 }}>
                Ton score de <span style={{ color: '#FFD700', fontWeight: 800 }}>{score}</span> points sera perdu.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleQuitConfirm}
                  style={{
                    padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #E8001C, #FF4560)',
                    color: '#fff', fontSize: 15, fontWeight: 900, letterSpacing: 2,
                    boxShadow: '0 4px 18px #E8001C55',
                  }}>
                  QUITTER
                </motion.button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleQuitCancel}
                  style={{
                    padding: '13px 0', borderRadius: 14,
                    border: '1.5px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 700, letterSpacing: 1,
                    cursor: 'pointer',
                  }}>
                  CONTINUER
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
