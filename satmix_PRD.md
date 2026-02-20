# 📄 Product Requirements Document (PRD)
## Satmix — India's Crypto Exchange for the Next Billion

**Version:** 1.0 (Prototype / VC Deck Phase)  
**Date:** February 2026  
**Author:** Product Team, Satmix  
**Status:** Draft — Investor Prototype  

---

## 1. Executive Summary

Satmix is an India-first cryptocurrency exchange built for accessibility, trust, and growth. While incumbents like WazirX and CoinDCX captured India's first wave of crypto adoption, Satmix targets the next 100 million users — first-timers in Tier 2 and Tier 3 cities — with a clean UPI-first onboarding experience, vernacular language support, and a transparent, low-fee structure. This PRD covers the scope of the prototype to be built for investor demonstration.

---

## 2. Problem Statement

India has ~110 million crypto holders (2025) but meaningful participation is limited:

- **Friction at onboarding:** KYC processes are slow, confusing, and English-only.
- **No UPI-native experience:** Existing platforms bolt UPI on; Satmix builds around it.
- **No local trust signals:** Indian users distrust global crypto brands after FTX, WazirX hack (2024), etc.
- **No vernacular support:** 800M+ Indians are non-English dominant.
- **No education layer:** First-time investors have no guardrails or learning path.

---

## 3. Vision & Mission

**Vision:** Make crypto as easy to use as UPI for every Indian.  
**Mission:** Build the most trusted, accessible, and regulation-ready crypto platform for India.

---

## 4. Target Users

| Segment | Description | Size |
|---|---|---|
| **Primary** | 18–35 year old urban/semi-urban Indians, UPI-native, first-time crypto buyers | ~45M |
| **Secondary** | Experienced retail traders seeking INR-native P2P and low fees | ~15M |
| **Tertiary** | Indian diaspora seeking INR-pegged crypto on/off ramps | ~5M |

---

## 5. Core Value Propositions

1. **INR-First, UPI-Native** — Buy crypto directly with UPI in under 60 seconds.
2. **Lightning KYC** — Aadhaar + PAN based KYC, completed in < 3 minutes.
3. **Lowest Fee Promise** — 0.1% trading fee, 0% deposit fee.
4. **Regulated & Transparent** — PMLA-compliant, 1:1 asset reserves published monthly.
5. **Learn & Earn** — Integrated crypto education with reward tokens.
6. **Vernacular UI** — Hindi, Tamil, Telugu, Bengali, Kannada support at launch.

---

## 6. Feature Scope (Prototype v1.0)

### 6.1 Public / Marketing Pages
| Feature | Priority | Notes |
|---|---|---|
| Landing Page (Hero, Features, Social Proof, CTA) | P0 | VC demo focus |
| Pricing / Fees Page | P0 | Competitive comparison |
| About / Team Page | P1 | Trust building |
| Blog / Learn Hub (Static) | P1 | 5 seed articles |

### 6.2 Authentication & KYC
| Feature | Priority | Notes |
|---|---|---|
| Phone OTP Sign-up | P0 | Indian number only for prototype |
| Email + Password Login | P0 | — |
| Aadhaar-based eKYC (DigiLocker integration) | P0 | Simulated in prototype |
| PAN Verification | P0 | Simulated in prototype |
| KYC Status Dashboard | P1 | Pending / Verified / Rejected |

### 6.3 Wallet & Deposits
| Feature | Priority | Notes |
|---|---|---|
| INR Wallet (virtual) | P0 | UPI deposit simulated |
| UPI Deposit Flow | P0 | Static UPI QR in prototype |
| Bank Account Withdrawal (IMPS/NEFT) | P1 | — |
| Crypto Wallet (BTC, ETH, USDT, SOL) | P0 | Simulated balances |
| Deposit / Withdrawal History | P1 | — |

### 6.4 Exchange / Trading
| Feature | Priority | Notes |
|---|---|---|
| Spot Market — Buy/Sell (Market Order) | P0 | Simulated price feed |
| Spot Market — Limit Order | P1 | — |
| Live Price Ticker (Top 20 coins) | P0 | CoinGecko API or mock data |
| Coin Detail Page (Chart + Stats) | P0 | TradingView widget |
| Order History & Open Orders | P1 | — |
| Portfolio Overview Dashboard | P0 | P&L, allocation pie chart |

