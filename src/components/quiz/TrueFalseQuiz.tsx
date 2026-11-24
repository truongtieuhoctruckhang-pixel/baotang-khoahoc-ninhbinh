import type { CauHoi } from '../../data';
import { ChemText } from '../../lib/chem';

interface TrueFalseQuizProps {
  question: CauHoi;
  userAnswer: boolean[] | null; // array of booleans for each statement
  hasAnswered: boolean;
  onChangeAnswer: (nextAnswers: boolean[]) => void;
}

const STAT_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'] as const;

export function TrueFalseQuiz({
  question,
  userAnswer,
  hasAnswered,
  onChangeAnswer,
}: TrueFalseQuizProps) {
  const statements = question.statements ?? [];
  const currentAnswers = userAnswer ?? new Array(statements.length).fill(null);

  const handleSetStatement = (stIdx: number, val: boolean) => {
    if (hasAnswered) return;
    const next = [...currentAnswers];
    next[stIdx] = val;
    onChangeAnswer(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-[#8A6414]">
        💡 Dạng Đúng / Sai: Đánh giá từng mệnh đề a, b, c, d là Đúng hay Sai.
      </p>
      <div className="space-y-3">
        {statements.map((st, idx) => {
          const userVal = currentAnswers[idx];
          const isCorrectStmt = userVal === st.isTrue;

          return (
            <div
              key={idx}
              className={`rounded-[12px] border p-3.5 transition-colors ${
                hasAnswered
                  ? isCorrectStmt
                    ? 'border-[#2E8B57] bg-[#E4F4EA]'
                    : 'border-[#C2553A] bg-[#FBE9E3]'
                  : 'border-[#E3DAC3] bg-[#F3EDDD]'
              }`}
            >
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B3D3A] text-xs font-bold text-[#FBF8F1]">
                    {STAT_LETTERS[idx] ?? idx + 1}
                  </span>
                  <span className="text-sm font-medium text-[#17262B] leading-snug">
                    <ChemText text={st.text} />
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSetStatement(idx, true)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-[8px] text-xs font-bold transition-all ${
                      userVal === true
                        ? 'bg-[#0B3D3A] text-[#FBF8F1] shadow-sm'
                        : 'border border-[#E3DAC3] bg-[#FBF8F1] text-[#17262B] hover:border-[#137A6F]'
                    }`}
                  >
                    Đúng
                  </button>
                  <button
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSetStatement(idx, false)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-[8px] text-xs font-bold transition-all ${
                      userVal === false
                        ? 'bg-[#C2553A] text-[#FBF8F1] shadow-sm'
                        : 'border border-[#E3DAC3] bg-[#FBF8F1] text-[#17262B] hover:border-[#C2553A]'
                    }`}
                  >
                    Sai
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
