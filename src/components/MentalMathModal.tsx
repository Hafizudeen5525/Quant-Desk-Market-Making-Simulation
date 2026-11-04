import React, { useState, useEffect } from 'react';
import { X, BrainCircuit, Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { MentalMathQuestion } from '../types/desk';
import { sounds } from '../services/soundEffects';

interface MentalMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: MentalMathQuestion;
  onAnswer: (isCorrect: boolean, bonus: number) => void;
}

export const MentalMathModal: React.FC<MentalMathModalProps> = ({
  isOpen,
  onClose,
  question,
  onAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [answeredState, setAnsweredState] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(10);
    setAnsweredState('NONE');

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSelectOption(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, question]);

  if (!isOpen) return null;

  const handleSelectOption = (opt: number | null) => {
    if (answeredState !== 'NONE') return;

    if (opt === question.correctAnswer) {
      sounds.playCashRegister();
      setAnsweredState('CORRECT');
      setTimeout(() => {
        onAnswer(true, question.rewardBonus);
        onClose();
      }, 900);
    } else {
      sounds.playStrikeError();
      setAnsweredState('WRONG');
      setTimeout(() => {
        onAnswer(false, 0);
        onClose();
      }, 1100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white border-2 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden text-neutral-900 font-sans">
        {/* Header */}
        <div className="bg-[#111111] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-neutral-900">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-amber-400" />
            <span className="font-black text-sm uppercase tracking-wider">
              QUANT MATH &amp; PROBABILITY EV
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider font-mono">
              INTERVIEW SPEED CHECK · JANE STREET / OPTIVER STYLE
            </span>
            <div className="text-2xl font-black text-neutral-900 leading-snug">
              {question.question}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {question.options.map((opt) => (
              <button
                key={opt}
                disabled={answeredState !== 'NONE'}
                onClick={() => handleSelectOption(opt)}
                className={`py-3 px-4 font-mono font-black text-base border-2 border-neutral-900 transition cursor-pointer ${
                  answeredState === 'CORRECT' && opt === question.correctAnswer
                    ? 'bg-emerald-600 text-white shadow-none'
                    : answeredState === 'WRONG' && opt === question.correctAnswer
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {answeredState === 'CORRECT' && (
            <div className="border-2 border-emerald-900 bg-emerald-50 p-2.5 text-center text-xs font-black text-emerald-800 uppercase flex items-center justify-center gap-1.5 animate-in fade-in">
              <Sparkles className="h-4 w-4" />
              <span>CORRECT! +${question.rewardBonus} DESK BONUS ADDED</span>
            </div>
          )}

          {answeredState === 'WRONG' && (
            <div className="border-2 border-rose-900 bg-rose-50 p-2.5 text-center text-xs font-black text-rose-800 uppercase flex items-center justify-center gap-1.5 animate-in fade-in">
              <AlertTriangle className="h-4 w-4" />
              <span>TIME / ANSWER ERROR. CORRECT WAS {question.correctAnswer}</span>
            </div>
          )}

          <div className="text-[10px] text-neutral-500 text-center font-bold">
            Answer correctly under 10 seconds to inject capital into your prop account balance.
          </div>
        </div>
      </div>
    </div>
  );
};
