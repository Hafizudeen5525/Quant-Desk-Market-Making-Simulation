import React from 'react';
import { ArrowRight, Lightbulb, Target, AlertTriangle, ShieldAlert } from 'lucide-react';
import { PropFirmChallenge } from '../types/desk';
import { sounds } from '../services/soundEffects';

interface MorningBriefingModalProps {
  challenge: PropFirmChallenge;
  stageNumber: number;
  onStartTrading: () => void;
}

export const MorningBriefingModal: React.FC<MorningBriefingModalProps> = ({
  challenge,
  stageNumber,
  onStartTrading,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border-2 border-[#111111] shadow-[8px_8px_0px_#111111] text-neutral-900 font-sans">
        {/* Signature Bar Title */}
        <div className="bg-[#111111] text-white font-black text-lg md:text-xl px-4 py-2.5 tracking-wider uppercase flex items-center justify-between">
          <span>MORNING BRIEFING</span>
          <span className="text-xs font-mono font-bold text-neutral-400">DESK 08:00 AM</span>
        </div>

        {/* Content Card Body */}
        <div className="p-6 md:p-7 space-y-5">
          <div>
            <span className="inline-block bg-[#4A8ECB] text-white font-black text-xs md:text-sm px-2.5 py-1 uppercase tracking-wide">
              {challenge.subtitle}
            </span>
            <div className="font-black text-3xl md:text-5xl text-[#111111] leading-[0.95] tracking-tight uppercase mt-3 mb-2 font-sans">
              {challenge.title}
            </div>
          </div>

          {/* Core Briefing Rules */}
          <div className="border-2 border-neutral-900 bg-neutral-50 p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-neutral-900">
              <Lightbulb className="h-4 w-4 text-[#4A8ECB]" />
              <span>PROP TRADING OBJECTIVES</span>
            </div>
            <ul className="space-y-2 text-xs md:text-sm text-neutral-800 leading-relaxed font-medium">
              {challenge.description.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono font-bold text-[#4A8ECB] flex-shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prop Firm Risk Rules Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="border-2 border-neutral-900 bg-neutral-100 p-2.5">
              <span className="text-[10px] text-neutral-600 font-bold block uppercase">FUNDED CAPITAL</span>
              <span className="text-sm font-black text-neutral-900 block mt-0.5">
                ${(challenge.startingCapital / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="border-2 border-neutral-900 bg-emerald-50 border-emerald-900 p-2.5">
              <span className="text-[10px] text-emerald-800 font-bold block uppercase">PROFIT TARGET</span>
              <span className="text-sm font-black text-emerald-700 block mt-0.5">
                +${challenge.profitTarget.toLocaleString()}
              </span>
            </div>

            <div className="border-2 border-neutral-900 bg-rose-50 border-rose-900 p-2.5">
              <span className="text-[10px] text-rose-800 font-bold block uppercase">MAX DRAWDOWN</span>
              <span className="text-sm font-black text-rose-700 block mt-0.5">
                -${challenge.maxDailyDrawdown.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Signature Crude Desk Progress Track */}
          <div>
            <div className="h-3 bg-[#D1D3D4] w-full overflow-hidden">
              <div className="h-full bg-[#4A8ECB] w-full animate-pulse" />
            </div>
            <div className="mt-2 text-xs font-bold text-[#6D6E71] flex justify-between">
              <span>{challenge.learningGoal}</span>
              <span className="font-mono text-neutral-900">STAGE {stageNumber} / 5</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playClick();
                onStartTrading();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white font-black text-sm uppercase tracking-wider py-3.5 px-6 transition cursor-pointer shadow-[4px_4px_0px_#4A8ECB] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <span>ENTER THE TRADING DESK</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
