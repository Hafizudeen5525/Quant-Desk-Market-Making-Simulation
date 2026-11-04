/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { MorningBriefingModal } from './components/MorningBriefingModal';
import { MarketMakerDesk } from './components/MarketMakerDesk';
import { ArbitrageDesk } from './components/ArbitrageDesk';
import { MacroAlphaPanel } from './components/MacroAlphaPanel';
import { MentalMathModal } from './components/MentalMathModal';
import { DayResultsModal } from './components/DayResultsModal';
import { TradingGuideModal } from './components/TradingGuideModal';
import { LeaderboardModal } from './components/LeaderboardModal';

import {
  AssetBook,
  InventorySkew,
  MacroNewsEvent,
  MarketOrder,
  MentalMathQuestion,
  PropDeskStats,
  PropFirmChallenge,
  QuotingSpread,
} from './types/desk';
import {
  INITIAL_ASSET_BOOKS,
  MENTAL_MATH_POOL,
  PROP_FIRM_CHALLENGES,
} from './services/scenarioData';
import { getRandomMacroEvent } from './services/newsData';
import { sounds } from './services/soundEffects';

const INITIAL_STATS: PropDeskStats = {
  accountBalance: 100_000,
  startingCapital: 100_000,
  dailyPnL: 0,
  realizedSpreadPnL: 0,
  arbitragePnL: 0,
  macroAlphaPnL: 0,
  drawdown: 0,
  maxDrawdownReached: 0,
  strikes: 0,
  ordersFilled: 0,
  toxicHitsAvoided: 0,
  toxicHitsSuffered: 0,
  stars: 0,
  levelPassed: false,
  isAccountBlown: false,
};

