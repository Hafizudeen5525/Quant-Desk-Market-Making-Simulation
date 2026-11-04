import React from 'react';
import { Trophy, X, Award, ShieldCheck } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface LeaderboardEntry {
  name: string;
  firm: string;
  pnl: number;
  stageReached: number;
  accuracy: number;
  date: string;
}

const PROP_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { name: 'Alexandre Mercer', firm: 'Citadel Securities', pnl: 148500, stageReached: 5, accuracy: 98, date: '2026-10-18' },
  { name: 'Chloe Dubois', firm: 'Jane Street Capital', pnl: 124200, stageReached: 5, accuracy: 96, date: '2026-10-19' },
  { name: 'Siddharth Rao', firm: 'Optiver Amsterdam', pnl: 98400, stageReached: 4, accuracy: 94, date: '2026-10-20' },
  { name: 'Liam O\'Connor', firm: 'IMC Financial Markets', pnl: 76300, stageReached: 3, accuracy: 91, date: '2026-10-21' },
  { name: 'Hana Tanaka', firm: 'Flow Traders', pnl: 62500, stageReached: 3, accuracy: 89, date: '2026-10-21' },
];

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  myScore: number;
  myPnL: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  myScore,
  myPnL,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white border-2 border-[#111111] shadow-[8px_8px_0px_#111111] text-neutral-900 font-sans overflow-hidden">
        {/* Header */}
        <div className="bg-[#111111] text-white px-5 py-3 flex items-center justify-between border-b-2 border-neutral-900">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-black uppercase tracking-wider">
              QUANT PROP FIRM · GLOBAL DESK RANKS
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 hover:bg-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="border-2 border-neutral-900 bg-neutral-50 p-3 flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-neutral-500 font-bold block uppercase">
                YOUR RECORDED DESK P&amp;L
              </span>
              <span className="text-xl font-black text-emerald-700">
                +${Math.round(myPnL).toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 font-bold block uppercase">
                DESK SCORE
              </span>
              <span className="text-xl font-black text-[#111111]">
                {myScore.toLocaleString()} PTS
              </span>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <span className="text-[11px] font-black uppercase text-neutral-600 block mb-2 font-sans">
              Top Ranked Proprietary Market Makers:
            </span>
            {PROP_LEADERBOARD_ENTRIES.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-2 border-neutral-900 p-2.5 bg-white hover:bg-neutral-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-6 w-6 flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-neutral-950'
                        : idx === 1
                        ? 'bg-neutral-300 text-neutral-950'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold block text-neutral-900">{entry.name}</span>
                    <span className="text-[10px] text-neutral-500 font-sans">{entry.firm} · Stage {entry.stageReached}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-emerald-700 block">
                    +${entry.pnl.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-500">{entry.accuracy}% accuracy</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-neutral-900 bg-neutral-100 px-5 py-3 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="bg-[#111111] hover:bg-neutral-800 text-white font-black px-5 py-1.5 text-xs uppercase tracking-wider transition cursor-pointer shadow-[2px_2px_0px_#4A8ECB] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
