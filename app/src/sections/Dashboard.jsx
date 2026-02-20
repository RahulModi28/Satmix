import { useState, useMemo } from 'react'
import { Hexagon, Bell, ChevronDown, Plus, ArrowUpRight, ArrowDownLeft, LayoutDashboard, TrendingUp, ArrowLeftRight, Briefcase, Wallet, ClipboardList, GraduationCap, Users, Settings } from 'lucide-react'
import { useLivePrices } from '../context/CryptoPricesContext'
import './Dashboard.css'

// ─── Mock User Data ─────────────────────────────────────────
const user = {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 98765 43210",
    kycStatus: "verified",
    memberSince: "January 2025",
    inrBalance: 12450.00,
    portfolio: [
        { coin: "BTC", name: "Bitcoin", qty: 0.00842, avgBuy: 6820000 },
        { coin: "ETH", name: "Ethereum", qty: 0.4521, avgBuy: 245000 },
        { coin: "SOL", name: "Solana", qty: 3.21, avgBuy: 14200 },
        { coin: "USDT", name: "Tether", qty: 1250, avgBuy: 84.0 },
    ],
    recentTrades: [
        { type: "BUY", coin: "BTC", qty: 0.001, price: 7320000, time: "Today 10:24 AM" },
        { type: "SELL", coin: "ETH", qty: 0.1, price: 271000, time: "Yesterday 3:12 PM" },
        { type: "BUY", coin: "SOL", qty: 1, price: 15800, time: "Feb 18, 9:00 AM" },
        { type: "BUY", coin: "USDT", qty: 500, price: 84.2, time: "Feb 17, 6:45 PM" },
        { type: "SELL", coin: "BTC", qty: 0.0005, price: 7410000, time: "Feb 16, 2:30 PM" },
    ]
}

// Coin colors for donut chart
const COIN_COLORS = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    SOL: '#9945FF',
    USDT: '#26A17B',
}

const COIN_ICONS = {
    BTC: '₿', ETH: 'Ξ', SOL: '◎', USDT: '₮',
    BNB: '◆', XRP: '✕', DOGE: 'Ð', ADA: '◇',
}

