import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Search, ChevronDown, ArrowLeft, ClipboardList, Bitcoin, Gem, Sun, Diamond, X, Dog, Pentagon } from 'lucide-react'
import { useLivePrices } from '../context/CryptoPricesContext'
import './Trading.css'

// ─── Constants ──────────────────────────────────────────────

const COINS = [
    { symbol: 'BTC', name: 'Bitcoin', icon: <Bitcoin size={14} />, color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', icon: <Gem size={14} />, color: '#627EEA' },
    { symbol: 'SOL', name: 'Solana', icon: <Sun size={14} />, color: '#00FFA3' },
    { symbol: 'BNB', name: 'BNB', icon: <Diamond size={14} />, color: '#F3BA2F' },
    { symbol: 'XRP', name: 'XRP', icon: <X size={14} />, color: '#00AAE4' },
    { symbol: 'DOGE', name: 'Dogecoin', icon: <Dog size={14} />, color: '#C2A633' },
    { symbol: 'ADA', name: 'Cardano', icon: <Pentagon size={14} />, color: '#0033AD' },
]

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1D', '1W', '1M']

const user = {
    inrBalance: 12450.00,
    holdings: { BTC: 0.00842, ETH: 0.4521, SOL: 3.21, USDT: 1250, BNB: 0, XRP: 0, DOGE: 0, ADA: 0 },
    recentTrades: [
        { type: 'BUY', coin: 'BTC', qty: 0.001, price: 7320000, time: 'Today 10:24 AM', status: 'Filled' },
        { type: 'SELL', coin: 'ETH', qty: 0.1, price: 271000, time: 'Yesterday 3:12 PM', status: 'Filled' },
        { type: 'BUY', coin: 'SOL', qty: 1, price: 15800, time: 'Feb 18, 9:00 AM', status: 'Filled' },
        { type: 'BUY', coin: 'USDT', qty: 500, price: 84.2, time: 'Feb 17, 6:45 PM', status: 'Filled' },
        { type: 'SELL', coin: 'BTC', qty: 0.0005, price: 7410000, time: 'Feb 16, 2:30 PM', status: 'Filled' },
    ]
}

// ─── Utilities ──────────────────────────────────────────────

function formatINR(num) {
    if (num == null) return '—'
    if (num >= 100) return '₹' + Math.round(num).toLocaleString('en-IN')
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatChange(change) {
    if (change == null) return { text: '—', up: true }
    const abs = Math.abs(change).toFixed(2)
    return change >= 0 ? { text: `+${abs}%`, up: true } : { text: `-${abs}%`, up: false }
}

function formatCompact(num) {
    if (num >= 1e7) return '₹' + (num / 1e7).toFixed(2) + ' Cr'
    if (num >= 1e5) return '₹' + (num / 1e5).toFixed(2) + ' L'
    return formatINR(num)
}

// Generate realistic candlestick data
function generateCandleData(basePrice, count = 120) {
    const data = []
    let price = basePrice
    const now = Math.floor(Date.now() / 1000)

    for (let i = 0; i < count; i++) {
        const time = now - (count - i) * 60
        const open = price
        const change = (Math.random() - 0.48) * basePrice * 0.002
        const close = open + change
        const high = Math.max(open, close) + Math.random() * basePrice * 0.001
        const low = Math.min(open, close) - Math.random() * basePrice * 0.001
        const volume = Math.random() * 50 + 10

        data.push({ time, open, high, low, close, volume })
        price = close
    }
    return data
}

// Generate mock order book
function generateOrderBook(currentPrice) {
    if (!currentPrice) return { asks: [], bids: [] }
    const asks = []
    const bids = []

    for (let i = 0; i < 10; i++) {
        const askPrice = currentPrice + (i + 1) * currentPrice * 0.0003
        const bidPrice = currentPrice - (i + 1) * currentPrice * 0.0003
        const askAmt = (Math.random() * 0.5 + 0.01).toFixed(5)
        const bidAmt = (Math.random() * 0.5 + 0.01).toFixed(5)

        asks.push({ price: askPrice, amount: parseFloat(askAmt), total: askPrice * parseFloat(askAmt) })
        bids.push({ price: bidPrice, amount: parseFloat(bidAmt), total: bidPrice * parseFloat(bidAmt) })
    }

    return { asks: asks.reverse(), bids }
}

// ─── TradingView Chart Component ────────────────────────────

function ChartWidget({ symbol, prices }) {
    const containerRef = useRef(null)
    const chartRef = useRef(null)
    const candleSeriesRef = useRef(null)
    const volumeSeriesRef = useRef(null)

    const livePrice = prices.get(symbol)
    const currentPrice = livePrice?.price_inr || 7400000

    useEffect(() => {
        if (!containerRef.current || !window.LightweightCharts) return

        // Clean up previous chart
        if (chartRef.current) {
            chartRef.current.remove()
            chartRef.current = null
        }

        const chart = window.LightweightCharts.createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: 420,
            layout: {
                background: { color: '#080C14' },
                textColor: '#7A8BA5',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
            },
            grid: {
                vertLines: { color: 'rgba(255,255,255,0.04)' },
                horzLines: { color: 'rgba(255,255,255,0.04)' },
            },
            crosshair: {
                vertLine: { color: 'rgba(255,140,0,0.5)', labelBackgroundColor: '#F59E0B' },
                horzLine: { color: 'rgba(255,140,0,0.5)', labelBackgroundColor: '#F59E0B' },
            },
            rightPriceScale: {
                borderColor: 'rgba(255,255,255,0.07)',
                scaleMargins: { top: 0.1, bottom: 0.25 },
            },
            timeScale: {
                borderColor: 'rgba(255,255,255,0.07)',
                timeVisible: true,
                secondsVisible: false,
            },
        })

        chartRef.current = chart

        const candleSeries = chart.addCandlestickSeries({
            upColor: '#00D97E',
            downColor: '#FF4D6D',
            borderUpColor: '#00D97E',
            borderDownColor: '#FF4D6D',
            wickUpColor: '#00D97E',
            wickDownColor: '#FF4D6D',
        })

        const volumeSeries = chart.addHistogramSeries({
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        })

        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.85, bottom: 0 },
        })

        const candles = generateCandleData(currentPrice)
        candleSeries.setData(candles.map(c => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close })))
        volumeSeries.setData(candles.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? 'rgba(0,217,126,0.3)' : 'rgba(255,77,109,0.3)' })))

        candleSeriesRef.current = candleSeries
        volumeSeriesRef.current = volumeSeries

        chart.timeScale().fitContent()

        // ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                chart.applyOptions({ width: entry.contentRect.width })
            }
        })
        resizeObserver.observe(containerRef.current)

        return () => {
            resizeObserver.disconnect()
            chart.remove()
            chartRef.current = null
        }
    }, [symbol]) // Re-create chart when symbol changes

    return <div ref={containerRef} className="trade__chart-container" />
}

