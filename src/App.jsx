import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomeScreen     from './screens/HomeScreen.jsx';
import GameScreen     from './screens/GameScreen.jsx';
import GameOverScreen from './screens/GameOverScreen.jsx';
import LearnScreen    from './screens/LearnScreen.jsx';
import { useSound }   from './hooks/useSound.js';

const SCREEN = { HOME: 'home', GAME: 'game', GAMEOVER: 'gameover', LEARN: 'learn' };
const HS_KEY = 'wcq_highscore';

function loadHighScore() {
  try { return parseInt(localStorage.getItem(HS_KEY) || '0', 10); }
  catch { return 0; }
}
function saveHighScore(s) {
  try { localStorage.setItem(HS_KEY, String(s)); }
  catch { /* private-browsing mode: storage unavailable, score just won't persist */ }
}

const PAGE_VARIANTS = {
  initial: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit:    (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function App() {
  const [screen, setScreen]               = useState(SCREEN.HOME);
  const [dir, setDir]                     = useState(1);
  const [sfxVol, setSfxVol]               = useState(0.7);
  const [musicVol, setMusicVol]           = useState(0.3);
  const [musicMuted, setMusicMuted]       = useState(false);
  const [finalScore, setFinalScore]       = useState(0);
  const [finalQuestions, setFinalQuestions] = useState(0);
  const [highScore, setHighScore]         = useState(loadHighScore);
  const [isNewHigh, setIsNewHigh]         = useState(false);

  const { playSfx, startMusic, setMusicVolume, muteMusic, unmuteMusic } =
    useSound(sfxVol, musicVol);

  const handleSetMusicVol = useCallback((v) => {
    setMusicVol(v); setMusicVolume(v);
  }, [setMusicVolume]);

  const handleToggleMute = useCallback(() => {
    setMusicMuted(m => { m ? unmuteMusic() : muteMusic(); return !m; });
  }, [muteMusic, unmuteMusic]);

  const navigate = (to, direction = 1) => { setDir(direction); setScreen(to); };

  const handlePlay = useCallback(() => {
    startMusic();
    navigate(SCREEN.GAME, 1);
  }, [startMusic]);

  const handleGameOver = useCallback((score, qCount) => {
    const hs = loadHighScore();
    const newHigh = score > hs;
    if (newHigh) { saveHighScore(score); setHighScore(score); }
    setFinalScore(score);
    setFinalQuestions(qCount);
    setIsNewHigh(newHigh);
    navigate(SCREEN.GAMEOVER, 1);
  }, []);

  const handleReplay = useCallback(() => navigate(SCREEN.GAME, -1), []);
  const handleHome   = useCallback(() => navigate(SCREEN.HOME, -1), []);
  const handleLearn  = useCallback(() => navigate(SCREEN.LEARN, 1), []);

  return (
    <div style={{
      width: '100vw', height: '100dvh',
      maxWidth: 480, margin: '0 auto',
      position: 'relative', overflow: 'hidden', background: '#000',
    }}>
      <AnimatePresence mode="wait" custom={dir}>
        {screen === SCREEN.HOME && (
          <motion.div key="home" custom={dir} variants={PAGE_VARIANTS}
            initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.34, ease: [0.25,0.46,0.45,0.94] }}
            style={{ position: 'absolute', inset: 0 }}>
            <HomeScreen
              onPlay={handlePlay}
              onLearn={handleLearn}
              sfxVol={sfxVol}   setSfxVol={setSfxVol}
              musicVol={musicVol} setMusicVol={handleSetMusicVol}
              highScore={highScore}
            />
          </motion.div>
        )}
        {screen === SCREEN.GAME && (
          <motion.div key="game" custom={dir} variants={PAGE_VARIANTS}
            initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.34, ease: [0.25,0.46,0.45,0.94] }}
            style={{ position: 'absolute', inset: 0 }}>
            <GameScreen
              onGameOver={handleGameOver}
              onQuit={handleHome}
              playSfx={playSfx}
              musicMuted={musicMuted}
              onToggleMute={handleToggleMute}
              highScore={highScore}
            />
          </motion.div>
        )}
        {screen === SCREEN.LEARN && (
          <motion.div key="learn" custom={dir} variants={PAGE_VARIANTS}
            initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.34, ease: [0.25,0.46,0.45,0.94] }}
            style={{ position: 'absolute', inset: 0 }}>
            <LearnScreen onBack={handleHome} onPlay={handlePlay}/>
          </motion.div>
        )}
        {screen === SCREEN.GAMEOVER && (
          <motion.div key="gameover" custom={dir} variants={PAGE_VARIANTS}
            initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.34, ease: [0.25,0.46,0.45,0.94] }}
            style={{ position: 'absolute', inset: 0 }}>
            <GameOverScreen
              score={finalScore}
              questionCount={finalQuestions}
              highScore={highScore}
              isNewHigh={isNewHigh}
              onReplay={handleReplay}
              onHome={handleHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
