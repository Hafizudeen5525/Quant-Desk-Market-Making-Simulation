# Prop Desk

A browser-based market making and prop trading game inspired by The Crude Desk Game.

Instead of oil shipments and tankers, this focuses on how electronic market makers and prop trading desks actually make money: quoting two-sided prices, managing inventory risk, avoiding toxic flow, and reacting to market-moving news.

---

## What is this?

Most trading games let you buy low and sell high on a stock chart. That's not how market makers operate.

Market makers don't bet on whether the market goes up or down. They quote both a **Bid** (price to buy) and an **Ask** (price to sell) at the same time. If buyers and sellers trade against both sides, you pocket the spread.

The catch is risk. If everyone is selling to you, you end up holding a huge long position. If the price drops, your profits disappear fast. On top of that, some traders know things before you do—if an institutional buyer hits your ask, the market usually rallies right through you.

This simulator puts you on the desk across 5 stages, starting with simple spreads and working up to ETF basket arbitrage and fast economic releases.

---

## How It Works

### 1. Quoting Spreads
You continuously post prices around what you think fair value is:
- **Bid**: where you buy (fair value minus half the spread)
- **Ask**: where you sell (fair value plus half the spread)

A tighter spread gets you more trades. A wider spread gives you more profit per fill, but other market participants might ignore your price.

### 2. Managing Inventory (Skewing)
If your inventory starts piling up, you have to lean your quotes to balance out.

- **Sitting on a heavy long position?** Skew your quotes down. Lowering your ask attracts buyers, while lowering your bid discourages sellers.
- **Short too many contracts?** Skew your quotes up. A higher bid brings in sellers so you can buy your position back.

If you don't skew in time, market drift will trigger your stop loss.

### 3. Toxic Flow and Adverse Selection
Not all incoming trades are equal.
- **Retail orders** are usually random noise. They buy and sell without much directional edge.
- **Informed flow** comes from funds or algos with better information. When they hit your quotes, fair value usually moves hard against you immediately.

Watch for toxic flow warnings and reject incoming orders when something looks off.

### 4. ETF Arbitrage (Stage 3+)
An ETF is backed by a basket of underlying stocks. Usually their prices match, but sometimes they drift apart:
- **ETF trades higher than the basket NAV**: sell the ETF and buy the basket.
- **ETF trades lower than the basket NAV**: buy the ETF and short the basket.

You can lock in the difference through creation and redemption.

### 5. Macro Data Releases (Stage 4+)
Economic prints like CPI inflation, unemployment numbers, and interest rate decisions shake the market.

What matters isn't just the number—it's how far it lands from consensus expectations. If inflation comes in cooler than expected, tech equities usually rip upward. You have a few seconds to trade the surprise before the rest of the book catches up.

---

## Prop Firm Stages

To pass each stage, you need to hit a profit target without breaking your daily or maximum drawdown limits:

| Stage | Name | Starting Capital | Target | Max Loss | Max Inventory | Features |
|:---:|:---|:---:|:---:|:---:|:---:|:---|
| **1** | Market Making Basics | $100,000 | +$6,000 | -$4,000 | 50 contracts | Spread quoting and retail flow |
| **2** | Inventory & Toxic Flow | $250,000 | +$12,000 | -$8,000 | 60 contracts | Skewing quotes and dodging toxic orders |
| **3** | ETF Basket Arbitrage | $500,000 | +$20,000 | -$12,000 | 80 contracts | Mispricing between ETF and underlying NAV |
| **4** | Macroeconomic Alpha | $750,000 | +$30,000 | -$16,000 | 100 contracts | Trading CPI, FOMC, and NFP prints |
| **5** | Head of Desk | $1,000,000 | +$50,000 | -$25,000 | 120 contracts | Endless mode with all desks active |

Between trading days, you'll also run into quick mental math interview questions to sharpen your speed.

---

## Keyboard Controls

You can click the buttons on screen, or use the keyboard:

| Key | What it does |
|:---:|:---|
| `1` | Tight spread ($0.30) |
| `2` | Normal spread ($0.50) |
| `3` | Wide spread ($0.90) |
| `D` | Skew quotes down |
| `N` | Reset to neutral skew |
| `U` | Skew quotes up |
| `F` or `Space` | Flatten position immediately at market |
| `B` | Buy on positive macro surprise |
| `S` | Sell on negative macro surprise |

---

## Project Structure

```
prop-desk/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Account stats, day clock, daily P&L bar
│   │   ├── MarketMakerDesk.tsx     # Order book, tick chart, spread and skew controls
│   │   ├── ArbitrageDesk.tsx       # ETF vs basket NAV creation/redemption panel
│   │   ├── MacroAlphaPanel.tsx     # Economic calendar and surprise trade buttons
│   │   ├── MorningBriefingModal.tsx# Stage goals and rules before the day starts
│   │   ├── DayResultsModal.tsx     # Daily recap, stats breakdown, next stage
│   │   ├── MentalMathModal.tsx     # Fast math drills between shifts
│   │   ├── TradingGuideModal.tsx   # Detailed in-game manual and explanations
│   │   └── LeaderboardModal.tsx    # Saved personal high scores
│   ├── services/
│   │   ├── scenarioData.ts         # Stage settings and math questions
│   │   ├── newsData.ts             # Economic reports database
│   │   └── soundEffects.ts         # In-browser audio synthesis (no mp3 files needed)
│   ├── types/
│   │   └── desk.ts                 # TypeScript types
│   ├── App.tsx                     # Main game loop and keyboard listener
│   └── main.tsx                    # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Built with React 19, TypeScript, Tailwind CSS, and Vite. Sound effects use the browser's built-in Web Audio API, so there are no external audio assets to download.

---

## Running Locally

Make sure you have Node.js (v18+) installed.

1. Clone this repository:
   ```bash
   git clone https://github.com/Hafizudeen5525/Quant-Desk-Market-Making-Simulation.git
   cd prop-desk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`.

To build for production:
```bash
npm run build
```

---

## License

MIT