// Sidebar navigation
const SIDEBAR_NAV = [
    { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
    { id: 'markets', icon: <TrendingUp size={18} />, label: 'Markets' },
    { id: 'p2p', icon: <ArrowLeftRight size={18} />, label: 'P2P Trading' },
    { id: 'portfolio', icon: <Briefcase size={18} />, label: 'Portfolio' },
    { id: 'wallet', icon: <Wallet size={18} />, label: 'Wallet' },
    { id: 'orders', icon: <ClipboardList size={18} />, label: 'Orders' },
    { id: 'learn', icon: <GraduationCap size={18} />, label: 'Learn & Earn' },
    { id: 'refer', icon: <Users size={18} />, label: 'Refer & Earn' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
]

// Market table coins (as in landing page)
const MARKET_COINS = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
    { symbol: 'SOL', name: 'Solana', icon: '◎', color: '#00FFA3' },
    { symbol: 'BNB', name: 'BNB', icon: '◆', color: '#F3BA2F' },
    { symbol: 'XRP', name: 'XRP', icon: '✕', color: '#00AAE4' },
    { symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð', color: '#C2A633' },
    { symbol: 'ADA', name: 'Cardano', icon: '◇', color: '#0033AD' },
]

// ─── Utilities ──────────────────────────────────────────────

function formatINR(num) {
    if (num == null) return '—'
    if (num >= 100) {
        return '₹' + Math.round(num).toLocaleString('en-IN')
    }
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatChange(change) {
    if (change == null) return { text: '—', up: true }
    const abs = Math.abs(change).toFixed(2)
    if (change >= 0) return { text: `+${abs}%`, up: true }
    return { text: `-${abs}%`, up: false }
}

function getLivePrice(prices, symbol) {
    // USDT is a stablecoin not tracked by our server - use fallback
    if (symbol === 'USDT') return 84.0
    const live = prices.get(symbol)
    return live ? live.price_inr : null
}

// ─── SVG Donut Chart ────────────────────────────────────────

function DonutChart({ segments, total }) {
    const size = 200
    const strokeWidth = 32
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const cx = size / 2
    const cy = size / 2

    let cumulativeOffset = 0

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="dash__donut-svg">
            {segments.map((seg, i) => {
                const pct = seg.value / total
                const dashLength = pct * circumference
                const dashGap = circumference - dashLength
                const rotation = (cumulativeOffset / total) * 360 - 90
                cumulativeOffset += seg.value

                return (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${dashLength} ${dashGap}`}
                        transform={`rotate(${rotation} ${cx} ${cy})`}
                        className="dash__donut-segment"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                )
            })}
            {/* Center text */}
            <text x={cx} y={cy - 8} textAnchor="middle" className="dash__donut-label">
                Portfolio
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="dash__donut-value">
                {formatINR(total)}
            </text>
        </svg>
    )
}

// ─── Sparkline SVG ──────────────────────────────────────────

function Sparkline() {
    return (
        <svg viewBox="0 0 80 24" className="dash__sparkline">
            <polyline
                fill="none"
                stroke="var(--color-accent-green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,20 16,16 28,18 40,10 52,12 64,6 80,2"
            />
        </svg>
    )
}

// ─── Main Dashboard Component ───────────────────────────────

export default function Dashboard({ onBackToLanding, onTrade }) {
    const { prices, isConnected } = useLivePrices()
    const [activeSection, setActiveSection] = useState('overview')

    // ─── Portfolio Calculations ───────────────────────────────
    const portfolioData = useMemo(() => {
        const holdings = user.portfolio.map(h => {
            const livePrice = getLivePrice(prices, h.coin)
            const currentValue = livePrice ? h.qty * livePrice : null
            const investedValue = h.qty * h.avgBuy
            const pnl = currentValue != null ? currentValue - investedValue : null
            const pnlPct = investedValue > 0 && pnl != null ? (pnl / investedValue) * 100 : null

            return {
                ...h,
                livePrice,
                currentValue,
                investedValue,
                pnl,
                pnlPct,
                color: COIN_COLORS[h.coin] || '#888',
            }
        })

        const cryptoTotal = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0)
        const totalValue = cryptoTotal + user.inrBalance

        return { holdings, cryptoTotal, totalValue }
    }, [prices])

    // Donut chart segments
    const donutSegments = portfolioData.holdings
        .filter(h => h.currentValue != null && h.currentValue > 0)
        .map(h => ({ color: h.color, value: h.currentValue, label: h.coin }))

    // Page titles
    const PAGE_TITLES = {
        overview: 'Overview',
        markets: 'Markets',
        p2p: 'P2P Trading',
        portfolio: 'Portfolio',
        wallet: 'Wallet',
        orders: 'Orders',
        learn: 'Learn & Earn',
        refer: 'Refer & Earn',
        settings: 'Settings',
    }

    return (
        <div className="dash">
            {/* ═══ LEFT SIDEBAR ═══ */}
            <aside className="dash__sidebar">
                {/* Logo */}
                <a href="#" className="dash__sidebar-logo" onClick={(e) => { e.preventDefault(); onBackToLanding?.() }}>
                    <span className="dash__sidebar-logo-icon"><Hexagon size={20} /></span>
                    <span className="dash__sidebar-logo-text">Sat<span className="gradient-text">mix</span></span>
                </a>

                {/* User info */}
                <div className="dash__user-info">
                    <div className="dash__avatar">RS</div>
                    <div className="dash__user-name">Rahul Sharma</div>
                    <span className="dash__kyc-badge">✓ KYC Verified</span>
                </div>

                <div className="dash__sidebar-divider" />

                {/* Nav items */}
                <nav className="dash__sidebar-nav">
                    {SIDEBAR_NAV.map(item => (
                        <button
                            key={item.id}
                            className={`dash__nav-item ${activeSection === item.id ? 'dash__nav-item--active' : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <span className="dash__nav-icon">{item.icon}</span>
                            <span className="dash__nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* INR Balance card */}
                <div className="dash__balance-card">
                    <div className="dash__balance-label">INR Balance</div>
                    <div className="dash__balance-value">{formatINR(user.inrBalance)}</div>
                    <div className="dash__balance-actions">
                        <button className="btn btn-primary dash__balance-btn">
                            <Plus size={14} /> Deposit
                        </button>
                        <button className="btn btn-secondary dash__balance-btn">
                            Withdraw
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══ MAIN AREA ═══ */}
            <div className="dash__main">
                {/* ─── Top Nav Bar ─── */}
                <header className="dash__topbar">
                    <h1 className="dash__topbar-title">{PAGE_TITLES[activeSection]}</h1>
                    <div className="dash__topbar-right">
                        {/* WebSocket status */}
                        <div className={`dash__ws-status ${isConnected ? 'dash__ws-status--live' : 'dash__ws-status--off'}`}>
                            <span className="dash__ws-dot" />
                            <span>{isConnected ? 'Live' : 'Reconnecting...'}</span>
                        </div>

                        {/* Notification bell */}
                        <button className="dash__bell-btn" aria-label="Notifications">
                            <Bell size={20} />
                            <span className="dash__bell-badge" />
                        </button>

                        <div className="dash__topbar-divider" />

                        {/* User dropdown */}
                        <button className="dash__user-dropdown">
                            <div className="dash__avatar dash__avatar--sm">RS</div>
                            <span className="dash__user-dropdown-name">Rahul Sharma</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </header>

                {/* ─── Content ─── */}
                <div className="dash__content">
                    {activeSection === 'overview' && (
                        <>
                            {/* ROW 1 — Portfolio Summary Cards */}
                            <div className="dash__cards-row">
                                {/* Card 1 — Total Portfolio Value */}
                                <div className="dash__summary-card card">
                                    <div className="dash__card-label">Total Portfolio Value</div>
                                    <div className="dash__card-value">{formatINR(portfolioData.totalValue)}</div>
                                    <div className="dash__card-sub dash__card-sub--green">↑ +₹8,240 today</div>
                                </div>

                                {/* Card 2 — INR Balance */}
                                <div className="dash__summary-card card">
                                    <div className="dash__card-label">Available INR</div>
                                    <div className="dash__card-value">{formatINR(user.inrBalance)}</div>
                                    <div className="dash__card-sub">Ready to invest</div>
                                    <button className="btn btn-primary dash__card-btn">
                                        <Plus size={14} /> Add Funds
                                    </button>
                                </div>

                                {/* Card 3 — Today's P&L */}
                                <div className="dash__summary-card card">
                                    <div className="dash__card-label">Today's P&L</div>
                                    <div className="dash__card-value dash__card-value--green">+₹2,840.50</div>
                                    <div className="dash__card-sub dash__card-sub--green">+2.34% from yesterday</div>
                                    <Sparkline />
                                </div>

                                {/* Card 4 — Total Invested */}
                                <div className="dash__summary-card card">
                                    <div className="dash__card-label">Total Invested</div>
                                    <div className="dash__card-value">₹4,82,300</div>
                                    <div className="dash__card-sub">Across 4 assets</div>
                                </div>
                            </div>

                            {/* ROW 2 — Holdings + Recent Activity */}
                            <div className="dash__row2">
                                {/* Left — Donut Chart + Holdings */}
                                <div className="dash__holdings card">
                                    <h3 className="dash__section-title">My Holdings</h3>
                                    <div className="dash__donut-wrapper">
                                        {portfolioData.cryptoTotal > 0 && (
                                            <DonutChart segments={donutSegments} total={portfolioData.cryptoTotal} />
                                        )}
                                    </div>
                                    <div className="dash__holdings-list">
                                        {portfolioData.holdings.map(h => (
                                            <div key={h.coin} className="dash__holding-row">
                                                <div className="dash__holding-dot" style={{ background: h.color }} />
                                                <div className="dash__holding-info">
                                                    <div className="dash__holding-name">
                                                        <span className="dash__holding-icon" style={{ color: h.color }}>{COIN_ICONS[h.coin]}</span>
                                                        {h.name}
                                                        <span className="dash__holding-symbol">{h.coin}</span>
                                                    </div>
                                                    <div className="dash__holding-meta">
                                                        {h.qty} {h.coin} • Price: {h.livePrice ? formatINR(h.livePrice) : '—'}
                                                    </div>
                                                </div>
                                                <div className="dash__holding-values">
                                                    <div className="dash__holding-val">{h.currentValue != null ? formatINR(h.currentValue) : '—'}</div>
                                                    <div className={`dash__holding-pnl ${h.pnl != null && h.pnl >= 0 ? 'dash__pnl--up' : 'dash__pnl--down'}`}>
                                                        {h.pnl != null ? `${h.pnl >= 0 ? '+' : ''}${formatINR(Math.abs(h.pnl))} (${h.pnlPct >= 0 ? '+' : ''}${h.pnlPct.toFixed(1)}%)` : '—'}
                                                    </div>
                                                    <div className="dash__holding-pct">
                                                        {h.currentValue != null && portfolioData.cryptoTotal > 0
                                                            ? `${((h.currentValue / portfolioData.cryptoTotal) * 100).toFixed(1)}% of portfolio`
                                                            : ''
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right — Recent Activity */}
                                <div className="dash__activity card">
                                    <h3 className="dash__section-title">Recent Activity</h3>
                                    <div className="dash__trades-list">
                                        {user.recentTrades.map((trade, i) => (
                                            <div key={i} className="dash__trade-row">
                                                <div className="dash__trade-left">
                                                    <span className={`dash__trade-badge ${trade.type === 'BUY' ? 'dash__trade-badge--buy' : 'dash__trade-badge--sell'}`}>
                                                        {trade.type === 'BUY' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                                        {trade.type}
                                                    </span>
                                                    <div className="dash__trade-info">
                                                        <div className="dash__trade-coin">
                                                            <span style={{ color: COIN_COLORS[trade.coin] || '#888' }}>{COIN_ICONS[trade.coin]}</span>
                                                            {' '}{trade.coin}
                                                        </div>
                                                        <div className="dash__trade-detail">
                                                            {trade.qty} × {formatINR(trade.price)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dash__trade-time">{trade.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <a href="#" className="dash__view-all" onClick={(e) => { e.preventDefault(); setActiveSection('orders') }}>
                                        View All Orders →
                                    </a>
                                </div>
                            </div>

                            {/* ROW 3 — Market Overview */}
                            <div className="dash__market card">
                                <div className="dash__market-header">
                                    <h3 className="dash__section-title">Market Overview</h3>
                                    <span className="dash__market-sub">Live prices • Updated every second</span>
                                </div>
                                <div className="dash__market-table-wrap">
                                    <table className="dash__market-table">
                                        <thead>
                                            <tr>
                                                <th>Coin</th>
                                                <th>Price (INR)</th>
                                                <th>24h Change</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MARKET_COINS.map(coin => {
                                                const live = prices.get(coin.symbol)
                                                const price = live ? formatINR(live.price_inr) : '—'
                                                const { text: change, up } = live ? formatChange(live.change_24h) : { text: '—', up: true }

                                                return (
                                                    <tr key={coin.symbol}>
                                                        <td>
                                                            <div className="dash__market-coin">
                                                                <span className="dash__market-icon" style={{ background: `${coin.color}20`, color: coin.color, borderColor: `${coin.color}30` }}>
                                                                    {coin.icon}
                                                                </span>
                                                                <span className="dash__market-name">{coin.name}</span>
                                                                <span className="dash__market-symbol">{coin.symbol}</span>
                                                                {coin.symbol === 'BTC' && <span className="dash__trending-badge">Trending 🔥</span>}
                                                            </div>
                                                        </td>
                                                        <td className="dash__market-price">{price}</td>
                                                        <td>
                                                            <span className={`dash__market-change ${up ? 'dash__market-change--up' : 'dash__market-change--down'}`}>
                                                                {up ? '▲' : '▼'} {change}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-primary dash__trade-btn" onClick={() => onTrade?.(coin.symbol)}>Trade</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Placeholder for other sections */}
                    {activeSection !== 'overview' && (
                        <div className="dash__placeholder">
                            <div className="dash__placeholder-icon">{SIDEBAR_NAV.find(n => n.id === activeSection)?.icon}</div>
                            <h2>{PAGE_TITLES[activeSection]}</h2>
                            <p>This section is coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
