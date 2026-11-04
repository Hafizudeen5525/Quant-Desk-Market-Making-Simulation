import React from 'react';
import { Layers, ArrowRight, DollarSign, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { AssetBook } from '../types/desk';
import { sounds } from '../services/soundEffects';

interface ArbitrageDeskProps {
  book: AssetBook;
  onExecuteArb: (type: 'SELL_ETF_BUY_BASKET' | 'BUY_ETF_SELL_BASKET', edgePerShare: number) => void;
}

export const ArbitrageDesk: React.FC<ArbitrageDeskProps> = ({ book, onExecuteArb }) => {
  const etfPrice = book.fairValue;
  const basketNav = book.syntheticBasketFair;
  const discrepancy = Number((etfPrice - basketNav).toFixed(2));
  const absDiff = Math.abs(discrepancy);
  const isArbOpen = absDiff >= 0.35;

  return (
    <div className="flex flex-col h-full bg-white border-2 border-neutral-900 shadow-[4px_4px_0px_#111111] overflow-hidden text-neutral-900">
      {/* Title */}
      <div className="bg-[#111111] text-white px-4 py-2 flex items-center justify-between border-b-2 border-neutral-900">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#4A8ECB]" />
          <h3 className="font-black text-xs md:text-sm tracking-wider uppercase">
            QUANT ETF BASKET ARBITRAGE (NAV CREATION / REDEMPTION)
          </h3>
        </div>
        <span
          className={`text-[10px] font-black uppercase px-2 py-0.5 border border-white font-mono ${
            isArbOpen ? 'bg-[#4A8ECB] text-white animate-pulse' : 'bg-neutral-800 text-neutral-400'
          }`}
        >
          {isArbOpen ? 'ARBITRAGE WINDOW OPEN' : 'FAIRLY PRICED'}
        </span>
      </div>

      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
        {/* NAV vs Market Comparison */}
        <div className="grid grid-cols-3 gap-2.5 text-center font-mono text-xs">
          <div className="border-2 border-neutral-900 bg-neutral-50 p-2.5">
            <span className="text-[10px] text-neutral-500 font-bold block uppercase">
              {book.ticker} PRICE
            </span>
            <span className="text-xl font-black text-neutral-900 block mt-1">
              ${etfPrice.toFixed(2)}
            </span>
          </div>

          <div className="border-2 border-neutral-900 bg-neutral-50 p-2.5">
            <span className="text-[10px] text-neutral-500 font-bold block uppercase">
              SYNTHETIC BASKET NAV
            </span>
            <span className="text-xl font-black text-neutral-700 block mt-1">
              ${basketNav.toFixed(2)}
            </span>
          </div>

          <div
            className={`border-2 border-neutral-900 p-2.5 ${
              isArbOpen ? 'bg-amber-100 border-amber-900' : 'bg-neutral-100'
            }`}
          >
            <span className="text-[10px] text-neutral-600 font-bold block uppercase">
              SPREAD MISPRICING
            </span>
            <span
              className={`text-xl font-black block mt-1 ${
                discrepancy > 0 ? 'text-emerald-700' : discrepancy < 0 ? 'text-rose-700' : 'text-neutral-900'
              }`}
            >
              {discrepancy > 0 ? `+${discrepancy}` : discrepancy}
            </span>
          </div>
        </div>

        {/* Arb Execution Box */}
        <div className="border-2 border-neutral-900 bg-neutral-50 p-3 space-y-2">
          <div className="text-xs font-bold text-neutral-700 flex justify-between">
            <span>ARBITRAGE STRATEGY:</span>
            <span className="font-mono text-[11px] text-neutral-500">LOT SIZE: 50 LOTS (5,000 SHARES)</span>
          </div>

          {isArbOpen ? (
            discrepancy > 0 ? (
              <button
                onClick={() => {
                  sounds.playCashRegister();
                  onExecuteArb('SELL_ETF_BUY_BASKET', absDiff);
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-neutral-900 py-2.5 px-4 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[3px_3px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  EXECUTE ARB: SELL OVERPRICED ETF @ ${etfPrice.toFixed(2)} &amp; BUY BASKET @ ${basketNav.toFixed(2)} (+${Math.round(absDiff * 5000)} EDGE)
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playCashRegister();
                  onExecuteArb('BUY_ETF_SELL_BASKET', absDiff);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#4A8ECB] hover:bg-sky-500 text-white border-2 border-neutral-900 py-2.5 px-4 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[3px_3px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  EXECUTE ARB: BUY CHEAP ETF @ ${etfPrice.toFixed(2)} &amp; SHORT BASKET @ ${basketNav.toFixed(2)} (+${Math.round(absDiff * 5000)} EDGE)
                </span>
              </button>
            )
          ) : (
            <div className="border border-neutral-300 bg-white p-2.5 text-center text-xs font-bold text-neutral-500">
              Basket NAV and ETF are within fair value boundaries (Edge &lt; $0.35/sh). Waiting for statistical mispricing...
            </div>
          )}
        </div>

        <p className="text-[11px] text-neutral-600 font-medium">
          💡 <strong className="text-neutral-900">Quant Concept:</strong> ETF Authorized Participants (APs) like Jane Street arbitrage discrepancies by creating or redeeming ETF share blocks against the underlying stock portfolio, ensuring market efficiency.
        </p>
      </div>
    </div>
  );
};