// ─── Main Trading Component ─────────────────────────────────

export default function Trading({ initialCoin = 'BTC', onBack }) {
    const { prices, isConnected } = useLivePrices()
    const [selectedCoin, setSelectedCoin] = useState(initialCoin)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTimeframe, setActiveTimeframe] = useState('1m')
    const [orderSide, setOrderSide] = useState('buy')
    const [orderType, setOrderType] = useState('market')
    const [amountINR, setAmountINR] = useState('')
    const [ordersTab, setOrdersTab] = useState('open')

    // Get current coin data
    const coinMeta = COINS.find(c => c.symbol === selectedCoin) || COINS[0]
    const liveData = prices.get(selectedCoin)
    const currentPrice = liveData?.price_inr || null
    const change24h = liveData?.change_24h || null
    const { text: changeText, up: changeUp } = formatChange(change24h)

    // Mock 24h stats derived from live price
    const high24h = currentPrice ? currentPrice * 1.018 : null
    const low24h = currentPrice ? currentPrice * 0.982 : null
    const volume24h = currentPrice ? currentPrice * 42.5 : null

    // Filtered coins for search
    const filteredCoins = useMemo(() => {
        if (!searchQuery) return COINS
        const q = searchQuery.toLowerCase()
        return COINS.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
    }, [searchQuery])

    // Order calculations
    const availableBalance = orderSide === 'buy'
        ? user.inrBalance
        : (user.holdings[selectedCoin] || 0)

    const receiveAmount = useMemo(() => {
        if (!amountINR || !currentPrice) return 0
        const amt = parseFloat(amountINR)
        if (isNaN(amt)) return 0
        if (orderSide === 'buy') return amt / currentPrice
        return amt * currentPrice
    }, [amountINR, currentPrice, orderSide])

    const fee = useMemo(() => {
        const amt = parseFloat(amountINR) || 0
        if (orderSide === 'buy') return amt * 0.001
        return (amt * (currentPrice || 0)) * 0.001
    }, [amountINR, currentPrice, orderSide])

    const handleQuickFill = (pct) => {
        if (orderSide === 'buy') {
            setAmountINR((availableBalance * pct / 100).toFixed(2))
        } else {
            setAmountINR((availableBalance * pct / 100).toFixed(6))
        }
    }

    // Order book data
    const orderBook = useMemo(() => generateOrderBook(currentPrice), [currentPrice ? Math.round(currentPrice / 1000) : 0])
    const maxOrderSize = useMemo(() => {
        const allAmts = [...orderBook.asks, ...orderBook.bids].map(o => o.amount)
        return Math.max(...allAmts, 0.01)
    }, [orderBook])

    const handleCoinSelect = useCallback((symbol) => {
        setSelectedCoin(symbol)
        setAmountINR('')
    }, [])

    return (
        <div className="trade">
            {/* ═══ LEFT — COIN SELECTOR ═══ */}
            <aside className="trade__coins">
                <div className="trade__coins-header">
                    <h3 className="trade__coins-title">Markets</h3>
                </div>
                <div className="trade__search-wrap">
                    <Search size={14} className="trade__search-icon" />
                    <input
                        type="text"
                        className="trade__search"
                        placeholder="Search coin..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="trade__coins-list">
                    {filteredCoins.map(coin => {
                        const live = prices.get(coin.symbol)
                        const price = live ? formatINR(live.price_inr) : '—'
                        const { text: chg, up } = live ? formatChange(live.change_24h) : { text: '—', up: true }
                        return (
                            <button
                                key={coin.symbol}
                                className={`trade__coin-item ${selectedCoin === coin.symbol ? 'trade__coin-item--active' : ''}`}
                                onClick={() => handleCoinSelect(coin.symbol)}
                            >
                                <span className="trade__coin-icon" style={{ background: `${coin.color}20`, color: coin.color }}>{coin.icon}</span>
                                <div className="trade__coin-info">
                                    <span className="trade__coin-sym">{coin.symbol}</span>
                                    <span className="trade__coin-price">{price}</span>
                                </div>
                                <span className={`trade__coin-chg ${up ? 'trade__chg--up' : 'trade__chg--down'}`}>{chg}</span>
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* ═══ CENTER — CHART ═══ */}
            <main className="trade__center">
                {/* Top bar */}
                <div className="trade__topbar">
                    <div className="trade__topbar-left">
                        <button className="trade__back-btn" onClick={() => onBack?.()}><ArrowLeft size={16} /></button>
                        <span className="trade__pair-icon" style={{ background: `${coinMeta.color}20`, color: coinMeta.color }}>{coinMeta.icon}</span>
                        <div className="trade__pair-info">
                            <div className="trade__pair-name">
                                {coinMeta.name} <span className="trade__pair-sym">{selectedCoin}/INR</span>
                            </div>
                            <div className="trade__pair-price-row">
                                <span className="trade__live-price">{currentPrice ? formatINR(currentPrice) : '—'}</span>
                                <span className={`trade__change-pill ${changeUp ? 'trade__pill--up' : 'trade__pill--down'}`}>
                                    {changeUp ? '▲' : '▼'} {changeText}
                                </span>
                            </div>
                        </div>
                        <div className="trade__pair-stats">
                            <div className="trade__stat">
                                <span className="trade__stat-label">24h High</span>
                                <span className="trade__stat-val">{high24h ? formatINR(high24h) : '—'}</span>
                            </div>
                            <div className="trade__stat">
                                <span className="trade__stat-label">24h Low</span>
                                <span className="trade__stat-val">{low24h ? formatINR(low24h) : '—'}</span>
                            </div>
                            <div className="trade__stat">
                                <span className="trade__stat-label">24h Volume</span>
                                <span className="trade__stat-val">{volume24h ? formatCompact(volume24h) : '—'}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`trade__ws-dot ${isConnected ? 'trade__ws-dot--live' : ''}`} title={isConnected ? 'Connected' : 'Reconnecting'} />
                </div>

                {/* Timeframe selector */}
                <div className="trade__timeframes">
                    {TIMEFRAMES.map(tf => (
                        <button
                            key={tf}
                            className={`trade__tf-btn ${activeTimeframe === tf ? 'trade__tf-btn--active' : ''}`}
                            onClick={() => setActiveTimeframe(tf)}
                        >
                            {tf}
                        </button>
                    ))}
                </div>

                {/* Chart */}
                <ChartWidget symbol={selectedCoin} prices={prices} />

                {/* Open Orders */}
                <div className="trade__orders-section">
                    <div className="trade__orders-tabs">
                        <button className={`trade__orders-tab ${ordersTab === 'open' ? 'trade__orders-tab--active' : ''}`} onClick={() => setOrdersTab('open')}>
                            Open Orders (0)
                        </button>
                        <button className={`trade__orders-tab ${ordersTab === 'history' ? 'trade__orders-tab--active' : ''}`} onClick={() => setOrdersTab('history')}>
                            Order History ({user.recentTrades.length})
                        </button>
                    </div>

                    {ordersTab === 'open' && (
                        <div className="trade__orders-empty">
                            <div className="trade__orders-empty-icon"><ClipboardList size={28} /></div>
                            <div className="trade__orders-empty-title">No open orders yet</div>
                            <div className="trade__orders-empty-sub">Place your first order above</div>
                        </div>
                    )}

                    {ordersTab === 'history' && (
                        <div className="trade__orders-table-wrap">
                            <table className="trade__orders-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Pair</th>
                                        <th>Side</th>
                                        <th>Price</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.recentTrades.map((t, i) => (
                                        <tr key={i}>
                                            <td className="trade__history-time">{t.time}</td>
                                            <td>{t.coin}/INR</td>
                                            <td>
                                                <span className={`trade__side-badge ${t.type === 'BUY' ? 'trade__side--buy' : 'trade__side--sell'}`}>
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="trade__history-price">{formatINR(t.price)}</td>
                                            <td>{t.qty} {t.coin}</td>
                                            <td><span className="trade__status-pill">{t.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* ═══ RIGHT — ORDER PANEL ═══ */}
            <aside className="trade__order-panel">
                {/* Buy/Sell tabs */}
                <div className="trade__order-tabs">
                    <button
                        className={`trade__order-tab ${orderSide === 'buy' ? 'trade__order-tab--buy' : ''}`}
                        onClick={() => { setOrderSide('buy'); setAmountINR('') }}
                    >
                        Buy {selectedCoin}
                    </button>
                    <button
                        className={`trade__order-tab ${orderSide === 'sell' ? 'trade__order-tab--sell' : ''}`}
                        onClick={() => { setOrderSide('sell'); setAmountINR('') }}
                    >
                        Sell {selectedCoin}
                    </button>
                </div>

                {/* Order type */}
                <div className="trade__type-selector">
                    {['market', 'limit', 'stop-limit'].map(t => (
                        <button
                            key={t}
                            className={`trade__type-btn ${orderType === t ? 'trade__type-btn--active' : ''}`}
                            onClick={() => setOrderType(t)}
                        >
                            {t === 'stop-limit' ? 'Stop-Limit' : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Available balance */}
                <div className="trade__available">
                    Available: <span className="trade__available-val">
                        {orderSide === 'buy'
                            ? formatINR(user.inrBalance) + ' INR'
                            : `${user.holdings[selectedCoin] || 0} ${selectedCoin}`
                        }
                    </span>
                </div>

                {/* Amount input */}
                <div className="trade__input-group">
                    <label className="trade__input-label">
                        Amount ({orderSide === 'buy' ? 'INR' : selectedCoin})
                    </label>
                    <div className="trade__input-wrap">
                        <input
                            type="number"
                            className="trade__amount-input"
                            placeholder="0.00"
                            value={amountINR}
                            onChange={e => setAmountINR(e.target.value)}
                        />
                        <span className="trade__input-suffix">{orderSide === 'buy' ? 'INR' : selectedCoin}</span>
                    </div>
                </div>

                {/* Quick amount buttons */}
                <div className="trade__quick-btns">
                    {[25, 50, 75, 100].map(pct => (
                        <button key={pct} className="trade__quick-btn" onClick={() => handleQuickFill(pct)}>
                            {pct}%
                        </button>
                    ))}
                </div>

                {/* Divider with ≈ */}
                <div className="trade__divider-eq">≈</div>

                {/* Receive amount */}
                <div className="trade__input-group">
                    <label className="trade__input-label">You will receive</label>
                    <div className="trade__input-wrap trade__input-wrap--readonly">
                        <span className="trade__receive-val">
                            ≈ {orderSide === 'buy'
                                ? receiveAmount.toFixed(8)
                                : formatINR(receiveAmount)
                            }
                        </span>
                        <span className="trade__input-suffix">{orderSide === 'buy' ? selectedCoin : 'INR'}</span>
                    </div>
                </div>

                {/* Fee breakdown */}
                <div className="trade__fees">
                    <div className="trade__fee-row">
                        <span>Trading Fee (0.1%)</span>
                        <span>{formatINR(fee)}</span>
                    </div>
                    <div className="trade__fee-row trade__fee-total">
                        <span>You Pay</span>
                        <span>{formatINR((parseFloat(amountINR) || 0) + (orderSide === 'buy' ? fee : 0))}</span>
                    </div>
                </div>

                {/* Place order button */}
                <button className={`trade__place-btn ${orderSide === 'buy' ? 'trade__place-btn--buy' : 'trade__place-btn--sell'}`}>
                    {orderSide === 'buy' ? `Buy ${selectedCoin}` : `Sell ${selectedCoin}`}
                </button>

                {/* Disclaimer */}
                <p className="trade__disclaimer">
                    Crypto investments are subject to market risks. 30% tax applicable on gains as per Indian IT Act.
                </p>

                {/* Order Book */}
                <div className="trade__orderbook">
                    <h4 className="trade__orderbook-title">Order Book</h4>
                    <div className="trade__ob-header">
                        <span>Price (INR)</span>
                        <span>Amount ({selectedCoin})</span>
                        <span>Total</span>
                    </div>

                    {/* Asks (sell orders) */}
                    <div className="trade__ob-asks">
                        {orderBook.asks.map((order, i) => (
                            <div key={`a${i}`} className="trade__ob-row trade__ob-row--ask">
                                <div className="trade__ob-depth trade__ob-depth--ask" style={{ width: `${(order.amount / maxOrderSize) * 100}%` }} />
                                <span className="trade__ob-price trade__ob-price--ask">{formatINR(order.price)}</span>
                                <span className="trade__ob-amt">{order.amount.toFixed(5)}</span>
                                <span className="trade__ob-total">{formatCompact(order.total)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Spread */}
                    <div className="trade__ob-spread">
                        <span className="trade__ob-spread-label">Spread</span>
                        <span className="trade__ob-spread-val">
                            {currentPrice
                                ? formatINR(orderBook.asks?.[orderBook.asks.length - 1]?.price - orderBook.bids?.[0]?.price || 0)
                                : '—'}
                        </span>
                    </div>

                    {/* Bids (buy orders) */}
                    <div className="trade__ob-bids">
                        {orderBook.bids.map((order, i) => (
                            <div key={`b${i}`} className="trade__ob-row trade__ob-row--bid">
                                <div className="trade__ob-depth trade__ob-depth--bid" style={{ width: `${(order.amount / maxOrderSize) * 100}%` }} />
                                <span className="trade__ob-price trade__ob-price--bid">{formatINR(order.price)}</span>
                                <span className="trade__ob-amt">{order.amount.toFixed(5)}</span>
                                <span className="trade__ob-total">{formatCompact(order.total)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    )
}
