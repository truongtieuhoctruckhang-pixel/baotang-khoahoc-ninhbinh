import type { CauHoi } from '../../data';
import { INPUT_CLASS, LABEL_CLASS } from '../../admin/adminUtils';

interface ShortAnswerQuizProps {
  question: CauHoi;
  userAnswer: string;
  hasAnswered: boolean;
  onChangeAnswer: (val: string) => void;
}

export function ShortAnswerQuiz({
  userAnswer,
  hasAnswered,
  onChangeAnswer,
}: ShortAnswerQuizProps) {
  return (
    <div className="space-y-3">
      <label className={LABEL_CLASS}>Nhập câu trả lời ngắn của bạn:</label>
      <input
        type="text"
        disabled={hasAnswered}
        value={userAnswer}
        onChange={(e) => onChangeAnswer(e.target.value)}
        placeholder="Ví dụ: CO2 hoặc khí cacbonic..."
        className={`${INPUT_CLASS} text-base`}
      />
      <p className="text-xs text-[#4A5B60]">
        Hệ thống tự động bỏ qua chữ hoa/thường, khoảng trắng và chỉ số dưới khi chấm điểm.
      </p>
    </div>
  );
}
