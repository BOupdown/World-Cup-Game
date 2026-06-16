import { useRef, useCallback, useEffect } from 'react';

/* ── Shared AudioContext ─────────────────────────────────────────────────── */
let _ctx = null;
function getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}

/* ── Tiny helpers ────────────────────────────────────────────────────────── */
function osc(ctx, dest, type, freq, start, dur, vol, detune = 0) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(dest);
  o.type = type; o.frequency.value = freq; o.detune.value = detune;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.start(start); o.stop(start + dur + 0.02);
}

function noiseHit(ctx, dest, start, dur, vol, hp = 800) {
  const len = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f   = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g   = ctx.createGain();
  src.connect(f); f.connect(g); g.connect(dest);
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  src.start(start); src.stop(start + dur + 0.02);
}

/* ── SFX ─────────────────────────────────────────────────────────────────── */
function sfxCorrect(ctx, vol) {
  const t = ctx.currentTime, out = ctx.destination;
  [[261.63,0],[329.63,.08],[392,.16],[523.25,.26]].forEach(([f, d]) => {
    osc(ctx, out, 'sine', f, t + d, 0.28, vol * 0.6);
  });
  osc(ctx, out, 'sine', 1046.5, t + 0.38, 0.4, vol * 0.35);
}

function sfxWrong(ctx, vol) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(190, t);
  o.frequency.linearRampToValueAtTime(65, t + 0.42);
  g.gain.setValueAtTime(vol * 0.7, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  o.start(t); o.stop(t + 0.48);
  noiseHit(ctx, ctx.destination, t, 0.07, vol * 0.15, 200);
}

function sfxTransition(ctx, vol) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = 'sine';
  o.frequency.setValueAtTime(380, t);
  o.frequency.exponentialRampToValueAtTime(1100, t + 0.15);
  g.gain.setValueAtTime(vol * 0.35, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  o.start(t); o.stop(t + 0.2);
}

/* ── Background music ──────────────────────────────────────────────────────
   Strategy: schedule only 1 bar at a time every ~500ms (much lighter).
   Melody: catchy 4-bar phrase looped. Chords + bass + drums.
   ──────────────────────────────────────────────────────────────────────── */
const BPM  = 116;
const BEAT = 60 / BPM;
const BAR  = BEAT * 4;

// Melody notes — 4 bar phrase
const MELODY_PHRASE = [
  // bar 0
  [[523.25,.5],[659.25,.5],[783.99,1],[659.25,.5],[587.33,.5]],
  // bar 1
  [[523.25,.5],[587.33,.5],[659.25,.5],[783.99,.5],[880,.5],[783.99,.5],[659.25,.5],[587.33,.5]],
  // bar 2
  [[783.99,.5],[659.25,.5],[523.25,1],[392,.5],[440,.5]],
  // bar 3
  [[523.25,1],[392,.5],[329.63,.5],[261.63,1],[329.63,.5],[392,.5]],
];

// Chord roots (I V vi IV)
const CHORD_ROOTS = [261.63, 196, 220, 174.61];
const CHORD_THIRDS= [329.63, 246.94, 261.63, 220];
const CHORD_FIFTHS= [392,    293.66, 329.63, 261.63];

// Bass notes per beat per bar
const BASS_BARS = [
  [130.81, 196,    130.81, 196],
  [196,    146.83, 196,    146.83],
  [110,    164.81, 110,    164.81],
  [174.61, 130.81, 174.61, 130.81],
];

