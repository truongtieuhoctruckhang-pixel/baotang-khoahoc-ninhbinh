import { CheckCircle2, XCircle } from 'lucide-react';
import type { CauHoi } from '../../data';
import { ChemText } from '../../lib/chem';

interface SingleChoiceQuizProps {
  question: CauHoi;
  userAnswer: number | null;
  hasAnswered: boolean;
  onSelect: (idx: number) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export function SingleChoiceQuiz({
  question,
  userAnswer,
  hasAnswered,
  onSelect,
}: SingleChoiceQuizProps) {
  const options = question.dapAn ?? [];
  const correctIdx = question.dapAnDung ?? 0;

  return (
    <div className="space-y-3">
      {options.map((optionText, idx) => {
        const isThisSelected = userAnswer === idx;
        const isThisCorrect = idx === correctIdx;

        let containerStyle =
          'border-[#E3DAC3] bg-[#F3EDDD] text-[#17262B] hover:border-[#137A6F] hover:bg-[#DCEFEA]/55';
        let badgeStyle = 'bg-[#FBF8F1] border-[#E3DAC3] text-[#17262B]';

        if (hasAnswered) {
          if (isThisCorrect) {
            containerStyle = 'border-[#2E8B57] bg-[#E4F4EA] text-[#17262B]';
            badgeStyle = 'bg-[#2E8B57] border-[#2E8B57] text-[#FBF8F1]';
          } else if (isThisSelected) {
            containerStyle = 'border-[#C2553A] bg-[#FBE9E3] text-[#17262B]';
            badgeStyle = 'bg-[#C2553A] border-[#C2553A] text-[#FBF8F1]';
          } else {
            containerStyle = 'border-[#E3DAC3] bg-[#FBF8F1]/70 text-[#4A5B60]';
            badgeStyle = 'bg-[#F3EDDD] border-[#E3DAC3] text-[#4A5B60]';
          }
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={hasAnswered}
            onClick={() => onSelect(idx)}
            className={`flex min-h-[52px] w-full max-w-full items-center gap-3.5 overflow-hidden rounded-[12px] border p-3.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#0B3D3A] ${
              !hasAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
            } ${containerStyle}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border text-xs font-bold transition-colors ${badgeStyle}`}
            >
              {OPTION_LETTERS[idx] ?? idx + 1}
            </span>
            <span className="min-w-0 flex-1 overflow-x-auto text-sm font-medium leading-snug sm:text-[15px]">
              <ChemText text={optionText} />
            </span>
            {hasAnswered && isThisCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2E8B57]" />}
            {hasAnswered && isThisSelected && !isThisCorrect && (
              <XCircle className="h-5 w-5 shrink-0 text-[#C2553A]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
