import type { CauHoi, QuestionType } from '../data';

export function normalizeShortAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => {
      const subDigits = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
      const idx = subDigits.indexOf(match);
      return idx !== -1 ? String(idx) : match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function evaluateQuestionAnswer(
  q: CauHoi,
  userAnswer: any
): { isCorrect: boolean; scoreRatio: number } {
  const qType: QuestionType = q.type ?? 'single';

  switch (qType) {
    case 'single': {
      const selectedIdx = typeof userAnswer === 'number' ? userAnswer : -1;
      const correctIdx = q.dapAnDung ?? 0;
      const isCorrect = selectedIdx === correctIdx;
      return { isCorrect, scoreRatio: isCorrect ? 1 : 0 };
    }
    case 'multi': {
      // userAnswer is number[] of selected indices
      const selected = Array.isArray(userAnswer) ? userAnswer : [];
      const correct = q.dapAnDungMulti ?? [];
      if (correct.length === 0) return { isCorrect: false, scoreRatio: 0 };

      let correctPicked = 0;
      let incorrectPicked = 0;
      for (const idx of selected) {
        if (correct.includes(idx)) correctPicked++;
        else incorrectPicked++;
      }
      const ratio = Math.max(0, (correctPicked - incorrectPicked * 0.5) / correct.length);
      const isCorrect = ratio >= 0.99;
      return { isCorrect, scoreRatio: ratio };
    }
    case 'truefalse': {
      // userAnswer is boolean[] corresponding to statements
      const userTf = Array.isArray(userAnswer) ? userAnswer : [];
      const stmts = q.statements ?? [];
      if (stmts.length === 0) return { isCorrect: false, scoreRatio: 0 };

      let correctCount = 0;
      stmts.forEach((st, idx) => {
        if (userTf[idx] === st.isTrue) correctCount++;
      });
      const ratio = correctCount / stmts.length;
      return { isCorrect: ratio >= 0.99, scoreRatio: ratio };
    }
    case 'short': {
      const userStr = normalizeShortAnswer(String(userAnswer ?? ''));
      const acceptable = (q.shortAnswers ?? []).map((sa) => normalizeShortAnswer(sa));
      const isCorrect = acceptable.some((acc) => acc && userStr === acc);
      return { isCorrect, scoreRatio: isCorrect ? 1 : 0 };
    }
    case 'match': {
      // userAnswer is record/object mapping indexA -> indexB
      const mapping = userAnswer && typeof userAnswer === 'object' ? userAnswer : {};
      const pairs = q.pairs ?? [];
      if (pairs.length === 0) return { isCorrect: false, scoreRatio: 0 };

      let correctMatches = 0;
      pairs.forEach((_, idx) => {
        if (Number(mapping[idx]) === idx) correctMatches++;
      });
      const ratio = correctMatches / pairs.length;
      return { isCorrect: ratio >= 0.99, scoreRatio: ratio };
    }
    case 'order': {
      // userAnswer is number[] representing current step indices order
      const userOrder = Array.isArray(userAnswer) ? userAnswer : [];
      const steps = q.orderSteps ?? [];
      if (steps.length === 0) return { isCorrect: false, scoreRatio: 0 };

      let correctPos = 0;
      steps.forEach((_, idx) => {
        if (userOrder[idx] === idx) correctPos++;
      });
      const ratio = correctPos / steps.length;
      return { isCorrect: ratio >= 0.99, scoreRatio: ratio };
    }
    case 'balance': {
      // userAnswer is number[] of coefficients entered by student
      const userCoeffs = Array.isArray(userAnswer) ? userAnswer.map(Number) : [];
      const correctCoeffs = q.balanceCoefficients ?? [];
      if (correctCoeffs.length === 0) return { isCorrect: false, scoreRatio: 0 };

      let matches = 0;
      correctCoeffs.forEach((c, idx) => {
        if (userCoeffs[idx] === c) matches++;
      });
      const ratio = matches / correctCoeffs.length;
      return { isCorrect: ratio >= 0.99, scoreRatio: ratio };
    }
    default:
      return { isCorrect: false, scoreRatio: 0 };
  }
}
