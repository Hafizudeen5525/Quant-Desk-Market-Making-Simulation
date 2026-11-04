# Prop Desk · Quantitative Market Making & Trading Simulator

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Prop Desk** is a quantitative proprietary trading desk and market making simulator. Built with a high-contrast brutalist terminal aesthetic inspired by modern trading interfaces, it replicates the high-stakes decision-making, mental math, and risk discipline tested at firms such as **Jane Street, Optiver, Citadel Securities, and IMC**.

---

## ⚡ Overview & Core Gameplay Loop

Aspiring quantitative traders take the seat of a market maker managing a proprietary capital allocation across 5 escalating challenge stages. Your mandate is to capture spread edge and exploit statistical mispricings while obeying strict prop firm risk constraints:

1. **Two-Sided Market Making**: Continuously quote competitive `BID` and `ASK` prices around changing estimated Fair Value $E[V]$.
2. **Inventory Skewing**: Dynamically bias your quotes to offload toxic inventory before market drift destroys your P&L.
3. **Toxic Flow Defense**: Identify informed institutional sweeps vs uninformed retail flow to prevent severe adverse selection.
4. **ETF Creation/Redemption Arbitrage**: Exploit statistical deviations between an ETF's market price and its synthetic basket Net Asset Value (NAV).
5. **Macroeconomic Latency Alpha**: Rapidly interpret economic data releases (CPI, FOMC rate cuts, Non-Farm Payrolls) and trade the surprise factor before algorithms reprice the order book.
6. **Prop Firm Risk Constraints**: Maintain capital above the **Maximum Daily Drawdown limit**, stay within position inventory limits, and avoid strikes from the risk manager.

---

## 🧠 Quantitative Finance & Market Microstructure Concepts

### 1. Market Making & Expected Value $E[V]$
Market makers do not speculate on directional trends; they provide two-sided liquidity.
- **Fair Value $E[V]$**: The consensus expected value of the asset based on the order book and external signals.
- **My Bid (Buy)**: Quoted strictly *below* Fair Value:
  $$\text{Bid} = E[V] - \frac{\text{Spread}}{2} + \delta_{\text{skew}}$$
- **My Ask (Sell)**: Quoted strictly *above* Fair Value:
  $$\text{Ask} = E[V] + \frac{\text{Spread}}{2} + \delta_{\text{skew}}$$
When uninformed retail order flow hits your Ask (they buy from you) or your Bid (they sell to you), you capture the spread edge.

### 2. Inventory Risk & Quote Skewing (Avellaneda-Stoikov Model)
Holding non-zero inventory exposes the desk to directional market volatility:
$$\Delta \Pi = q \cdot \Delta S$$
Where $q$ is inventory volume and $\Delta S$ is the price shift.
- **Long Inventory ($q > 0$)**: If you hold +30 contracts and the market falls $\$1.00$, you lose $\$3,000$. You must **`SKEW DOWN`** (lower both Bid and Ask). This discourages more sellers from hitting your Bid, while making your Ask highly attractive to buyers, offloading inventory back toward flat.
- **Short Inventory ($q < 0$)**: You must **`SKEW UP`** (raise both Bid and Ask). Your higher Bid attracts sellers, allowing you to buy back contracts and cover short exposure.

### 3. Adverse Selection & Toxic Flow (Glosten-Milgrom Model)
Order flow is not homogeneous. Institutional funds and algorithmic traders possess latency or informational advantages:
- Filling an **Informed / Toxic Order** triggers immediate adverse selection: the Fair Value jumps sharply against your fill, creating an instant mark-to-market loss.
- Traders must detect toxic flow warnings and actively **`REJECT FLOW`** or widen their quoted spread.

### 4. ETF Basket Creation & Redemption Arbitrage
Authorized Participants (APs) keep ETF prices anchored to the Net Asset Value (NAV) of their underlying securities:
- **ETF Premium ($P_{\text{ETF}} > \text{NAV}_{\text{Basket}}$)**: Sell the overpriced ETF in the market and buy the underlying basket of stocks. Deliver the basket to the ETF issuer to create new shares, capturing the spread.
- **ETF Discount ($P_{\text{ETF}} < \text{NAV}_{\text{Basket}}$)**: Buy the underpriced ETF in the market and short the basket. Redeem the ETF shares for the underlying basket, locking in risk-free profit.

### 5. Macroeconomic Surprise Factor $\Delta$
Markets do not trade on the absolute economic print; they reprice based on the surprise relative to Wall Street consensus:
$$\text{Surprise Delta} = \text{Actual} - \text{Consensus}$$
- **Example**: US CPI prints **2.6%** vs **3.1% consensus** $\rightarrow$ lower inflation signals dovish Federal Reserve rate cuts $\rightarrow$ immediate bullish catalyst for tech equities.
- Traders have a 4-second latency window before automated liquidity algorithms reprice the order book.

