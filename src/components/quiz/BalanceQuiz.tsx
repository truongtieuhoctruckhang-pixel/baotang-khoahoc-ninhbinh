import type { CauHoi } from '../../data';
import { ChemText } from '../../lib/chem';

interface BalanceQuizProps {
  question: CauHoi;
  userAnswer: number[] | null; // coefficients entered by student
  hasAnswered: boolean;
  onChangeCoeffs: (nextCoeffs: number[]) => void;
}

export function BalanceQuiz({
  question,
  userAnswer,
  hasAnswered,
  onChangeCoeffs,
}: BalanceQuizProps) {
  const equation = question.balanceEquation || '{{CaCO3 + 2HCl -> CaCl2 + H2O + CO2}}';
  const correctCoeffs = question.balanceCoefficients ?? [];
  const currentCoeffs = userAnswer ?? new Array(correctCoeffs.length).fill(1);

  // Parse chemical terms from equation string for display
  const cleanEquation = equation.replace(/\{\{|\}\}/g, '');
  const terms = cleanEquation
    .split(/\+|->|<=>|⇌/)
    .map((t) => t.trim())
    .filter(Boolean);

  const handleCoeffChange = (idx: number, valStr: string) => {
    if (hasAnswered) return;
    const num = valStr === '' ? 1 : Math.max(1, parseInt(valStr, 10) || 1);
    const next = [...currentCoeffs];
    next[idx] = num;
    onChangeCoeffs(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-[#8A6414]">
        💡 Dạng Cân bằng phương trình: Điền hệ số thích hợp vào ô trước mỗi chất để cân bằng phương trình hóa học.
      </p>

      <div className="rounded-[14px] border border-[#137A6F]/30 bg-[#DCEFEA]/40 p-4 text-center">
        <div className="font-serif text-lg font-bold text-[#17262B]">
          <ChemText text={equation} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {terms.map((term, idx) => {
          const val = currentCoeffs[idx] ?? 1;
          const isCorrectCoeff = val === correctCoeffs[idx];

          return (
            <div
              key={idx}
              className={`flex items-center gap-2 rounded-[12px] border p-3 ${
                hasAnswered
                  ? isCorrectCoeff
                    ? 'border-[#2E8B57] bg-[#E4F4EA]'
                    : 'border-[#C2553A] bg-[#FBE9E3]'
                  : 'border-[#E3DAC3] bg-[#F3EDDD]'
              }`}
            >
              <input
                type="number"
                min={1}
                max={99}
                disabled={hasAnswered}
                value={val}
                onChange={(e) => handleCoeffChange(idx, e.target.value)}
                className="w-14 rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] px-2 py-1 text-center text-sm font-bold text-[#17262B]"
              />
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#17262B]">
                <ChemText text={term} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