function scheduleBar(ctx, dest, barIndex, barStart) {
  const b = barIndex % 4;

  /* Kick — beat 1 & 3 */
  [0, 2].forEach(beat => {
    const kt = barStart + beat * BEAT;
    const ko = ctx.createOscillator(), kg = ctx.createGain();
    ko.connect(kg); kg.connect(dest);
    ko.type = 'sine';
    ko.frequency.setValueAtTime(95, kt);
    ko.frequency.exponentialRampToValueAtTime(30, kt + 0.2);
    kg.gain.setValueAtTime(0.85, kt);
    kg.gain.exponentialRampToValueAtTime(0.001, kt + 0.22);
    ko.start(kt); ko.stop(kt + 0.24);
  });

  /* Snare — beat 2 & 4 */
  [1, 3].forEach(beat => {
    noiseHit(ctx, dest, barStart + beat * BEAT, 0.1, 0.22, 900);
    osc(ctx, dest, 'triangle', 210, barStart + beat * BEAT, 0.06, 0.07);
  });

  /* Hi-hat — 8th notes */
  for (let e = 0; e < 8; e++) {
    const vol = e % 2 === 0 ? 0.055 : 0.03;
    noiseHit(ctx, dest, barStart + e * BEAT * 0.5, 0.03, vol, 8500);
  }

  /* Bass */
  BASS_BARS[b].forEach((freq, beat) => {
    osc(ctx, dest, 'triangle', freq, barStart + beat * BEAT, BEAT * 0.85, 0.38);
  });

  /* Chord pad — whole bar */
  osc(ctx, dest, 'sine', CHORD_ROOTS[b],  barStart, BAR * 0.92, 0.05);
  osc(ctx, dest, 'sine', CHORD_THIRDS[b], barStart, BAR * 0.92, 0.04);
  osc(ctx, dest, 'sine', CHORD_FIFTHS[b], barStart, BAR * 0.92, 0.035);

  /* Melody */
  let cur = barStart;
  MELODY_PHRASE[b].forEach(([freq, beats]) => {
    const dur = beats * BEAT;
    osc(ctx, dest, 'triangle', freq, cur, dur * 0.85, 0.14);
    osc(ctx, dest, 'sine',     freq, cur, dur * 0.85, 0.06, -4);
    cur += dur;
  });
}

function startBackgroundMusic(ctx, vol) {
  const masterGain = ctx.createGain();
  masterGain.gain.value = vol;

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 4;
  comp.attack.value = 0.003; comp.release.value = 0.2;
  masterGain.connect(comp);
  comp.connect(ctx.destination);

  let barCount = 0;
  let nextBarTime = ctx.currentTime + 0.05;
  const LOOKAHEAD = BAR * 1.5; // schedule ~1.5 bars ahead

  function tick() {
    while (nextBarTime < ctx.currentTime + LOOKAHEAD) {
      scheduleBar(ctx, masterGain, barCount, nextBarTime);
      barCount++;
      nextBarTime += BAR;
    }
  }

  tick();
  const timerId = setInterval(tick, 200); // check every 200ms

  return {
    stop:      () => clearInterval(timerId),
    setVolume: (v) => masterGain.gain.setTargetAtTime(v, ctx.currentTime, 0.1),
  };
}

/* ── React hook ──────────────────────────────────────────────────────────── */
export function useSound(sfxVol = 0.7, musicVol = 0.3) {
  const musicRef    = useRef(null);
  const sfxVolRef   = useRef(sfxVol);
  const musicVolRef = useRef(musicVol);

  sfxVolRef.current   = sfxVol;
  musicVolRef.current = musicVol;

  const playSfx = useCallback((key) => {
    if (sfxVolRef.current <= 0) return;
    try {
      const ctx = getCtx();
      const v   = sfxVolRef.current;
      if      (key === 'correct')    sfxCorrect(ctx, v);
      else if (key === 'wrong')      sfxWrong(ctx, v);
      else if (key === 'transition') sfxTransition(ctx, v);
    } catch (e) {}
  }, []);

  const startMusic = useCallback(() => {
    if (musicRef.current) return;
    try {
      musicRef.current = startBackgroundMusic(getCtx(), musicVolRef.current * 0.5);
    } catch (e) {}
  }, []);

  const stopMusic = useCallback(() => {
    musicRef.current?.stop();
    musicRef.current = null;
  }, []);

  const setMusicVolume = useCallback((v) => {
    musicVolRef.current = v;
    musicRef.current?.setVolume(v * 0.5);
  }, []);

  const muteMusic   = useCallback(() => { musicRef.current?.setVolume(0); }, []);
  const unmuteMusic = useCallback(() => {
    musicRef.current?.setVolume(musicVolRef.current * 0.5);
  }, []);

  useEffect(() => () => musicRef.current?.stop(), []);

  return { playSfx, startMusic, stopMusic, setMusicVolume, muteMusic, unmuteMusic };
}
