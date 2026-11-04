export type AssetTicker = 'TECH.ETF' | 'SEMI.INDEX' | 'CRYPTO.ARB' | 'ENERGY.FUT';

export type OrderType = 'RETAIL_BUY' | 'RETAIL_SELL' | 'INSTITUTIONAL_SWEEP' | 'RFQ';

export type QuotingSpread = 'TIGHT' | 'MEDIUM' | 'WIDE';

export type InventorySkew = 'SKEW_DOWN' | 'NEUTRAL' | 'SKEW_UP';

export interface MarketOrder {
  id: string;
  ticker: AssetTicker;
  clientType: 'Retail Trader' | 'Informed Fund' | 'Algorithmic MM' | 'Pension Flow';
  direction: 'BUY' | 'SELL'; // client wants to BUY (hits our ASK) or SELL (hits our BID)
  volume: number; // e.g. 10 to 50 lots
  limitPrice?: number;
  timeRemaining: number;
  maxTime: number;
  isToxic: boolean; // informed flow that moves fair value
  status: 'PENDING' | 'FILLED' | 'REJECTED' | 'EXPIRED';
  fillPrice?: number;
  pnlEarned?: number;
}

export interface AssetBook {
  ticker: AssetTicker;
  name: string;
  fairValue: number;
  myBid: number;
  myAsk: number;
  spread: number;
  inventory: number; // positive = long, negative = short
  maxInventory: number;
  history: number[];
  syntheticBasketFair: number; // For ETF arbitrage
  change24h: number;
}

export interface MacroNewsEvent {
  id: string;
  title: string;
  category: 'CPI' | 'FED_RATES' | 'NFP' | 'EARNINGS';
  consensus: string;
  actual: string;
  surprise: 'BULLISH' | 'BEARISH' | 'IN_LINE';
  magnitude: number;
  timeRemaining: number;
  isTraded: boolean;
  explanation: string;
}

export interface PropFirmChallenge {
  stage: number;
  title: string;
  subtitle: string;
  startingCapital: number;
  profitTarget: number;
  maxDailyDrawdown: number;
  maxInventoryLimit: number;
  allowedStrikes: number;
  description: string[];
  learningGoal: string;
  asset: AssetTicker;
  unlockedFeatures: {
    etfArbitrage: boolean;
    macroAlpha: boolean;
    toxicFlowDetection: boolean;
    mentalMathBonus: boolean;
  };
}

export interface PropDeskStats {
  accountBalance: number;
  startingCapital: number;
  dailyPnL: number;
  realizedSpreadPnL: number;
  arbitragePnL: number;
  macroAlphaPnL: number;
  drawdown: number;
  maxDrawdownReached: number;
  strikes: number;
  ordersFilled: number;
  toxicHitsAvoided: number;
  toxicHitsSuffered: number;
  stars: number;
  levelPassed: boolean;
  isAccountBlown: boolean;
  blunderFeedback?: string;
}

export interface MentalMathQuestion {
  question: string;
  correctAnswer: number;
  options: number[];
  rewardBonus: number;
}
