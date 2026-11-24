import { useMemo } from 'react';
import type { CauHoi } from '../../data';
import { ChemText } from '../../lib/chem';
import { shuffleArray } from '../../lib/quizHelper';

interface MatchQuizProps {
  question: CauHoi;
  userAnswer: Record<number, number> | null; // mapping indexA -> indexB selected
  hasAnswered: boolean;
  onChangeMapping: (nextMapping: Record<number, number>) => void;
}

export function MatchQuiz({
  question,
  userAnswer,
  hasAnswered,
  onChangeMapping,
}: MatchQuizProps) {
  const pairs = question.pairs ?? [];
  const mapping = userAnswer ?? {};

  // Randomized column B options list cached per question
  const shuffledB = useMemo(() => {
    const list = pairs.map((p, idx) => ({ originalIdx: idx, text: p.b }));
    return shuffleArray(list);
  }, [pairs]);

  const handleSelectB = (pairIdx: number, bOriginalIdx: number) => {
    if (hasAnswered) return;
    const next = { ...mapping, [pairIdx]: bOriginalIdx };
    onChangeMapping(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-[#8A6414]">
        💡 Dạng Ghép đôi: Chọn ý ở cột B tương ứng với mỗi mục ở cột A.
      </p>

      <div className="space-y-3">
        {pairs.map((pair, idx) => {
          const selectedBIdx = mapping[idx];
          const isCorrectPair = selectedBIdx === idx;

          return (
            <div
              key={idx}
              className={`rounded-[12px] border p-3.5 transition-colors ${
                hasAnswered
                  ? isCorrectPair
                    ? 'border-[#2E8B57] bg-[#E4F4EA]'
                    : 'border-[#C2553A] bg-[#FBE9E3]'
                  : 'border-[#E3DAC3] bg-[#F3EDDD]'
              }`}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
                <div className="sm:col-span-5 font-semibold text-sm text-[#17262B]">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0B3D3A] text-xs font-bold text-[#FBF8F1]">
                    {idx + 1}
                  </span>
                  <ChemText text={pair.a} />
                </div>

                <div className="sm:col-span-7">
                  <select
                    disabled={hasAnswered}
                    value={selectedBIdx !== undefined ? selectedBIdx : ''}
                    onChange={(e) => handleSelectB(idx, Number(e.target.value))}
                    className="w-full rounded-[10px] border border-[#E3DAC3] bg-[#FBF8F1] px-3 py-2.5 text-sm font-medium text-[#17262B] focus:border-[#137A6F] focus:outline-none"
                  >
                    <option value="" disabled>
                      -- Chọn ý tương ứng ở cột B --
                    </option>
                    {shuffledB.map((bItem) => (
                      <option key={bItem.originalIdx} value={bItem.originalIdx}>
                        {bItem.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
