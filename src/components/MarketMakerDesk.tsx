import React from 'react';
import { ArrowDown, ArrowUp, ShieldCheck, AlertTriangle, Zap, CheckCircle2, XCircle, Sliders, TrendingUp } from 'lucide-react';
import { AssetBook, InventorySkew, MarketOrder, QuotingSpread } from '../types/desk';
import { sounds } from '../services/soundEffects';

interface MarketMakerDeskProps {
  book: AssetBook;
  orders: MarketOrder[];
  spreadSetting: QuotingSpread;
  skewSetting: InventorySkew;
  onChangeSpread: (spread: QuotingSpread) => void;
  onChangeSkew: (skew: InventorySkew) => void;
  onFillOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
  onFlattenInventory: () => void;
}

export const MarketMakerDesk: React.FC<MarketMakerDeskProps> = ({
  book,
  orders,
  spreadSetting,
  skewSetting,
  onChangeSpread,
  onChangeSkew,
  onFillOrder,
  onRejectOrder,
  onFlattenInventory,
}) => {
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const inventoryPct = Math.min(100, Math.max(-100, (book.inventory / book.maxInventory) * 100));
  const isInventoryCritical = Math.abs(book.inventory) >= book.maxInventory * 0.8;

  return (
    <div className="flex flex-col h-full bg-white border-2 border-neutral-900 shadow-[4px_4px_0px_#111111] overflow-hidden text-neutral-900">
      {/* Black Title Bar */}
      <div className="bg-[#111111] text-white px-4 py-2 flex items-center justify-between border-b-2 border-neutral-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-emerald-400" />
          <h2 className="font-black text-xs md:text-sm tracking-wider uppercase">
            TWO-SIDED MARKET MAKING DESK · {book.ticker}
          </h2>
        </div>
        <span className="font-mono text-xs font-bold text-neutral-400">
          MAX RISK LIMIT: ±{book.maxInventory} LOTS
        </span>
      </div>

      <div className="p-3.5 space-y-3.5 flex-1 flex flex-col justify-between overflow-y-auto">
        {/* Fair Value & Quoting Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* My Bid */}
          <div className="border-2 border-neutral-900 bg-neutral-50 p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
              <span className="uppercase">MY BID (BUY)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 border border-emerald-700 font-mono">
                WE BUY HERE
              </span>
            </div>
            <div className="my-1">
              <span className="font-mono text-2xl font-black text-emerald-700">
                ${book.myBid.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">
              Discount to Fair: -${(book.fairValue - book.myBid).toFixed(2)}
            </span>
          </div>

          {/* Central Fair Value */}
          <div className="border-2 border-neutral-900 bg-neutral-100 p-2.5 flex flex-col justify-between text-center">
            <span className="text-[10px] font-black uppercase text-neutral-600 tracking-wider">
              ESTIMATED FAIR VALUE E[V]
            </span>
            <div className="my-1">
              <span className="font-mono text-2xl font-black text-neutral-900">
                ${book.fairValue.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#4A8ECB] font-bold">
              SPREAD: ${(book.myAsk - book.myBid).toFixed(2)} ({spreadSetting})
            </span>
          </div>

          {/* My Ask */}
          <div className="border-2 border-neutral-900 bg-neutral-50 p-2.5 flex flex-col justify-between text-right">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
              <span className="text-[10px] bg-rose-100 text-rose-800 px-1 py-0.2 border border-rose-700 font-mono">
                WE SELL HERE
              </span>
              <span className="uppercase">MY ASK (SELL)</span>
            </div>
            <div className="my-1">
              <span className="font-mono text-2xl font-black text-rose-700">
                ${book.myAsk.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">
              Premium to Fair: +${(book.myAsk - book.fairValue).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quoting Controls: Spread Width & Inventory Skewing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {/* Spread Width */}
          <div className="border-2 border-neutral-900 bg-white p-2.5 space-y-1.5">
            <div className="flex justify-between items-center font-bold">
              <span className="uppercase text-neutral-700">1. SPREAD WIDTH:</span>
              <span className="text-[10px] text-neutral-500 font-mono">TIGHTER = MORE VOLUME</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['TIGHT', 'MEDIUM', 'WIDE'] as QuotingSpread[]).map((sp) => (
                <button
                  key={sp}
                  onClick={() => {
                    sounds.playClick();
                    onChangeSpread(sp);
                  }}
                  className={`py-1 text-center font-black uppercase text-xs border-2 border-neutral-900 transition cursor-pointer ${
                    spreadSetting === sp
                      ? 'bg-[#111111] text-white shadow-[2px_2px_0px_#4A8ECB]'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Skewing */}
          <div className="border-2 border-neutral-900 bg-white p-2.5 space-y-1.5">
            <div className="flex justify-between items-center font-bold">
              <span className="uppercase text-neutral-700">2. INVENTORY SKEW:</span>
              <span className="text-[10px] text-neutral-500 font-mono">
                {book.inventory > 10 ? 'LONG: SKEW DOWN!' : book.inventory < -10 ? 'SHORT: SKEW UP!' : 'FLAT'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  onChangeSkew('SKEW_DOWN');
                }}
                className={`py-1 text-center font-black uppercase text-xs border-2 border-neutral-900 transition cursor-pointer ${
                  skewSetting === 'SKEW_DOWN'
                    ? 'bg-rose-600 text-white shadow-[2px_2px_0px_#111111]'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
                title="Lowers quotes to attract buyers and dump long inventory"
              >
                SKEW DOWN ↓
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onChangeSkew('NEUTRAL');
                }}
                className={`py-1 text-center font-black uppercase text-xs border-2 border-neutral-900 transition cursor-pointer ${
                  skewSetting === 'NEUTRAL'
                    ? 'bg-[#111111] text-white shadow-[2px_2px_0px_#4A8ECB]'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
              >
                NEUTRAL
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onChangeSkew('SKEW_UP');
                }}
                className={`py-1 text-center font-black uppercase text-xs border-2 border-neutral-900 transition cursor-pointer ${
                  skewSetting === 'SKEW_UP'
                    ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_#111111]'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
                title="Raises quotes to attract sellers and buy back short inventory"
              >
                SKEW UP ↑
              </button>
            </div>
          </div>
        </div>

        {/* Current Inventory Bar Meter */}
        <div className="border-2 border-neutral-900 bg-neutral-50 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="uppercase text-neutral-800">CURRENT POSITION INVENTORY:</span>
              <span
                className={`font-mono text-sm font-black px-1.5 py-0.2 border border-neutral-900 ${
                  book.inventory === 0
                    ? 'bg-neutral-200 text-neutral-900'
                    : book.inventory > 0
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-rose-200 text-rose-900'
                }`}
              >
                {book.inventory > 0 ? `+${book.inventory}` : book.inventory} LOTS
              </span>
            </div>

            {book.inventory !== 0 && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onFlattenInventory();
                }}
                className="text-[10px] font-black uppercase bg-neutral-900 hover:bg-neutral-800 text-white px-2 py-0.5 border border-neutral-900 transition cursor-pointer"
              >
                FLATTEN AT MARKET
              </button>
            )}
          </div>

          {/* Bi-directional Meter */}
          <div className="relative h-4 bg-neutral-200 border border-neutral-900 overflow-hidden">
            {/* Center zero line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-neutral-900 z-10" />

            {/* Inventory fill */}
            {book.inventory > 0 && (
              <div
                className={`absolute top-0 bottom-0 left-1/2 transition-all duration-200 ${
                  isInventoryCritical ? 'bg-rose-600 animate-pulse' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(50, (book.inventory / book.maxInventory) * 50)}%` }}
              />
            )}
            {book.inventory < 0 && (
              <div
                className={`absolute top-0 bottom-0 right-1/2 transition-all duration-200 ${
                  isInventoryCritical ? 'bg-rose-600 animate-pulse' : 'bg-rose-600'
                }`}
                style={{ width: `${Math.min(50, (Math.abs(book.inventory) / book.maxInventory) * 50)}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-neutral-500 font-bold">
            <span>SHORT LIMIT (-{book.maxInventory})</span>
            <span>FLAT (0)</span>
            <span>LONG LIMIT (+{book.maxInventory})</span>
          </div>
        </div>

        {/* Incoming Client Order Stream */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between text-xs font-black uppercase text-neutral-800">
            <span>INCOMING ORDER FLOW &amp; RFQs ({pendingOrders.length})</span>
            <span className="text-[10px] text-neutral-500 font-mono">CLIENT HIT QUEUE</span>
          </div>

          <div className="space-y-2">
            {pendingOrders.length === 0 ? (
              <div className="border-2 border-dashed border-neutral-300 p-4 text-center text-xs font-bold text-neutral-400">
                Quoting active two-sided market. Waiting for client order flow...
              </div>
            ) : (
              pendingOrders.map((order) => {
                const isClientBuying = order.direction === 'BUY';
                const timePct = (order.timeRemaining / order.maxTime) * 100;
                // If client buys, we sell at our ASK. Profit = (MyAsk - Fair) * volume.
                // If client sells, we buy at our BID. Profit = (Fair - MyBid) * volume.
                const potentialProfit = isClientBuying
                  ? (book.myAsk - book.fairValue) * order.volume * 100
                  : (book.fairValue - book.myBid) * order.volume * 100;

                return (
                  <div
                    key={order.id}
                    className={`border-2 p-3 bg-white transition relative shadow-[3px_3px_0px_#111111] ${
                      order.isToxic
                        ? 'border-rose-600 bg-rose-50/50'
                        : 'border-neutral-900 hover:border-neutral-900'
                    }`}
                  >
                    {/* Timer Track */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-200">
                      <div
                        className={`h-full ${order.isToxic ? 'bg-rose-600' : 'bg-[#4A8ECB]'}`}
                        style={{ width: `${timePct}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-neutral-900">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 border border-neutral-900 ${
                            isClientBuying
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          CLIENT WANTS TO {order.direction}
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-700">
                          {order.volume} LOTS
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.isToxic ? (
                          <span className="flex items-center gap-1 text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 uppercase tracking-wider animate-pulse">
                            <AlertTriangle className="h-3 w-3" />
                            TOXIC FLOW WARNING
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-neutral-500 uppercase">
                            {order.clientType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <div className="text-[11px] font-mono">
                        {isClientBuying ? (
                          <span>
                            Hits your ASK @ <strong className="text-rose-700">${book.myAsk.toFixed(2)}</strong> · Est. Edge:{' '}
                            <strong className="text-emerald-700">+${Math.round(potentialProfit)}</strong>
                          </span>
                        ) : (
                          <span>
                            Hits your BID @ <strong className="text-emerald-700">${book.myBid.toFixed(2)}</strong> · Est. Edge:{' '}
                            <strong className="text-emerald-700">+${Math.round(potentialProfit)}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {order.isToxic && (
                          <button
                            onClick={() => {
                              sounds.playClick();
                              onRejectOrder(order.id);
                            }}
                            className="bg-neutral-200 hover:bg-neutral-300 border-2 border-neutral-900 px-2.5 py-1 text-xs font-black uppercase text-neutral-900 transition cursor-pointer"
                          >
                            REJECT FLOW
                          </button>
                        )}

                        <button
                          onClick={() => {
                            sounds.playClick();
                            onFillOrder(order.id);
                          }}
                          className="bg-[#111111] hover:bg-neutral-800 border-2 border-neutral-900 px-3 py-1 text-xs font-black uppercase text-white transition cursor-pointer shadow-[2px_2px_0px_#4A8ECB] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          FILL ORDER
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
