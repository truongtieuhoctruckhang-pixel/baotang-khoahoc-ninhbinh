import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import type { TramDiSan } from '../data';
import { ChemText } from '../lib/chem';
import { evaluateQuestionAnswer } from '../lib/quizHelper';
import {
  playQuizCorrectSound,
  playQuizWrongSound,
  playStampUnlockedSound,
} from '../lib/sound';
import { StationImage } from './StationImage';
import { QuizResultView } from './QuizResultView';
import { SingleChoiceQuiz } from './quiz/SingleChoiceQuiz';
import { MultiChoiceQuiz } from './quiz/MultiChoiceQuiz';
import { TrueFalseQuiz } from './quiz/TrueFalseQuiz';
import { ShortAnswerQuiz } from './quiz/ShortAnswerQuiz';
import { MatchQuiz } from './quiz/MatchQuiz';
import { OrderQuiz } from './quiz/OrderQuiz';
import { BalanceQuiz } from './quiz/BalanceQuiz';

interface QuizEngineProps {
  station: TramDiSan;
  alreadyCompleted: boolean;
  onQuizFinish: (correctCount: number, totalQuestions: number) => {
    passed: boolean;
    newlyStamped: boolean;
  };
  onGoToPassport: () => void;
  onGoToNextStation?: () => void;
}

