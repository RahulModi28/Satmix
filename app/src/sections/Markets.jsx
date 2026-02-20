import { TrendingUp } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useLivePrices } from '../context/CryptoPricesContext'
import './Markets.css'

// Static metadata: symbol, display name, color, icon glyph
const COIN_META = [
    { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', icon: 'Ξ' },
    { symbol: 'SOL', name: 'Solana', color: '#00FFA3', icon: '◎' },
    { symbol: 'BNB', name: 'BNB', color: '#F3BA2F', icon: '◆' },
    { symbol: 'XRP', name: 'XRP', color: '#00AAE4', icon: '✕' },
    { symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633', icon: 'Ð' },
    { symbol: 'ADA', name: 'Cardano', color: '#0033AD', icon: '◇' },
]

/**
 * Format INR price using the Indian numbering system (lakhs/crores).
 * Examples: ₹73,42,150  ₹2,64,830  ₹84.12
 */
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

export default function Markets() {
    const { prices } = useLivePrices()

    // Merge static coin metadata with live INR prices
    const coins = COIN_META.map(meta => {
        const live = prices.get(meta.symbol)
        const price = live ? formatINR(live.price_inr) : '—'
        const { text: change, up } = live ? formatChange(live.change_24h) : { text: '—', up: true }
        return { ...meta, price, change, up }
    })

    return (
        <section className="markets section" id="markets">
            <div className="container">
                <ScrollReveal>
                    <div className="badge">
                        <TrendingUp size={14} /> Live Prices
                    </div>
                    <h2 className="section-title">
                        Trending <span className="gradient-text">Markets</span>
                    </h2>
                    <p className="section-subtitle">
                        Trade 50+ coins on Satmix. Here are the top movers right now.
                    </p>
                </ScrollReveal>

                <div className="markets__grid">
                    {coins.map((coin, i) => (
                        <ScrollReveal delay={i * 80} key={coin.symbol}>
                            <div className="markets__card card">
                                <div className="markets__card-header">
                                    <div className="markets__coin-icon" style={{ background: `${coin.color}20`, color: coin.color, borderColor: `${coin.color}30` }}>
                                        {coin.icon}
                                    </div>
                                    <div>
                                        <div className="markets__coin-symbol">{coin.symbol}</div>
                                        <div className="markets__coin-name">{coin.name}</div>
                                    </div>
                                </div>
                                <div className="markets__card-price">
                                    <div className="markets__price">{coin.price}</div>
                                    <div className={`markets__change ${coin.up ? 'markets__change--up' : 'markets__change--down'}`}>
                                        {coin.up ? '▲' : '▼'} {coin.change}
                                    </div>
                                </div>
                                <div className="markets__mini-chart" aria-hidden="true">
                                    <svg viewBox="0 0 100 30" className={coin.up ? 'chart-up' : 'chart-down'}>
                                        <polyline
                                            fill="none"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            points={coin.up
                                                ? '0,25 15,20 30,22 45,15 60,18 75,8 100,5'
                                                : '0,5 15,10 30,8 45,18 60,15 75,22 100,25'
                                            }
                                        />
                                    </svg>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
