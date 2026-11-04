import React from 'react';
import { ArrowRight, RotateCcw, CheckCircle2, AlertTriangle, Trophy, DollarSign } from 'lucide-react';
import { PropDeskStats, PropFirmChallenge } from '../types/desk';
import { sounds } from '../services/soundEffects';

interface DayResultsModalProps {
  isPassed: boolean;
  challenge: PropFirmChallenge;
  stats: PropDeskStats;
  stageNumber: number;
  onNextStage: () => void;
  onRetryStage: () => void;
}

export const DayResultsModal: React.FC<DayResultsModalProps> = ({
  isPassed,
  challenge,
  stats,
  stageNumber,
  onNextStage,
  onRetryStage,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white border-2 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden text-neutral-900 font-sans">
        {/* Header */}
        <div
          className={`px-5 py-3 flex items-center justify-between border-b-2 border-neutral-900 text-white font-black text-sm tracking-wider uppercase ${
            isPassed ? 'bg-emerald-700' : 'bg-rose-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {isPassed ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            <span>
              {isPassed
                ? `STAGE ${stageNumber} EVALUATION PASSED · PROMOTED`
                : `STAGE ${stageNumber} BREACHED · ACCOUNT LIQUIDATED`}
            </span>
          </div>
          <span className="text-xs font-mono opacity-90">PROP RISK DESK</span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-3xl font-black text-[#111111] uppercase leading-tight">
              {isPassed ? 'PROFIT TARGET ACHIEVED' : 'MAX DRAWDOWN VIOLATION'}
            </h2>
            <p className="text-xs text-neutral-600 mt-1 font-medium">
              {isPassed
                ? 'Your two-sided quoting, inventory discipline, and risk management cleared the firm\'s proprietary trading standards.'
                : 'Your cumulative losses hit the firm\'s maximum allowable daily drawdown limit. Position forced closed.'}
            </p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="border-2 border-neutral-900 bg-neutral-50 p-3">
              <span className="text-[10px] text-neutral-500 font-bold block uppercase">
                FINAL DAILY P&amp;L
              </span>
              <span
                className={`text-xl font-black block mt-0.5 ${
                  stats.dailyPnL >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {stats.dailyPnL >= 0 ? '+' : '-'}${Math.abs(Math.round(stats.dailyPnL)).toLocaleString()}
              </span>
              <span className="text-[10px] text-neutral-500 font-bold block mt-0.5">
                Target: +${challenge.profitTarget.toLocaleString()}
              </span>
            </div>

            <div className="border-2 border-neutral-900 bg-neutral-50 p-3">
              <span className="text-[10px] text-neutral-500 font-bold block uppercase">
                ACCOUNT BALANCE
              </span>
              <span className="text-xl font-black text-neutral-900 block mt-0.5">
                ${Math.round(stats.accountBalance).toLocaleString()}
              </span>
              <span className="text-[10px] text-neutral-500 font-bold block mt-0.5">
                Started: ${(challenge.startingCapital / 1000).toFixed(0)}k
              </span>
            </div>
          </div>

          {/* PnL Attribution Breakdown */}
          <div className="border-2 border-neutral-900 bg-neutral-50 p-3.5 space-y-2 text-xs font-mono">
            <div className="flex justify-between font-bold text-neutral-700">
              <span>Market Making Spread Edge:</span>
              <span className="text-emerald-700">+${Math.round(stats.realizedSpreadPnL).toLocaleString()}</span>
            </div>
            {challenge.unlockedFeatures.etfArbitrage && (
              <div className="flex justify-between font-bold text-neutral-700">
                <span>ETF Basket Arbitrage:</span>
                <span className="text-emerald-700">+${Math.round(stats.arbitragePnL).toLocaleString()}</span>
              </div>
            )}
            {challenge.unlockedFeatures.macroAlpha && (
              <div className="flex justify-between font-bold text-neutral-700">
                <span>Macro Catalyst Alpha:</span>
                <span className={stats.macroAlphaPnL >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                  {stats.macroAlphaPnL >= 0 ? '+' : ''}${Math.round(stats.macroAlphaPnL).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-neutral-700 pt-1 border-t border-neutral-300">
              <span>Toxic Flow Defended / Avoided:</span>
              <span className="text-neutral-900">{stats.toxicHitsAvoided} orders</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-700">
              <span>Strikes Incurred:</span>
              <span className={stats.strikes === 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {stats.strikes} / {challenge.allowedStrikes}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1">
            {!isPassed ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  onRetryStage();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider py-3 px-6 transition cursor-pointer shadow-[4px_4px_0px_#4A8ECB] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <RotateCcw className="h-4 w-4" />
                <span>RETRY STAGE {stageNumber} EVALUATION</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  onNextStage();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 transition cursor-pointer shadow-[4px_4px_0px_#4A8ECB] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <span>PROCEED TO STAGE {stageNumber + 1}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