export function QuizEngine({
  station,
  alreadyCompleted,
  onQuizFinish,
  onGoToPassport,
  onGoToNextStation,
}: QuizEngineProps) {
  const questions = station.cauHoi;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [checkedStatus, setCheckedStatus] = useState<Record<number, { isCorrect: boolean; scoreRatio: number }>>({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [passedResult, setPassedResult] = useState(false);
  const [isNewlyStamped, setIsNewlyStamped] = useState(false);

  const currentQuestion = questions[currentIndex];
  const qType = currentQuestion?.type ?? 'single';
  const currentAnswer = answers[currentIndex];
  const currentChecked = checkedStatus[currentIndex];
  const hasChecked = currentChecked !== undefined;

  const handleGradeQuestion = (ansToEvaluate?: any) => {
    if (hasChecked) return;
    const val = ansToEvaluate !== undefined ? ansToEvaluate : currentAnswer;
    if (val === undefined || val === null || (Array.isArray(val) && val.length === 0) || (typeof val === 'string' && !val.trim())) {
      return; // Nothing selected/entered
    }

    const res = evaluateQuestionAnswer(currentQuestion, val);
    setCheckedStatus((prev) => ({ ...prev, [currentIndex]: res }));

    if (res.isCorrect || res.scoreRatio > 0.5) {
      playQuizCorrectSound();
    } else {
      playQuizWrongSound();
    }
  };

  const handleSelectSingle = (optionIdx: number) => {
    if (hasChecked) return;
    const nextAnswers = { ...answers, [currentIndex]: optionIdx };
    setAnswers(nextAnswers);
    // Auto grade for single choice type
    const res = evaluateQuestionAnswer(currentQuestion, optionIdx);
    setCheckedStatus((prev) => ({ ...prev, [currentIndex]: res }));
    if (res.isCorrect) {
      playQuizCorrectSound();
    } else {
      playQuizWrongSound();
    }
  };

  const finalizeAndShowResult = () => {
    // Grade any remaining unchecked questions as incorrect (score 0)
    let totalScoreSum = 0;
    const finalChecked = { ...checkedStatus };
    questions.forEach((q, idx) => {
      if (finalChecked[idx]) {
        totalScoreSum += finalChecked[idx].scoreRatio;
      } else {
        finalChecked[idx] = { isCorrect: false, scoreRatio: 0 };
      }
    });
    setCheckedStatus(finalChecked);

    const finalCorrectCount = Math.round(totalScoreSum);
    const result = onQuizFinish(finalCorrectCount, questions.length);
    if (result.passed) {
      playStampUnlockedSound();
    }
    setPassedResult(result.passed);
    setIsNewlyStamped(result.newlyStamped);
    setFinished(true);
    setConfirmModalOpen(false);
  };

  const handleRequestResult = () => {
    const uncheckedCount = questions.length - Object.keys(checkedStatus).length;
    if (uncheckedCount > 0) {
      setConfirmModalOpen(true);
    } else {
      finalizeAndShowResult();
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setCheckedStatus({});
    setFinished(false);
    setPassedResult(false);
    setIsNewlyStamped(false);
    setConfirmModalOpen(false);
  };

  if (finished) {
    let totalScoreSum = 0;
    Object.values(checkedStatus).forEach((c) => (totalScoreSum += c.scoreRatio));

    return (
      <QuizResultView
        station={station}
        correctCount={Math.round(totalScoreSum)}
        totalQuestions={questions.length}
        passedResult={passedResult}
        isNewlyStamped={isNewlyStamped}
        alreadyCompleted={alreadyCompleted}
        onRetry={handleRetry}
        onGoToPassport={onGoToPassport}
        onGoToNextStation={onGoToNextStation}
      />
    );
  }

  const correctCountSoFar = Object.values(checkedStatus).filter((c) => c.scoreRatio > 0.5).length;
  const doneCount = Object.keys(checkedStatus).length;

  return (
    <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-7">
      {/* 1. Numbered Circle Progress Bar */}
      <div className="mb-6 space-y-3 border-b border-[#E3DAC3] pb-4">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
          {questions.map((_, qIdx) => {
            const isCurrent = qIdx === currentIndex;
            const checked = checkedStatus[qIdx];
            const ans = answers[qIdx];
            const hasAns = ans !== undefined && ans !== null && ans !== '' && (Array.isArray(ans) ? ans.length > 0 : true);

            let circleClass = 'border-[#E3DAC3] bg-[#F3EDDD] text-[#17262B]';
            let icon = null;

            if (checked) {
              if (checked.scoreRatio > 0.5) {
                circleClass = 'border-[#2E8B57] bg-[#2E8B57] text-[#FBF8F1]';
                icon = <CheckCircle2 className="h-3 w-3" />;
              } else {
                circleClass = 'border-[#C2553A] bg-[#C2553A] text-[#FBF8F1]';
                icon = <XCircle className="h-3 w-3" />;
              }
            } else if (hasAns) {
              circleClass = 'border-[#C9962E] bg-[#F6EBCB] text-[#8A6414] font-bold';
            }

            if (isCurrent) {
              circleClass += ' ring-2 ring-[#C9962E] ring-offset-2 ring-offset-[#FBF8F1] font-bold scale-105';
            }

            return (
              <button
                key={qIdx}
                type="button"
                onClick={() => setCurrentIndex(qIdx)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs transition-all ${circleClass}`}
              >
                {icon || (qIdx + 1)}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A5B60]">
          <span className="font-semibold text-[#17262B]">
            Đã làm {doneCount}/{questions.length} câu · Đúng {correctCountSoFar} câu
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#2E8B57]" /> Đúng</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#C2553A]" /> Sai</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#F6EBCB] border border-[#C9962E]" /> Đã chọn</span>
          </div>
        </div>
      </div>

      {/* 2. Question Stem & Image */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#137A6F]">
          <span>Câu hỏi {currentIndex + 1} ({qType})</span>
          <span>Mốc đạt: ≥ 60%</span>
        </div>

        <h3 className="max-w-full overflow-x-auto font-serif text-lg font-bold leading-snug text-[#17262B] sm:text-xl">
          <ChemText text={currentQuestion.cauHoi} />
        </h3>

        {currentQuestion.imageUrl && (
          <div>
            <StationImage
              src={currentQuestion.imageUrl}
              alt="Minh họa câu hỏi"
              className="max-h-56 w-full rounded-[12px] object-cover"
            />
          </div>
        )}
      </div>

      {/* 3. Question Type Renderers */}
      <div className="mt-5">
        {qType === 'single' && (
          <SingleChoiceQuiz
            question={currentQuestion}
            userAnswer={currentAnswer ?? null}
            hasAnswered={hasChecked}
            onSelect={handleSelectSingle}
          />
        )}
        {qType === 'multi' && (
          <MultiChoiceQuiz
            question={currentQuestion}
            userAnswer={currentAnswer ?? null}
            hasAnswered={hasChecked}
            onChangeSelection={(sel) => setAnswers({ ...answers, [currentIndex]: sel })}
          />
        )}
        {qType === 'truefalse' && (
          <TrueFalseQuiz
            question={currentQuestion}
            userAnswer={currentAnswer ?? null}
            hasAnswered={hasChecked}
            onChangeAnswer={(ans) => setAnswers({ ...answers, [currentIndex]: ans })}
          />
        )}
        {qType === 'short' && (
          <ShortAnswerQuiz
            question={currentQuestion}
            userAnswer={currentAnswer ?? ''}
            hasAnswered={hasChecked}
            onChangeAnswer={(val) => setAnswers({ ...answers, [currentIndex]: val })}
          />
        )}
        {qType === 'match' && (
          <MatchQuiz
            question={currentQuestion}
            userAnswer={currentAnswer ?? null}
            hasAnswered={hasChecked}
            onChangeMapping={(map) => setAnswers({ ...answers, [currentIndex]: map })}
          />
        )}
        {qType === 'order' && (
          <OrderQuiz
            question={currentQuestion}
            userAnswer={currentAnswer ?? null}
            hasAnswered={hasChecked}
            onChangeOrder={(ord) => setAnswers({ ...answers, [currentIndex]: ord })}
          />
        )}
        {qType === 'balance' && (
          <BalanceQuiz
            question={currentQuestion}
            userAnswer={currentAnswer ?? null}
            hasAnswered={hasChecked}
            onChangeCoeffs={(coeffs) => setAnswers({ ...answers, [currentIndex]: coeffs })}
          />
        )}
      </div>

      {/* 4. Check button for non-single types if not yet checked */}
      {qType !== 'single' && !hasChecked && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleGradeQuestion()}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-6 py-2.5 text-sm font-bold text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.15)] transition-colors hover:bg-[#137A6F] active:scale-[0.98]"
          >
            <span>Kiểm tra</span>
            <CheckCircle2 className="h-4 w-4 text-[#E2B857]" />
          </button>
        </div>
      )}

      {/* 5. Feedback & Explanation once checked */}
      {hasChecked && currentChecked && (
        <div
          className={`mt-5 max-w-full overflow-hidden rounded-[16px] border p-4 transition-all ${
            currentChecked.isCorrect || currentChecked.scoreRatio > 0.5
              ? 'border-[#2E8B57]/40 bg-[#E4F4EA] text-[#17262B]'
              : 'border-[#C2553A]/40 bg-[#FBE9E3] text-[#17262B]'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-bold">
            {currentChecked.isCorrect || currentChecked.scoreRatio > 0.5 ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                <span className="text-[#2E8B57]">
                  {currentChecked.scoreRatio >= 0.99 ? 'Chính xác!' : `Đúng một phần (${Math.round(currentChecked.scoreRatio * 100)}%)!`}
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-[#C2553A]" />
                <span className="text-[#C2553A]">Chưa chính xác</span>
              </>
            )}
          </div>
          <p className="mt-1.5 max-w-full overflow-x-auto text-sm leading-relaxed text-[#17262B]">
            <ChemText text={currentQuestion.giaiThich} />
          </p>
        </div>
      )}

      {/* 6. Bottom Navigation Bar */}
      <div className="mt-8 flex items-center justify-between border-t border-[#E3DAC3] pt-5">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] border border-[#E3DAC3] bg-[#FBF8F1] px-4 py-2 text-sm font-semibold text-[#17262B] hover:border-[#137A6F] disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4 text-[#137A6F]" />
          <span>Câu trước</span>
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] bg-[#0B3D3A] px-5 py-2 text-sm font-bold text-[#FBF8F1] hover:bg-[#137A6F] active:scale-[0.98]"
          >
            <span>Câu tiếp theo</span>
            <ArrowRight className="h-4 w-4 text-[#E2B857]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRequestResult}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-[12px] bg-[#C9962E] px-6 py-2.5 text-sm font-bold text-[#0B3D3A] shadow-[0_8px_24px_rgba(11,61,58,0.18)] transition-all hover:bg-[#E2B857] active:scale-[0.98]"
          >
            <span>Xem kết quả</span>
            <CheckCircle2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Confirmation Modal for Unattempted Questions */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[20px] bg-[#FBF8F1] p-6 text-center shadow-2xl border border-[#E3DAC3]">
            <h3 className="font-serif text-xl font-bold text-[#17262B]">Xác nhận xem kết quả</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[#4A5B60]">
              Bạn còn <strong className="text-[#C2553A]">{questions.length - Object.keys(checkedStatus).length} câu</strong> chưa làm, vẫn xem kết quả? (Các câu chưa làm sẽ tính là sai).
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="min-h-[44px] flex-1 rounded-[12px] border border-[#E3DAC3] bg-[#F3EDDD] px-4 py-2.5 text-sm font-semibold text-[#17262B] hover:border-[#137A6F]"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={finalizeAndShowResult}
                className="min-h-[44px] flex-1 rounded-[12px] bg-[#0B3D3A] px-4 py-2.5 text-sm font-bold text-[#FBF8F1] hover:bg-[#137A6F]"
              >
                Vẫn xem kết quả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
