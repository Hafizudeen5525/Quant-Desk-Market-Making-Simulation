import React from 'react';
import { Zap, Clock, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { MacroNewsEvent } from '../types/desk';
import { sounds } from '../services/soundEffects';

interface MacroAlphaPanelProps {
  event: MacroNewsEvent | null;
  onTradeMacro: (direction: 'BUY' | 'SELL') => void;
}

export const MacroAlphaPanel: React.FC<MacroAlphaPanelProps> = ({ event, onTradeMacro }) => {
  return (
    <div className="flex flex-col h-full bg-white border-2 border-neutral-900 shadow-[4px_4px_0px_#111111] overflow-hidden text-neutral-900">
      {/* Title */}
      <div className="bg-[#111111] text-white px-4 py-2 flex items-center justify-between border-b-2 border-neutral-900">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <h3 className="font-black text-xs md:text-sm tracking-wider uppercase">
            MACRO CATALYST &amp; LATENCY ALPHA DESK
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-neutral-400">
          SURPRISE DELTA
        </span>
      </div>

      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        {!event || event.isTraded ? (
          <div className="border-2 border-dashed border-neutral-300 p-4 text-center text-xs font-bold text-neutral-400 flex flex-col items-center justify-center h-36">
            <Clock className="h-6 w-6 text-neutral-300 mb-1" />
            <span>Awaiting next macroeconomic economic print from terminal wire...</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Header with Countdown */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase bg-[#111111] text-white px-2 py-0.5">
                {event.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-rose-600 animate-pulse">
                <Clock className="h-3.5 w-3.5" />
                <span>{event.timeRemaining}s LATENCY WINDOW</span>
              </div>
            </div>

            <div className="font-black text-sm text-neutral-900 leading-tight">
              {event.title}
            </div>

            {/* Consensus vs Actual Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="border border-neutral-300 bg-neutral-50 p-2">
                <span className="text-[10px] text-neutral-500 font-bold block uppercase">
                  WALL ST CONSENSUS
                </span>
                <span className="text-sm font-black text-neutral-700 block mt-0.5">
                  {event.consensus}
                </span>
              </div>

              <div className="border-2 border-neutral-900 bg-amber-50 p-2">
                <span className="text-[10px] text-neutral-600 font-bold block uppercase">
                  ACTUAL PRINT
                </span>
                <span className="text-sm font-black text-neutral-900 block mt-0.5">
                  {event.actual}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-600 italic">
              💡 {event.explanation}
            </p>

            {/* Fast Directional Execution */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  onTradeMacro('BUY');
                }}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-neutral-900 py-2 px-3 font-black text-xs uppercase tracking-wide transition cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <ArrowUpRight className="h-4 w-4" />
                <span>BUY LONG [B]</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onTradeMacro('SELL');
                }}
                className="flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white border-2 border-neutral-900 py-2 px-3 font-black text-xs uppercase tracking-wide transition cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <ArrowDownRight className="h-4 w-4" />
                <span>SELL SHORT [S]</span>
              </button>
            </div>
          </div>
        )}

        <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between pt-1 border-t border-neutral-200">
          <span>HIGH-SPEED ALPHA DESK</span>
          <span>LOT SIZE: 30 CONTRACTS</span>
        </div>
      </div>
    </div>
  );
};