export default function App() {
  // Stage State
  const [stageNumber, setStageNumber] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Modals
  const [isMorningBriefingOpen, setIsMorningBriefingOpen] = useState<boolean>(true);
  const [isDayResultsOpen, setIsDayResultsOpen] = useState<boolean>(false);
  const [isDayPassed, setIsDayPassed] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isMentalMathOpen, setIsMentalMathOpen] = useState<boolean>(false);
  const [activeMathQuestion, setActiveMathQuestion] = useState<MentalMathQuestion>(MENTAL_MATH_POOL[0]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Desk Time
  const [deskTimeSeconds, setDeskTimeSeconds] = useState<number>(8 * 3600); // 08:00 AM

  // Current Challenge
  const currentChallenge: PropFirmChallenge =
    PROP_FIRM_CHALLENGES.find((c) => c.stage === stageNumber) || PROP_FIRM_CHALLENGES[4];

  // Desk Stats
  const [stats, setStats] = useState<PropDeskStats>({
    ...INITIAL_STATS,
    accountBalance: currentChallenge.startingCapital,
    startingCapital: currentChallenge.startingCapital,
  });

  // Asset Book & Quoting state
  const [book, setBook] = useState<AssetBook>(() => ({
    ...INITIAL_ASSET_BOOKS[currentChallenge.asset],
    maxInventory: currentChallenge.maxInventoryLimit,
  }));
  const [spreadSetting, setSpreadSetting] = useState<QuotingSpread>('MEDIUM');
  const [skewSetting, setSkewSetting] = useState<InventorySkew>('NEUTRAL');

  // Orders Stream & Macro Events
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [currentMacroEvent, setCurrentMacroEvent] = useState<MacroNewsEvent | null>(null);

  // Recalculate Quotes based on Fair Value, Spread width, and Inventory Skew
  const recalculateQuotes = useCallback(
    (fair: number, spreadMode: QuotingSpread, skewMode: InventorySkew) => {
      const halfSpread =
        spreadMode === 'TIGHT' ? 0.15 : spreadMode === 'MEDIUM' ? 0.25 : 0.45;
      const skewDelta =
        skewMode === 'SKEW_DOWN' ? -0.20 : skewMode === 'SKEW_UP' ? 0.20 : 0.0;

      const bid = Number((fair - halfSpread + skewDelta).toFixed(2));
      const ask = Number((fair + halfSpread + skewDelta).toFixed(2));
      const spread = Number((ask - bid).toFixed(2));

      return { bid, ask, spread };
    },
    []
  );

  // Initialize stage
  const setupStage = useCallback(
    (stg: number) => {
      const ch = PROP_FIRM_CHALLENGES.find((c) => c.stage === stg) || PROP_FIRM_CHALLENGES[4];
      const initialBookData = {
        ...INITIAL_ASSET_BOOKS[ch.asset],
        maxInventory: ch.maxInventoryLimit,
      };

      const quotes = recalculateQuotes(initialBookData.fairValue, 'MEDIUM', 'NEUTRAL');
      setBook({
        ...initialBookData,
        myBid: quotes.bid,
        myAsk: quotes.ask,
        spread: quotes.spread,
        inventory: 0,
      });

      setStats({
        accountBalance: ch.startingCapital,
        startingCapital: ch.startingCapital,
        dailyPnL: 0,
        realizedSpreadPnL: 0,
        arbitragePnL: 0,
        macroAlphaPnL: 0,
        drawdown: 0,
        maxDrawdownReached: 0,
        strikes: 0,
        ordersFilled: 0,
        toxicHitsAvoided: 0,
        toxicHitsSuffered: 0,
        stars: 0,
        levelPassed: false,
        isAccountBlown: false,
      });

      setSpreadSetting('MEDIUM');
      setSkewSetting('NEUTRAL');
      setOrders([]);
      setCurrentMacroEvent(null);
      setDeskTimeSeconds(8 * 3600);
      setIsMorningBriefingOpen(true);
      setIsDayResultsOpen(false);
      setIsPlaying(false);
    },
    [recalculateQuotes]
  );

  useEffect(() => {
    setupStage(stageNumber);
  }, [stageNumber, setupStage]);

  // Main Market Microstructure Tick Engine
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBook((prev) => {
        // Fair value random walk with slight mean reversion
        const drift = (Math.random() - 0.49) * 0.16;
        const newFair = Number(Math.max(20, prev.fairValue + drift).toFixed(2));

        // Arbitrage synthetic NAV divergence
        const arbOffset =
          currentChallenge.unlockedFeatures.etfArbitrage && Math.random() > 0.4
            ? Number(((Math.random() - 0.5) * 1.1).toFixed(2))
            : 0;
        const newBasketFair = Number((newFair + arbOffset).toFixed(2));

        const quotes = recalculateQuotes(newFair, spreadSetting, skewSetting);

        return {
          ...prev,
          fairValue: newFair,
          myBid: quotes.bid,
          myAsk: quotes.ask,
          spread: quotes.spread,
          syntheticBasketFair: newBasketFair,
          history: [...prev.history.slice(-20), newFair],
        };
      });

      // Update Desk Clock (1 real second = 4 desk minutes)
      setDeskTimeSeconds((prev) => {
        const nextTime = prev + 240;
        // Shift closes at 16:30 (4:30 PM = 16.5 * 3600 = 59,400s)
        if (nextTime >= 16.5 * 3600) {
          handleShiftClose();
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, spreadSetting, skewSetting, recalculateQuotes, currentChallenge]);

  // Update Quotes when user toggles Spread or Skew
  const handleChangeSpread = (sp: QuotingSpread) => {
    setSpreadSetting(sp);
    const quotes = recalculateQuotes(book.fairValue, sp, skewSetting);
    setBook((b) => ({ ...b, myBid: quotes.bid, myAsk: quotes.ask, spread: quotes.spread }));
  };

  const handleChangeSkew = (sk: InventorySkew) => {
    setSkewSetting(sk);
    const quotes = recalculateQuotes(book.fairValue, spreadSetting, sk);
    setBook((b) => ({ ...b, myBid: quotes.bid, myAsk: quotes.ask, spread: quotes.spread }));
  };

  // Order Flow Generator
  useEffect(() => {
    if (!isPlaying) return;

    const orderInterval = setInterval(() => {
      setOrders((prev) => {
        if (prev.filter((o) => o.status === 'PENDING').length >= 3) return prev;

        const isToxic =
          currentChallenge.unlockedFeatures.toxicFlowDetection && Math.random() > 0.65;
        const isClientBuying = Math.random() > 0.5;
        const volume = isToxic
          ? Math.floor(25 + Math.random() * 25)
          : Math.floor(10 + Math.random() * 20);

        const newOrder: MarketOrder = {
          id: 'ORD-' + Math.floor(100 + Math.random() * 900),
          ticker: currentChallenge.asset,
          clientType: isToxic ? 'Informed Fund' : Math.random() > 0.5 ? 'Retail Trader' : 'Algorithmic MM',
          direction: isClientBuying ? 'BUY' : 'SELL',
          volume,
          timeRemaining: isToxic ? 4 : 7,
          maxTime: isToxic ? 4 : 7,
          isToxic,
          status: 'PENDING',
        };

        sounds.playClick();
        return [...prev, newOrder];
      });
    }, 3200);

    return () => clearInterval(orderInterval);
  }, [isPlaying, currentChallenge]);

  // Order timers ticking down
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setOrders((prev) =>
        prev
          .map((ord) => {
            if (ord.status !== 'PENDING') return ord;
            const newTime = ord.timeRemaining - 1;
            if (newTime <= 0) {
              return { ...ord, timeRemaining: 0, status: 'EXPIRED' as const };
            }
            return { ...ord, timeRemaining: newTime };
          })
          .filter((ord) => ord.status === 'PENDING')
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Macro Events Generator
  useEffect(() => {
    if (!isPlaying || !currentChallenge.unlockedFeatures.macroAlpha) return;

    const macroInterval = setInterval(() => {
      if (!currentMacroEvent) {
        const ev = getRandomMacroEvent();
        sounds.playNewsAlert();
        setCurrentMacroEvent(ev);
      }
    }, 14000);

    return () => clearInterval(macroInterval);
  }, [isPlaying, currentChallenge, currentMacroEvent]);

  // Macro Event countdown
  useEffect(() => {
    if (!currentMacroEvent || currentMacroEvent.isTraded || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentMacroEvent((prev) => {
        if (!prev) return null;
        if (prev.timeRemaining <= 1) {
          return null; // expired window
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMacroEvent, isPlaying]);

  // Check Prop Firm Drawdown and Profit Target limits
  useEffect(() => {
    if (!isPlaying) return;

    // Check Max Daily Drawdown violation
    if (stats.dailyPnL <= -currentChallenge.maxDailyDrawdown) {
      sounds.playStrikeError();
      setIsPlaying(false);
      setIsDayPassed(false);
      setIsDayResultsOpen(true);
      setStats((s) => ({ ...s, isAccountBlown: true }));
      return;
    }

    // Check Profit Target achieved
    if (stats.dailyPnL >= currentChallenge.profitTarget) {
      sounds.playCashRegister();
      setIsPlaying(false);
      setIsDayPassed(true);
      setIsDayResultsOpen(true);
      setStats((s) => ({ ...s, levelPassed: true }));
      return;
    }
  }, [stats.dailyPnL, currentChallenge, isPlaying]);

  // Handle Filling Client Order
  const handleFillOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (order.isToxic) {
      // ADVERSE SELECTION HIT!
      sounds.playStrikeError();
      const adverseLoss = order.volume * 85; // e.g. -$2,500
      setStats((s) => ({
        ...s,
        accountBalance: s.accountBalance - adverseLoss,
        dailyPnL: s.dailyPnL - adverseLoss,
        toxicHitsSuffered: s.toxicHitsSuffered + 1,
        strikes: s.strikes + 1,
      }));

      // Fair value immediately jumps against us
      const jumpDelta = order.direction === 'BUY' ? 0.70 : -0.70;
      setBook((b) => ({
        ...b,
        fairValue: Number((b.fairValue + jumpDelta).toFixed(2)),
        inventory: order.direction === 'BUY' ? b.inventory - order.volume : b.inventory + order.volume,
      }));

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      return;
    }

    // UNINFORMED RETAIL FILL -> CAPTURE EDGE!
    sounds.playHedgeSuccess();
    const isClientBuying = order.direction === 'BUY';
    const edgePerShare = isClientBuying
      ? book.myAsk - book.fairValue
      : book.fairValue - book.myBid;
    const earnedPnL = Number((edgePerShare * order.volume * 100).toFixed(0));

    // Update inventory:
    // If client buys, we sell to them -> inventory decreases
    // If client sells, we buy from them -> inventory increases
    const newInventory = isClientBuying
      ? book.inventory - order.volume
      : book.inventory + order.volume;

    // Check if new inventory exceeds max limit
    if (Math.abs(newInventory) > book.maxInventory) {
      sounds.playStrikeError();
      const riskFine = 1000;
      setStats((s) => ({
        ...s,
        accountBalance: s.accountBalance + earnedPnL - riskFine,
        dailyPnL: s.dailyPnL + earnedPnL - riskFine,
        realizedSpreadPnL: s.realizedSpreadPnL + earnedPnL,
        strikes: s.strikes + 1,
        ordersFilled: s.ordersFilled + 1,
      }));
    } else {
      setStats((s) => ({
        ...s,
        accountBalance: s.accountBalance + earnedPnL,
        dailyPnL: s.dailyPnL + earnedPnL,
        realizedSpreadPnL: s.realizedSpreadPnL + earnedPnL,
        ordersFilled: s.ordersFilled + 1,
      }));
    }

    setBook((b) => ({ ...b, inventory: newInventory }));
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Reject Toxic Order
  const handleRejectOrder = (orderId: string) => {
    sounds.playClick();
    setStats((s) => ({
      ...s,
      toxicHitsAvoided: s.toxicHitsAvoided + 1,
    }));
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Flatten Inventory at Market
  const handleFlattenInventory = () => {
    if (book.inventory === 0) return;
    sounds.playCashRegister();

    // Crossing the spread fee (~$0.15/share)
    const liquidationCost = Math.abs(book.inventory) * 15;
    setStats((s) => ({
      ...s,
      accountBalance: s.accountBalance - liquidationCost,
      dailyPnL: s.dailyPnL - liquidationCost,
    }));

    setBook((b) => ({ ...b, inventory: 0 }));
  };

  // Execute ETF Basket Arbitrage
  const handleExecuteArb = (
    type: 'SELL_ETF_BUY_BASKET' | 'BUY_ETF_SELL_BASKET',
    edgePerShare: number
  ) => {
    const profit = Math.round(edgePerShare * 5000); // 50 lots = 5,000 shares
    sounds.playCashRegister();

    setStats((s) => ({
      ...s,
      accountBalance: s.accountBalance + profit,
      dailyPnL: s.dailyPnL + profit,
      arbitragePnL: s.arbitragePnL + profit,
    }));

    // Reset NAV divergence back to parity
    setBook((b) => ({ ...b, syntheticBasketFair: b.fairValue }));
  };

  // Trade Macro Event
  const handleTradeMacro = (direction: 'BUY' | 'SELL') => {
    if (!currentMacroEvent || currentMacroEvent.isTraded) return;

    const isCorrect =
      (direction === 'BUY' && currentMacroEvent.surprise === 'BULLISH') ||
      (direction === 'SELL' && currentMacroEvent.surprise === 'BEARISH');

    if (isCorrect) {
      sounds.playCashRegister();
      const alphaGain = 3000;
      setStats((s) => ({
        ...s,
        accountBalance: s.accountBalance + alphaGain,
        dailyPnL: s.dailyPnL + alphaGain,
        macroAlphaPnL: s.macroAlphaPnL + alphaGain,
      }));

      // Reprice Fair value in direction of surprise
      const shift = direction === 'BUY' ? currentMacroEvent.magnitude : -currentMacroEvent.magnitude;
      setBook((b) => ({ ...b, fairValue: Number((b.fairValue + shift).toFixed(2)) }));
    } else {
      sounds.playStrikeError();
      const alphaLoss = 1500;
      setStats((s) => ({
        ...s,
        accountBalance: s.accountBalance - alphaLoss,
        dailyPnL: s.dailyPnL - alphaLoss,
        macroAlphaPnL: s.macroAlphaPnL - alphaLoss,
        strikes: s.strikes + 1,
      }));
    }

    setCurrentMacroEvent((prev) => (prev ? { ...prev, isTraded: true } : null));
  };

  // Mental Math Challenge Handler
  const handleMentalMathAnswer = (isCorrect: boolean, bonus: number) => {
    if (isCorrect) {
      setStats((s) => ({
        ...s,
        accountBalance: s.accountBalance + bonus,
        dailyPnL: s.dailyPnL + bonus,
      }));
    } else {
      setStats((s) => ({
        ...s,
        accountBalance: s.accountBalance - 500,
        dailyPnL: s.dailyPnL - 500,
      }));
    }
  };

  // Shift Close
  const handleShiftClose = () => {
    setIsPlaying(false);
    const passed = stats.dailyPnL >= currentChallenge.profitTarget && stats.strikes < 3;
    setIsDayPassed(passed);
    setIsDayResultsOpen(true);
    if (passed) sounds.playCashRegister();
    else sounds.playStrikeError();
  };

  // Keyboard Shortcuts (B: Buy, S: Sell)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'b' || e.key === 'B') {
        if (currentMacroEvent && !currentMacroEvent.isTraded) {
          handleTradeMacro('BUY');
        }
      } else if (e.key === 's' || e.key === 'S') {
        if (currentMacroEvent && !currentMacroEvent.isTraded) {
          handleTradeMacro('SELL');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMacroEvent]);

  // Format Desk Time
  const deskHours = Math.floor(deskTimeSeconds / 3600);
  const deskMins = Math.floor((deskTimeSeconds % 3600) / 60);
  const formattedDeskTime = `${String(deskHours).padStart(2, '0')}:${String(deskMins).padStart(2, '0')} EST`;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-neutral-900 font-sans selection:bg-[#4A8ECB] selection:text-white antialiased">
      {/* Top Header */}
      <Header
        stats={stats}
        stageNumber={stageNumber}
        stageTitle={currentChallenge.title}
        profitTarget={currentChallenge.profitTarget}
        maxDailyDrawdown={currentChallenge.maxDailyDrawdown}
        deskTime={formattedDeskTime}
        isMuted={isMuted}
        onToggleMute={() => {
          const next = !isMuted;
          setIsMuted(next);
          sounds.setMuted(next);
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenMentalMath={() => {
          const q = MENTAL_MATH_POOL[Math.floor(Math.random() * MENTAL_MATH_POOL.length)];
          setActiveMathQuestion(q);
          setIsMentalMathOpen(true);
        }}
      />

      {/* Main Floor Grid */}
      <main className="flex-1 p-3.5 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1920px] mx-auto w-full">
        {/* Left Column: Market Making Desk (7 cols) */}
        <section className="lg:col-span-7 h-auto min-h-[580px]">
          <MarketMakerDesk
            book={book}
            orders={orders}
            spreadSetting={spreadSetting}
            skewSetting={skewSetting}
            onChangeSpread={handleChangeSpread}
            onChangeSkew={handleChangeSkew}
            onFillOrder={handleFillOrder}
            onRejectOrder={handleRejectOrder}
            onFlattenInventory={handleFlattenInventory}
          />
        </section>

        {/* Right Column: Quantitative ETF Arbitrage & Macro Alpha (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex-1 min-h-[280px]">
            <ArbitrageDesk book={book} onExecuteArb={handleExecuteArb} />
          </div>

          <div className="flex-1 min-h-[260px]">
            <MacroAlphaPanel
              event={currentMacroEvent}
              onTradeMacro={handleTradeMacro}
            />
          </div>
        </section>
      </main>

      {/* Morning Briefing Modal */}
      {isMorningBriefingOpen && (
        <MorningBriefingModal
          challenge={currentChallenge}
          stageNumber={stageNumber}
          onStartTrading={() => {
            setIsMorningBriefingOpen(false);
            setIsPlaying(true);
          }}
        />
      )}

      {/* Day Results & Promotion Modal */}
      {isDayResultsOpen && (
        <DayResultsModal
          isPassed={isDayPassed}
          challenge={currentChallenge}
          stats={stats}
          stageNumber={stageNumber}
          onNextStage={() => {
            setStageNumber((prev) => (prev < 5 ? prev + 1 : 5));
          }}
          onRetryStage={() => {
            setupStage(stageNumber);
          }}
        />
      )}

      {/* Trading Guide / Manual */}
      <TradingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        myScore={Math.max(0, Math.round(stats.dailyPnL / 5 + stats.ordersFilled * 20))}
        myPnL={stats.dailyPnL}
      />

      {/* Mental Math EV Challenge Modal */}
      <MentalMathModal
        isOpen={isMentalMathOpen}
        onClose={() => setIsMentalMathOpen(false)}
        question={activeMathQuestion}
        onAnswer={handleMentalMathAnswer}
      />
    </div>
  );
}
