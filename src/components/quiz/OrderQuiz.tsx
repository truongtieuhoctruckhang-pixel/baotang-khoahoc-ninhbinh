import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { CauHoi } from '../../data';
import { ChemText } from '../../lib/chem';
import { shuffleArray } from '../../lib/quizHelper';

interface OrderQuizProps {
  question: CauHoi;
  userAnswer: number[] | null; // array of step original indices in current order
  hasAnswered: boolean;
  onChangeOrder: (nextOrder: number[]) => void;
}

export function OrderQuiz({
  question,
  userAnswer,
  hasAnswered,
  onChangeOrder,
}: OrderQuizProps) {
  const steps = question.orderSteps ?? [];

  // Initialize shuffled steps order if not set
  const [currentOrder, setCurrentOrder] = useState<number[]>(() => {
    if (userAnswer && userAnswer.length === steps.length) return userAnswer;
    const indices = steps.map((_, i) => i);
    return shuffleArray(indices);
  });

  useEffect(() => {
    if (userAnswer && userAnswer.length === steps.length) {
      setCurrentOrder(userAnswer);
    }
  }, [userAnswer, steps.length]);

  const moveStep = (currentIndex: number, direction: 'up' | 'down') => {
    if (hasAnswered) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const next = [...currentOrder];
    const temp = next[currentIndex];
    next[currentIndex] = next[targetIndex];
    next[targetIndex] = temp;

    setCurrentOrder(next);
    onChangeOrder(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-[#8A6414]">
        💡 Dạng Sắp xếp thứ tự: Dùng nút mũi tên lên/xuống để sắp xếp các bước theo đúng trình tự thời gian hoặc logic.
      </p>

      <div className="space-y-2.5">
        {currentOrder.map((originalIdx, posIdx) => {
          const stepText = steps[originalIdx];
          const isCorrectPos = originalIdx === posIdx;

          return (
            <div
              key={originalIdx}
              className={`flex items-center justify-between gap-3 rounded-[12px] border p-3.5 transition-colors ${
                hasAnswered
                  ? isCorrectPos
                    ? 'border-[#2E8B57] bg-[#E4F4EA]'
                    : 'border-[#C2553A] bg-[#FBE9E3]'
                  : 'border-[#E3DAC3] bg-[#F3EDDD]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#0B3D3A] text-xs font-bold text-[#FBF8F1] tabular-nums">
                  {posIdx + 1}
                </span>
                <span className="text-sm font-medium text-[#17262B] leading-snug">
                  <ChemText text={stepText} />
                </span>
              </div>

              {!hasAnswered && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={posIdx === 0}
                    onClick={() => moveStep(posIdx, 'up')}
                    className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] text-[#17262B] hover:border-[#137A6F] disabled:opacity-40"
                    aria-label="Chuyển lên"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={posIdx === currentOrder.length - 1}
                    onClick={() => moveStep(posIdx, 'down')}
                    className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] text-[#17262B] hover:border-[#137A6F] disabled:opacity-40"
                    aria-label="Chuyển xuống"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