### 6.5 P2P Trading
| Feature | Priority | Notes |
|---|---|---|
| P2P Listings (Buy/Sell USDT ↔ INR) | P0 | Static mock listings for demo |
| Advertiser Profiles | P1 | — |
| Escrow System (Simulated) | P0 | Trust mechanism shown in flow |
| Dispute Resolution Flow (Simulated) | P1 | — |

### 6.6 Referral & Rewards
| Feature | Priority | Notes |
|---|---|---|
| Referral Link Generation | P0 | Unique code per user |
| Referral Dashboard (earnings, count) | P0 | — |
| Satmix Reward Points ("SAT Points") | P1 | Earnable via trades, referrals |
| Redeem Points for Fee Discounts | P1 | — |

### 6.7 Learn & Earn (Education Hub)
| Feature | Priority | Notes |
|---|---|---|
| Beginner Crypto Courses (5 modules) | P1 | Static content for prototype |
| Quiz-based Reward Distribution | P1 | Simulated token payout |
| "Crypto Kya Hai" Hindi explainer | P0 | Key trust differentiator |

### 6.8 Admin & Operations (Out of Prototype Scope)
- Liquidity Engine Integration (market maker)
- PMLA Transaction Monitoring
- Customer Support Ticketing System
- Cold/Hot Wallet Infrastructure

---

## 7. User Flows

### 7.1 First-Time User Onboarding
```
Landing Page → Sign Up (Phone OTP) → Email Verification
→ KYC (Aadhaar + PAN) → INR Deposit (UPI) → First Buy (Bitcoin)
→ Portfolio Dashboard
```

### 7.2 Returning Trader — Spot Buy
```
Login → Dashboard → Markets → Select Coin
→ Enter Amount (INR) → Review Order → Confirm → Portfolio Updated
```

### 7.3 P2P Trade Flow
```
P2P Tab → Browse Listings → Select Seller
→ Enter Amount → Escrow Lock → UPI Transfer → Confirm Payment
→ Crypto Released → Trade Closed
```

### 7.4 Referral Flow
```
Dashboard → Referral Section → Copy Link / Share WhatsApp
→ Friend Signs Up + KYC → Both receive SAT Points
→ Referrer earns 20% of friend's first 3 months trading fees
```

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Page load < 2s (LCP), API response < 300ms |
| **Availability** | 99.9% uptime SLA |
| **Security** | 2FA mandatory for withdrawals, AES-256 at rest, TLS 1.3 in transit |
| **Compliance** | PMLA reporting, 1% TDS deduction at source (as per Indian IT Act 2022), VDA reporting |
| **Scalability** | Designed for 500K concurrent users from day 1 |
| **Mobile** | PWA + React Native app (Phase 2), fully responsive web |
| **Accessibility** | WCAG 2.1 AA — screen reader friendly |

---

## 9. Regulatory & Compliance Notes

India's crypto regulatory landscape as of 2025:

- **1% TDS** on crypto transactions > ₹50,000/year (Section 194S, IT Act) — Satmix deducts at source.
- **30% flat tax** on crypto gains — Satmix provides gain/loss reports for ITR filing.
- **PMLA** (Prevention of Money Laundering Act) — Full AML/KYC compliance with FIU-IND registration.
- **RBI UPI Guidelines** — All INR transactions via NPCI-approved UPI PSPs.
- **No crypto is legal tender** — Satmix clearly communicates this across all touchpoints.

---

## 10. Technology Stack (Recommended)

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS |
| **Backend** | Node.js (NestJS), Go (matching engine) |
| **Database** | PostgreSQL (user data), Redis (order book/cache) |
| **Blockchain** | Web3.js / Ethers.js, multi-chain node infrastructure |
| **Payments** | Razorpay / PayU for UPI integration |
| **KYC** | DigiLocker API, NSDL PAN verification |
| **Price Feed** | CoinGecko API (public), Chainlink oracles (Phase 2) |
| **Charts** | TradingView Lightweight Charts |
| **Hosting** | AWS Mumbai (ap-south-1) for data sovereignty |
| **CDN** | Cloudflare India PoPs |

---

## 11. Monetisation Model

| Revenue Stream | Details |
|---|---|
| **Trading Fees** | 0.1% maker / 0.15% taker on spot |
| **P2P Service Fee** | 0.5% per P2P trade |
| **Withdrawal Fees** | ₹10 per INR NEFT withdrawal |
| **Staking (Phase 2)** | 15–20% APY products, Satmix keeps 2–3% spread |
| **Premium Accounts** | ₹499/month — 0% trading fee + advanced charts + tax report |
| **Crypto Cards (Phase 3)** | Co-branded Visa/RuPay crypto debit card |

