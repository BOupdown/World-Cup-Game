/* ── Scoring rules ─────────────────────────────────────────────────────────
   Pure functions, extracted from GameScreen so they can be unit-tested.
   ──────────────────────────────────────────────────────────────────────── */
export const BASE_POINTS = 100;   // guaranteed points for a correct answer
export const SPEED_BONUS = 400;   // extra points for an instant answer

/* Streak multiplier: 3+ in a row → ×2, 6+ in a row → ×3 */
export function getMultiplier(streak) {
  if (streak >= 6) return 3;
  if (streak >= 3) return 2;
  return 1;
}

/* Points for a correct answer given elapsed time and current streak */
export function computePoints(elapsed, timeLimit, streak) {
  const speedRatio = Math.max(0, 1 - elapsed / timeLimit);
  return Math.round((BASE_POINTS + SPEED_BONUS * speedRatio) * getMultiplier(streak));
}
