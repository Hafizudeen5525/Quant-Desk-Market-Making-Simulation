import React, { useState } from 'react';
import { X, BookOpen, Layers, ShieldAlert, Zap, TrendingUp, Sliders, BrainCircuit } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface TradingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradingGuideModal: React.FC<TradingGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'MM' | 'SKEW' | 'TOXIC' | 'ARB' | 'MACRO' | 'RULES' | 'HOTKEYS'>('MM');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white border-2 border-[#111111] shadow-[8px_8px_0px_#111111] text-neutral-900 font-sans overflow-hidden">
        {/* Header */}
        <div className="bg-[#111111] text-white px-5 py-3 flex items-center justify-between border-b-2 border-neutral-900">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#4A8ECB]" />
            <h2 className="text-sm font-black uppercase tracking-wider">
              TRADING DESK MANUAL &amp; GUIDE
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

        {/* Tab Bar */}
        <div className="flex border-b-2 border-neutral-900 bg-neutral-100 overflow-x-auto text-xs font-mono font-bold">
          {[
            { id: 'MM', label: '1. Two-Sided MM' },
            { id: 'SKEW', label: '2. Inventory Skew' },
            { id: 'TOXIC', label: '3. Toxic Flow' },
            { id: 'ARB', label: '4. ETF Arbitrage' },
            { id: 'MACRO', label: '5. Macro Alpha' },
            { id: 'RULES', label: '6. Risk Rules' },
            { id: 'HOTKEYS', label: '7. Hotkeys' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3.5 py-2.5 transition whitespace-nowrap cursor-pointer uppercase ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 border-b-2 border-[#4A8ECB] font-black'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-neutral-800 leading-relaxed">
          {activeTab === 'MM' && (
            <div className="space-y-3">
              <div className="border-2 border-neutral-900 bg-neutral-50 p-4">
                <h3 className="text-sm font-black uppercase text-[#111111] mb-2">
                  HOW MARKET MAKING WORKS
                </h3>
                <p>
                  Market makers don't bet on whether an asset goes up or down. Instead, they provide liquidity by quoting prices on both sides at once:
                </p>
                <div className="grid grid-cols-2 gap-3 my-3 font-mono">
                  <div className="border-2 border-emerald-900 bg-emerald-50 p-3">
                    <span className="font-black text-emerald-800 block text-xs uppercase">
                      YOUR BID (WE BUY)
                    </span>
                    <p className="text-[11px] text-emerald-950 mt-1">
                      Always quoted <strong>BELOW</strong> Fair Value. When a retail client wants to sell, they hit your BID. You buy at a discount!
                    </p>
                  </div>

                  <div className="border-2 border-rose-900 bg-rose-50 p-3">
                    <span className="font-black text-rose-800 block text-xs uppercase">
                      YOUR ASK (WE SELL)
                    </span>
                    <p className="text-[11px] text-rose-950 mt-1">
                      Always quoted <strong>ABOVE</strong> Fair Value. When a retail client wants to buy, they hit your ASK. You sell at a premium!
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-neutral-900">
                  Spread Edge = (Ask Price - Fair Value) or (Fair Value - Bid Price). Across thousands of trades, the law of large numbers turns this edge into steady proprietary profit.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'SKEW' && (
            <div className="space-y-3">
              <div className="border-2 border-neutral-900 bg-neutral-50 p-4">
                <h3 className="text-sm font-black uppercase text-[#111111] mb-2">
                  INVENTORY RISK &amp; QUOTE SKEWING
                </h3>
                <p>
                  The biggest risk a market maker faces is accumulating a massive inventory position. If you buy 40 contracts and the market drops $1.00, your inventory loses $4,000, destroying your spread edge!
                </p>
                <div className="space-y-2 mt-3 font-mono text-xs">
                  <div className="border border-neutral-900 bg-white p-2.5">
                    <strong className="text-rose-700 block uppercase">
                      IF YOU ARE LONG INVENTORY (+30 LOTS):
                    </strong>
                    <span>
                      Click <strong className="text-neutral-900">[SKEW DOWN]</strong>. This lowers both your Bid and Ask. Lowering your Ask makes buyers eagerly buy from you, offloading your inventory. Lowering your Bid stops sellers from giving you more!
                    </span>
                  </div>

                  <div className="border border-neutral-900 bg-white p-2.5">
                    <strong className="text-emerald-700 block uppercase">
                      IF YOU ARE SHORT INVENTORY (-30 LOTS):
                    </strong>
                    <span>
                      Click <strong className="text-neutral-900">[SKEW UP]</strong>. This raises both your Bid and Ask. Sellers are attracted to your high Bid, allowing you to buy back contracts and return to flat!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TOXIC' && (
            <div className="space-y-3">
              <div className="border-2 border-neutral-900 bg-neutral-50 p-4">
                <h3 className="text-sm font-black uppercase text-[#111111] mb-2">
                  ADVERSE SELECTION &amp; TOXIC ORDER FLOW
                </h3>
                <p>
                  Not all clients are uninformed retail. Large hedge funds and high-frequency algorithms trade on private signals or immediate pending news.
                </p>
                <p className="mt-2">
                  When an <strong>Institutional Sweep / Toxic Order</strong> arrives, it will immediately shift the underlying Fair Value against you. If you fill their buy order, the market will jump higher immediately after, leaving you with an instant loss.
                </p>
                <div className="mt-3 border-2 border-rose-900 bg-rose-50 p-3 font-semibold text-rose-950">
                  💡 <strong>Defense:</strong> When you see the red TOXIC FLOW WARNING badge, either widen your spread or click <strong>REJECT FLOW</strong> to protect desk capital!
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ARB' && (
            <div className="space-y-3">
              <div className="border-2 border-neutral-900 bg-neutral-50 p-4">
                <h3 className="text-sm font-black uppercase text-[#111111] mb-2">
                  ETF BASKET CREATION &amp; REDEMPTION ARBITRAGE
                </h3>
                <p>
                  An ETF holds a basket of underlying stocks. Arbitrage keeps the ETF price in sync with the value of that basket:
                </p>
                <ul className="list-disc list-inside space-y-1.5 mt-2 font-mono text-[11px]">
                  <li>
                    <strong>ETF Premium (ETF &gt; Basket NAV):</strong> Sell the expensive ETF, buy the cheaper underlying basket. Deliver the basket to the ETF issuer to create new ETF shares and pocket the price difference!
                  </li>
                  <li>
                    <strong>ETF Discount (ETF &lt; Basket NAV):</strong> Buy the cheap ETF, sell the basket. Redeem ETF shares for underlying stock and pocket the spread!
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'MACRO' && (
            <div className="space-y-3">
              <div className="border-2 border-neutral-900 bg-neutral-50 p-4">
                <h3 className="text-sm font-black uppercase text-[#111111] mb-2">
                  MACROECONOMIC SURPRISE ALPHA
                </h3>
                <p>
                  When government data prints (CPI inflation, Fed decisions, Jobs report), markets react not to the raw number, but to the <strong>SURPRISE DELTA</strong> (Actual minus Consensus):
                </p>
                <div className="space-y-1.5 mt-2 text-[11px] font-mono">
                  <p>• CPI &lt; Consensus $\rightarrow$ Lower inflation $\rightarrow$ Dovish Fed $\rightarrow$ <strong>BULLISH [BUY]</strong></p>
                  <p>• CPI &gt; Consensus $\rightarrow$ High inflation $\rightarrow$ Rate hike risk $\rightarrow$ <strong>BEARISH [SELL]</strong></p>
                  <p>• Fast execution wins: You have 4 seconds before algorithmic bots reprice the order book.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RULES' && (
            <div className="space-y-3">
              <div className="border-2 border-neutral-900 bg-neutral-50 p-4">
                <h3 className="text-sm font-black uppercase text-[#111111] mb-2">
                  PROP FIRM CHALLENGE &amp; RISK LIMITS
                </h3>
                <div className="space-y-2 text-xs">
                  <p>
                    • <strong>Max Daily Drawdown:</strong> The single most important rule. If your cumulative daily losses cross the drawdown threshold, your account is instantly liquidated and the day fails.
                  </p>
                  <p>
                    • <strong>Max Inventory:</strong> Exceeding your position limit (e.g. ±50 contracts) triggers a strike from the risk manager.
                  </p>
                  <p>
                    • <strong>3 Strikes Rule:</strong> 3 risk limit breaches result in immediate dismissal from the firm.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'HOTKEYS' && (
            <div className="space-y-3">
              <div className="border-2 border-neutral-900 bg-neutral-50 p-4">
                <h3 className="text-sm font-black uppercase text-[#111111] mb-3">
                  TRADING FLOOR KEYBOARD SHORTCUTS
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="border border-neutral-300 bg-white p-2 flex justify-between items-center">
                    <span>Tight Spread:</span>
                    <kbd className="border border-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">[1]</kbd>
                  </div>
                  <div className="border border-neutral-300 bg-white p-2 flex justify-between items-center">
                    <span>Medium Spread:</span>
                    <kbd className="border border-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">[2]</kbd>
                  </div>
                  <div className="border border-neutral-300 bg-white p-2 flex justify-between items-center">
                    <span>Wide Spread:</span>
                    <kbd className="border border-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">[3]</kbd>
                  </div>
                  <div className="border border-neutral-300 bg-white p-2 flex justify-between items-center">
                    <span>Skew Quotes Down:</span>
                    <kbd className="border border-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">[D]</kbd>
                  </div>
                  <div className="border border-neutral-300 bg-white p-2 flex justify-between items-center">
                    <span>Neutral Quote Skew:</span>
                    <kbd className="border border-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">[N]</kbd>
                  </div>
                  <div className="border border-neutral-300 bg-white p-2 flex justify-between items-center">
                    <span>Skew Quotes Up:</span>
                    <kbd className="border border-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">[U]</kbd>
                  </div>
                  <div className="border border-neutral-300 bg-white p-2 flex justify-between items-center">
                    <span>Flatten Inventory:</span>
                    <kbd className="border border-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">[F] / [Space]</kbd>
                  </div>
                  <div className="border border-neutral-300 bg-white p-2 flex justify-between items-center">
                    <span>Trade Macro Alpha:</span>
                    <kbd className="border border-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">[B] / [S]</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-neutral-900 bg-neutral-100 px-5 py-3 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="bg-[#111111] hover:bg-neutral-800 text-white font-black px-6 py-2 text-xs uppercase tracking-wider transition cursor-pointer shadow-[3px_3px_0px_#4A8ECB] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            RETURN TO TRADING DESK
          </button>
        </div>
      </div>
    </div>
  );
};