---

## 🏆 Prop Firm Challenge Progression

| Stage | Title | Capital | Profit Target | Max Drawdown | Max Inventory | Key Mechanics |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | **Market Making 101** | $100,000 | +$6,000 | -$4,000 | $\pm$50 lots | Capturing spread edge, retail order fills |
| **2** | **Inventory Skew & Toxic Flow** | $250,000 | +$12,000 | -$8,000 | $\pm$60 lots | Quote skewing, detecting and rejecting toxic flow |
| **3** | **ETF Basket Arbitrage** | $500,000 | +$20,000 | -$12,000 | $\pm$80 lots | Creation/redemption arb between ETF and basket NAV |
| **4** | **Macro Alpha & Fast Latency** | $750,000 | +$30,000 | -$16,000 | $\pm$100 lots | Real-time CPI, FOMC, and NFP surprise trading |
| **5** | **Head of Quant Trading (Endless)** | $1,000,000 | +$50,000 | -$25,000 | $\pm$120 lots | Full desk scale with all active market catalysts |

---

## ⌨️ Trading Floor Keyboard Hotkeys

| Key | Action | Description |
| :---: | :--- | :--- |
| **`1`** | **Tight Spread** | Quote tight spread ($0.30) to maximize order flow volume |
| **`2`** | **Medium Spread** | Quote balanced spread ($0.50) for standard market conditions |
| **`3`** | **Wide Spread** | Quote defensive wide spread ($0.90) to protect against volatility |
| **`D`** | **Skew Down** | Lower quotes by $0.20 to offload long inventory to buyers |
| **`N`** | **Neutral Skew** | Center quotes symmetrically around estimated Fair Value |
| **`U`** | **Skew Up** | Raise quotes by $0.20 to attract sellers and cover short inventory |
| **`F`** or **`Space`** | **Flatten Position** | Liquidate current inventory at market |
| **`B`** | **Buy Macro Alpha** | Execute instant long trade on bullish economic surprises |
| **`S`** | **Sell Macro Alpha** | Execute instant short trade on bearish economic surprises |

---

## 🛠️ Architecture & Tech Stack

```
prop-desk/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Account balance, daily P&L, drawdown bar, clock
│   │   ├── MarketMakerDesk.tsx     # Two-sided quoting, tick chart, inventory meter, order stream
│   │   ├── ArbitrageDesk.tsx       # Live ETF vs Basket NAV discrepancy & creation/redemption
│   │   ├── MacroAlphaPanel.tsx     # Economic print surprise deltas & latency trading
│   │   ├── MorningBriefingModal.tsx# Stage objectives, risk parameters, and learning goals
│   │   ├── DayResultsModal.tsx     # Shift performance review, P&L attribution, promotion
│   │   ├── MentalMathModal.tsx     # 10-second quant interview math & probability EV rounds
│   │   ├── TradingGuideModal.tsx   # Comprehensive field manual with formulas and rules
│   │   └── LeaderboardModal.tsx    # Persistent career records & global desk benchmarks
│   ├── services/
│   │   ├── scenarioData.ts         # Stage configurations, asset books, and mental math pool
│   │   ├── newsData.ts             # Macro economic release database & surprise generator
│   │   └── soundEffects.ts         # Procedural Web Audio API sound synthesizer
│   ├── types/
│   │   └── desk.ts                 # TypeScript interfaces for market making & prop challenges
│   ├── App.tsx                     # Core simulation engine, tick loop, and hotkey listeners
│   └── main.tsx                    # React 19 entry point
├── index.html                      # HTML5 entry with metadata
├── package.json                    # Project scripts and dependencies
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build configuration
```

### Key Technologies
- **React 19**: Modern functional architecture, hooks, and responsive rendering.
- **TypeScript 5.x**: Full type safety across market books, order queues, and risk matrix calculations.
- **Tailwind CSS v4**: Utility-first styling implementing a Swiss-modern brutalist financial interface.
- **Procedural Web Audio API**: Custom procedural audio synthesizer generating tactile acoustic feedback (terminal clicks, trade fills, alert alarms, cash settlements) without external audio assets.
- **Vite 8**: High-performance local bundling and instant hot module reloading.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm`, `yarn`, or `pnpm`

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/prop-desk.git
   cd prop-desk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build & Typecheck
- **Validate TypeScript**:
  ```bash
  npm run lint
  ```
- **Build optimized bundle**:
  ```bash
  npm run build
  ```
- **Preview production build**:
  ```bash
  npm run preview
  ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