**Projected Revenue (Year 1):** ₹12–18 Cr (based on 50K MAU, avg. 2 trades/week)

---

## 12. Go-To-Market Strategy

**Phase 1 — Launch (Months 1–6):**
- Invite-only beta for 10,000 users via influencer waitlist
- YouTube + Instagram campaigns in Hindi
- Partnership with 5 college crypto clubs (IIT, NIT network)
- Target: 25,000 KYC-verified users

**Phase 2 — Growth (Months 7–18):**
- WhatsApp referral virality engine
- Regional language content marketing
- PR: Position as "India's safest exchange" post-WazirX narrative
- Target: 250,000 KYC-verified users

**Phase 3 — Scale (Months 19–36):**
- Mobile app launch (Android priority — 95% of Indian internet)
- Tier 2/3 city offline events (crypto melas)
- API access for institutional traders
- Target: 1M+ registered users

---

## 13. Competitive Landscape

| Feature | Satmix | WazirX | CoinDCX | Binance IN |
|---|---|---|---|---|
| UPI-native buy flow | ✅ | ⚠️ | ⚠️ | ❌ |
| Vernacular language | ✅ | ❌ | ❌ | ❌ |
| < 3 min KYC | ✅ | ⚠️ | ⚠️ | ⚠️ |
| P2P Trading | ✅ | ✅ | ❌ | ✅ |
| Learn & Earn | ✅ | ❌ | ✅ | ✅ |
| India data residency | ✅ | ❌ | ✅ | ❌ |
| Proof of Reserves | ✅ | ❌ | ❌ | ✅ |
| Trading fee | 0.1% | 0.2% | 0.1% | 0.1% |

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Regulatory ban / RBI restrictions | Medium | High | PMLA-compliant from day 1, legal advisory board |
| Exchange hack / security breach | Low | Critical | Cold wallet architecture, bug bounty program |
| UPI payment partner drops crypto | Medium | High | Multi-PSP strategy (Razorpay + PayU + Cashfree) |
| Low liquidity at launch | High | Medium | Market maker agreements pre-launch |
| WazirX user trust crisis spillover | Low | Medium | "Proof of Reserves" as core marketing |

---

## 15. Success Metrics (KPIs)

| Metric | 6-Month Target | 12-Month Target |
|---|---|---|
| Registered Users | 50,000 | 250,000 |
| KYC Verified Users | 25,000 | 150,000 |
| Monthly Trading Volume | ₹50 Cr | ₹300 Cr |
| MAU | 15,000 | 100,000 |
| Avg. Revenue Per User (ARPU) | ₹180/month | ₹200/month |
| NPS Score | > 40 | > 55 |
| App Store Rating | — | > 4.3 |

---

## 16. Prototype Scope Summary (VC Demo)

The investor prototype will demonstrate:

1. **Landing page** — Full marketing page with live coin ticker
2. **Sign-up + KYC flow** — Simulated 3-step onboarding
3. **INR Deposit via UPI** — Mock QR + confirmation flow
4. **Buy Bitcoin** — Market order flow, portfolio update
5. **P2P listing page** — Static mock listings with trade initiation
6. **Portfolio Dashboard** — P&L chart, holdings breakdown
7. **Referral Page** — Link generation + reward tracker
8. **Learn Hub** — 2 course modules (Hindi + English)

**Prototype Stack:** Next.js + TailwindCSS + Mock API (JSON Server)  
**Timeline:** 6 weeks to demo-ready prototype  
**Team Required:** 2 Frontend, 1 Backend, 1 UI/UX, 1 PM  

---

## 17. Appendix

### A. Glossary
- **VDA:** Virtual Digital Asset (India's legal term for crypto)
- **P2P:** Peer-to-Peer trading
- **eKYC:** Electronic Know Your Customer
- **SAT Points:** Satmix reward token (off-chain points system)
- **TDS:** Tax Deducted at Source

### B. References
- CBDT Circular on VDA Taxation (2022)
- FIU-IND PMLA Registration Guidelines
- NPCI UPI Circular 2024
- WazirX Security Incident Report (2024)

---

*This document is confidential and intended for investor evaluation only.*  
*© 2026 Satmix Technologies Pvt. Ltd. All rights reserved.*
