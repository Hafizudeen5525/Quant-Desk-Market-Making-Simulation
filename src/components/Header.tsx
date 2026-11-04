import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Award, BookOpen, Trophy, Clock, BrainCircuit, Target, AlertTriangle } from 'lucide-react';
import { PropDeskStats } from '../types/desk';
import { sounds } from '../services/soundEffects';

interface HeaderProps {
  stats: PropDeskStats;
  stageNumber: number;
  stageTitle: string;
  profitTarget: number;
  maxDailyDrawdown: number;
  deskTime: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenGuide: () => void;
  onOpenLeaderboard: () => void;
  onOpenMentalMath: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  stageNumber,
  stageTitle,
  profitTarget,
  maxDailyDrawdown,
  deskTime,
  isMuted,
  onToggleMute,
  onOpenGuide,
  onOpenLeaderboard,
  onOpenMentalMath,
}) => {
  const isProfit = stats.dailyPnL >= 0;
  const progressPct = Math.min(100, Math.max(0, (stats.dailyPnL / profitTarget) * 100));
  const drawdownPct = Math.min(100, (Math.max(0, -stats.dailyPnL) / maxDailyDrawdown) * 100);

  return (
    <header className="border-b-2 border-neutral-900 bg-white px-4 py-2.5 text-neutral-900 select-none shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-[1920px] mx-auto">
        {/* Brand & Stage Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center bg-[#111111] text-white font-black text-sm tracking-tighter">
              MM
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black tracking-tight text-lg text-[#111111] uppercase font-sans">
                  PROP DESK
                </h1>
                <span className="bg-[#4A8ECB] text-white text-[11px] font-black uppercase tracking-wider px-2 py-0.5">
                  STAGE {stageNumber}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">
                QUANTITATIVE PROPRIETARY TRADING
              </p>
            </div>
          </div>

          {/* Shift Clock */}
          <div className="hidden sm:flex items-center gap-1.5 border-2 border-neutral-900 bg-neutral-100 px-2.5 py-1 text-xs font-mono font-bold text-neutral-800">
            <Clock className="h-3.5 w-3.5 text-neutral-600" />
            <span>{deskTime}</span>
            <span className="text-[10px] text-neutral-500">EST</span>
          </div>
        </div>

        {/* Center: Account Balance, Daily P&L & Target Progress */}
        <div className="flex items-center gap-4">
          {/* Account Balance */}
          <div className="hidden md:flex flex-col border-2 border-neutral-900 bg-neutral-50 px-3 py-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
              FUNDED ACCOUNT
            </span>
            <span className="font-mono text-sm font-black text-neutral-900">
              ${Math.round(stats.accountBalance).toLocaleString()}
            </span>
          </div>

          {/* Daily PnL vs Target */}
          <div className="flex flex-col border-2 border-neutral-900 bg-neutral-50 px-3 py-1 min-w-[170px]">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-neutral-600 uppercase">DAILY P&amp;L</span>
              <span className="text-neutral-500">TARGET: +${(profitTarget / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span
                className={`font-mono text-base font-black tabular-nums ${
                  isProfit ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isProfit ? '+' : '-'}${Math.abs(Math.round(stats.dailyPnL)).toLocaleString()}
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-600">
                {Math.round(progressPct)}%
              </span>
            </div>
            {/* Target progress bar */}
            <div className="w-full h-1.5 bg-neutral-200 mt-0.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isProfit ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
                style={{ width: `${Math.max(2, progressPct)}%` }}
              />
            </div>
          </div>

          {/* Drawdown Risk Warning */}
          <div className="hidden lg:flex flex-col border-2 border-neutral-900 bg-neutral-50 px-3 py-1 min-w-[150px]">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-neutral-600 uppercase">MAX DRAWDOWN</span>
              <span className="text-rose-600 font-mono">-${(maxDailyDrawdown / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex items-center justify-between gap-1 text-xs font-mono font-bold">
              <span className={drawdownPct > 70 ? 'text-rose-600 animate-pulse' : 'text-neutral-700'}>
                {Math.round(drawdownPct)}% LIMIT
              </span>
              {drawdownPct > 50 && <AlertTriangle className="h-3 w-3 text-rose-600" />}
            </div>
            <div className="w-full h-1.5 bg-neutral-200 mt-0.5 overflow-hidden">
              <div
                className="h-full bg-rose-600 transition-all duration-300"
                style={{ width: `${drawdownPct}%` }}
              />
            </div>
          </div>

          {/* Strikes / Risk Violations */}
          <div className="flex items-center gap-1.5 border-2 border-neutral-900 bg-neutral-50 px-2.5 py-1">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span className="text-xs font-bold text-neutral-700 mr-1">STRIKES:</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((idx) => {
                const isStruck = idx < stats.strikes;
                return (
                  <span
                    key={idx}
                    className={`h-3.5 w-3.5 rounded-none border border-neutral-900 transition-all duration-300 ${
                      isStruck ? 'bg-rose-600 shadow-sm' : 'bg-neutral-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Tools: Mental Math, Field Guide, Leaderboard, Sound */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMentalMath();
            }}
            className="flex items-center gap-1.5 border-2 border-neutral-900 bg-amber-300 hover:bg-amber-400 px-2.5 py-1 text-xs font-bold text-neutral-900 transition cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Jane Street / Optiver Mental Math Challenge"
          >
            <BrainCircuit className="h-3.5 w-3.5" />
            <span className="hidden xl:inline text-xs font-black uppercase">Math EV</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenGuide();
            }}
            className="flex items-center gap-1.5 border-2 border-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 text-xs font-bold text-neutral-900 transition cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Prop Firm Manual & Rules"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#4A8ECB]" />
            <span className="hidden lg:inline text-xs font-black uppercase">Manual</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenLeaderboard();
            }}
            className="flex items-center gap-1.5 border-2 border-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 text-xs font-bold text-neutral-900 transition cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Desk Leaderboard & Records"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden lg:inline text-xs font-black uppercase">Ranks</span>
          </button>

          <button
            onClick={() => {
              onToggleMute();
              sounds.playClick();
            }}
            className="border-2 border-neutral-900 bg-neutral-100 hover:bg-neutral-200 p-1.5 text-neutral-800 transition cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-neutral-400" /> : <Volume2 className="h-4 w-4 text-emerald-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
