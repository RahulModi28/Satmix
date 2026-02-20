import { useLivePrices } from '../context/CryptoPricesContext'
import './Ticker.css'

// Static metadata for coins in the ticker (order + fallbacks)
const TICKER_COINS = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'BNB', name: 'BNB' },
    { symbol: 'XRP', name: 'XRP' },
    { symbol: 'DOGE', name: 'Dogecoin' },
    { symbol: 'ADA', name: 'Cardano' },
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
    // Small coins like DOGE, ADA — show decimals
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatChange(change) {
    if (change == null) return { text: '—', up: true }
    const abs = Math.abs(change).toFixed(2)
    if (change >= 0) return { text: `+${abs}%`, up: true }
    return { text: `-${abs}%`, up: false }
}

export default function Ticker() {
    const { prices } = useLivePrices()

    // Build display data by merging static metadata with live INR prices
    const tickerData = TICKER_COINS.map(coin => {
        const live = prices.get(coin.symbol)
        const price = live ? formatINR(live.price_inr) : '—'
        const { text: change, up } = live ? formatChange(live.change_24h) : { text: '—', up: true }
        return { ...coin, price, change, up }
    })

    // Duplicate for infinite scroll effect
    const items = [...tickerData, ...tickerData]

    return (
        <div className="ticker">
            <div className="ticker__track">
                {items.map((coin, i) => (
                    <div className="ticker__item" key={i}>
                        <span className="ticker__symbol">{coin.symbol}</span>
                        <span className="ticker__price">{coin.price}</span>
                        <span className={`ticker__change ${coin.up ? 'ticker__change--up' : 'ticker__change--down'}`}>
                            {coin.change}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
