import { describe, it, expect } from 'vitest';
import { getMultiplier, computePoints, BASE_POINTS, SPEED_BONUS } from './score.js';

describe('getMultiplier', () => {
  it('returns ×1 below 3 correct answers in a row', () => {
    expect(getMultiplier(0)).toBe(1);
    expect(getMultiplier(1)).toBe(1);
    expect(getMultiplier(2)).toBe(1);
  });

  it('returns ×2 from 3 to 5 in a row', () => {
    expect(getMultiplier(3)).toBe(2);
    expect(getMultiplier(5)).toBe(2);
  });

  it('returns ×3 from 6 in a row', () => {
    expect(getMultiplier(6)).toBe(3);
    expect(getMultiplier(20)).toBe(3);
  });
});

describe('computePoints', () => {
  const LIMIT = 10;

  it('awards maximum points for an instant answer', () => {
    expect(computePoints(0, LIMIT, 1)).toBe(BASE_POINTS + SPEED_BONUS); // 500
  });

  it('awards only base points at the last second', () => {
    expect(computePoints(LIMIT, LIMIT, 1)).toBe(BASE_POINTS); // 100
  });

  it('scales linearly with speed', () => {
    expect(computePoints(LIMIT / 2, LIMIT, 1)).toBe(BASE_POINTS + SPEED_BONUS / 2); // 300
  });

  it('applies the streak multiplier', () => {
    expect(computePoints(0, LIMIT, 3)).toBe((BASE_POINTS + SPEED_BONUS) * 2); // 1000
    expect(computePoints(0, LIMIT, 6)).toBe((BASE_POINTS + SPEED_BONUS) * 3); // 1500
  });

  it('never rewards negative speed (elapsed beyond limit)', () => {
    expect(computePoints(LIMIT + 5, LIMIT, 1)).toBe(BASE_POINTS);
  });
});
