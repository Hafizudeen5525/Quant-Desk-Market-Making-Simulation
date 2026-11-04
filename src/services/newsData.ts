import { MacroNewsEvent } from '../types/desk';

export const MACRO_EVENTS_DATABASE: Omit<MacroNewsEvent, 'id' | 'timeRemaining' | 'isTraded'>[] = [
  {
    title: 'US Consumer Price Index (CPI) YoY',
    category: 'CPI',
    consensus: '3.1%',
    actual: '2.6%',
    surprise: 'BULLISH',
    magnitude: 1.80,
    explanation: 'Massive cooler-than-expected inflation print seals aggressive Fed rate cuts. Rocket fuel for tech valuations: BUY!',
  },
  {
    title: 'FOMC Interest Rate Decision',
    category: 'FED_RATES',
    consensus: '25 bps Cut',
    actual: '50 bps Jumbo Cut',
    surprise: 'BULLISH',
    magnitude: 2.20,
    explanation: 'Federal Reserve delivers surprise 50 bps jumbo rate cut with dovish dot plot. High-multiple growth equities surge: BUY!',
  },
  {
    title: 'US Non-Farm Payrolls (Jobs Report)',
    category: 'NFP',
    consensus: '+180k jobs',
    actual: '+310k jobs (Wage growth +0.5%)',
    surprise: 'BEARISH',
    magnitude: -1.60,
    explanation: 'Overheating labor market and sticky wage inflation force Treasury yields higher. Rate cuts pushed back: SELL!',
  },
  {
    title: 'MegaCap Semiconductor Giant Earnings',
    category: 'EARNINGS',
    consensus: '$18.4B Rev / $0.85 EPS',
    actual: '$22.1B Rev / $1.05 EPS (+45% Guidance)',
    surprise: 'BULLISH',
    magnitude: 2.50,
    explanation: 'AI datacenter compute demand obliterates consensus expectations with raised full-year guidance. Strong bullish impulse: BUY!',
  },
  {
    title: 'Core PCE Price Index MoM',
    category: 'CPI',
    consensus: '+0.2%',
    actual: '+0.5%',
    surprise: 'BEARISH',
    magnitude: -1.40,
    explanation: 'Fed favorite inflation gauge comes in hot. Market reprices higher terminal Fed funds rate: SELL!',
  },
  {
    title: 'Treasury 10-Year Bond Auction',
    category: 'FED_RATES',
    consensus: 'Bid-to-Cover 2.5x',
    actual: 'Tail 2.1x (Weak Direct Demand)',
    surprise: 'BEARISH',
    magnitude: -1.10,
    explanation: 'Sloppy Treasury auction forces yields to spike across the curve, weighing on equity valuation multiples: SELL!',
  },
];

export function getRandomMacroEvent(): MacroNewsEvent {
  const item = MACRO_EVENTS_DATABASE[Math.floor(Math.random() * MACRO_EVENTS_DATABASE.length)];
  return {
    ...item,
    id: 'EV-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    timeRemaining: 6,
    isTraded: false,
  };
}
