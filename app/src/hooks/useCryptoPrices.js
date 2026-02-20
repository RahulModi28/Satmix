import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Coin mapping — CoinGecko IDs → our display symbols.
 */
const COINS = [
    { cgId: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { cgId: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { cgId: 'solana', symbol: 'SOL', name: 'Solana' },
    { cgId: 'binancecoin', symbol: 'BNB', name: 'BNB' },
    { cgId: 'ripple', symbol: 'XRP', name: 'XRP' },
    { cgId: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
    { cgId: 'cardano', symbol: 'ADA', name: 'Cardano' },
]

const CG_IDS = COINS.map(c => c.cgId).join(',')
const CG_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${CG_IDS}&order=market_cap_desc&sparkline=false`
const POLL_INTERVAL = 30_000 // 30 seconds (CoinGecko free tier allows ~30 calls/min)

/**
 * Custom hook that fetches live crypto prices from CoinGecko REST API.
 * Provides INR prices directly — no separate forex conversion needed.
 * Works globally including India (unlike Binance WebSocket which is blocked).
 *
 * @returns {{ prices: Map<string, object>, isConnected: boolean }}
 */
export default function useCryptoPrices() {
    const [prices, setPrices] = useState(new Map())
    const [isConnected, setIsConnected] = useState(false)
    const intervalRef = useRef(null)

    const fetchPrices = useCallback(async () => {
        try {
            const res = await fetch(CG_URL)
            if (!res.ok) {
                // Likely rate-limited (429) — keep showing stale data
                if (res.status === 429) return
                throw new Error(`HTTP ${res.status}`)
            }

            const data = await res.json()
            if (!Array.isArray(data)) return

            const newPrices = new Map()

            data.forEach(coin => {
                const meta = COINS.find(c => c.cgId === coin.id)
                if (!meta) return

                newPrices.set(meta.symbol, {
                    id: coin.id,
                    name: meta.name,
                    symbol: meta.symbol,
                    price_usd: coin.current_price / 85, // Approximate USD for display
                    price_inr: coin.current_price,
                    change_24h: coin.price_change_percentage_24h,
                    high_24h: coin.high_24h / 85,
                    low_24h: coin.low_24h / 85,
                    high_24h_inr: coin.high_24h,
                    low_24h_inr: coin.low_24h,
                    volume: coin.total_volume,
                })
            })

            setPrices(newPrices)
            setIsConnected(true)
        } catch {
            // Keep showing stale data on error — don't set isConnected to false
            // so the UI doesn't flash a disconnected state on transient errors
        }
    }, [])

    useEffect(() => {
        // Fetch immediately, then poll
        fetchPrices()
        intervalRef.current = setInterval(fetchPrices, POLL_INTERVAL)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [fetchPrices])

    return { prices, isConnected }
}
