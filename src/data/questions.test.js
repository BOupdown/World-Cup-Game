import { describe, it, expect } from 'vitest';
import { questions, getShuffledQuestions, nextQuestion } from './questions.js';

describe('questions data integrity', () => {
  it('every question has exactly 4 answers', () => {
    questions.forEach(q => expect(q.answers).toHaveLength(4));
  });

  it('every correct index points to an existing answer', () => {
    questions.forEach(q => {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.answers.length);
    });
  });

  it('every question has a non-empty text and an emoji', () => {
    questions.forEach(q => {
      expect(q.question.length).toBeGreaterThan(0);
      expect(q.emoji.length).toBeGreaterThan(0);
    });
  });
});

describe('getShuffledQuestions', () => {
  it('returns the requested number of questions', () => {
    expect(getShuffledQuestions(10)).toHaveLength(10);
  });

  it('keeps the correct answer valid after shuffling', () => {
    for (let run = 0; run < 20; run++) {
      getShuffledQuestions(10).forEach(shuffled => {
        const original = questions.find(q => q.id === shuffled.id);
        const expected = original.answers[original.correct];
        expect(shuffled.answers[shuffled.correct]).toBe(expected);
      });
    }
  });
});

describe('nextQuestion (infinite pool)', () => {
  it('always returns a valid question, even past the pool size', () => {
    for (let i = 0; i < questions.length * 3; i++) {
      const q = nextQuestion();
      expect(q.answers).toHaveLength(4);
      expect(q.answers[q.correct]).toBeDefined();
    }
  });
});
