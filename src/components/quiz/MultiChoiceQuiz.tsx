import type { CauHoi } from '../../data';
import { ChemText } from '../../lib/chem';

interface MultiChoiceQuizProps {
  question: CauHoi;
  userAnswer: number[] | null; // selected indices
  hasAnswered: boolean;
  onChangeSelection: (nextSelection: number[]) => void;
}

export function MultiChoiceQuiz({
  question,
  userAnswer,
  hasAnswered,
  onChangeSelection,
}: MultiChoiceQuizProps) {
  const options = question.dapAn ?? [];
  const selected = userAnswer ?? [];
  const correctMulti = question.dapAnDungMulti ?? [];

  const handleToggle = (idx: number) => {
    if (hasAnswered) return;
    if (selected.includes(idx)) {
      onChangeSelection(selected.filter((i) => i !== idx));
    } else {
      onChangeSelection([...selected, idx]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-[#8A6414]">
        💡 Dạng nhiều đáp án đúng: Hãy chọn tất cả các đáp án chính xác (có thể có nhiều hơn 1).
      </p>
      {options.map((optionText, idx) => {
        const isChecked = selected.includes(idx);
        const isActuallyCorrect = correctMulti.includes(idx);

        let containerStyle =
          'border-[#E3DAC3] bg-[#F3EDDD] text-[#17262B] hover:border-[#137A6F] hover:bg-[#DCEFEA]/55';

        if (hasAnswered) {
          if (isActuallyCorrect) {
            containerStyle = 'border-[#2E8B57] bg-[#E4F4EA] text-[#17262B]';
          } else if (isChecked && !isActuallyCorrect) {
            containerStyle = 'border-[#C2553A] bg-[#FBE9E3] text-[#17262B]';
          } else {
            containerStyle = 'border-[#E3DAC3] bg-[#FBF8F1]/70 text-[#4A5B60]';
          }
        } else if (isChecked) {
          containerStyle = 'border-[#137A6F] bg-[#DCEFEA] text-[#0B3D3A]';
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={hasAnswered}
            onClick={() => handleToggle(idx)}
            className={`flex min-h-[52px] w-full max-w-full items-center gap-3.5 overflow-hidden rounded-[12px] border p-3.5 text-left transition-all duration-150 ${
              !hasAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
            } ${containerStyle}`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              disabled={hasAnswered}
              onChange={() => {}}
              className="h-4 w-4 rounded accent-[#0B3D3A]"
            />
            <span className="min-w-0 flex-1 overflow-x-auto text-sm font-medium leading-snug sm:text-[15px]">
              <ChemText text={optionText} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
