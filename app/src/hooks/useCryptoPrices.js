import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Symbols to track — Binance trading pairs (all USDT pairs).
 */
const SYMBOLS = [
    { id: 'btcusdt', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethusdt', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solusdt', name: 'Solana', symbol: 'SOL' },
    { id: 'bnbusdt', name: 'BNB', symbol: 'BNB' },
    { id: 'xrpusdt', name: 'XRP', symbol: 'XRP' },
    { id: 'dogeusdt', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'adausdt', name: 'Cardano', symbol: 'ADA' },
]

const STREAM_NAMES = SYMBOLS.map(s => `${s.id}@ticker`)
const BINANCE_WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAM_NAMES.join('/')}`
const FOREX_API_URL = 'https://api.frankfurter.app/latest?from=USD&to=INR'
const FOREX_POLL_INTERVAL = 5 * 60 * 1000 // 5 minutes
const BROADCAST_INTERVAL = 1000 // Throttle state updates to max 1/sec

/**
 * Custom hook that connects directly to Binance's public WebSocket
 * and provides live crypto prices with INR conversion.
 *
 * No backend server required — works standalone on Vercel/Netlify/etc.
 *
 * @returns {{ prices: Map<string, object>, isConnected: boolean }}
 */
export default function useCryptoPrices() {
    const [prices, setPrices] = useState(new Map())
    const [isConnected, setIsConnected] = useState(false)

    const wsRef = useRef(null)
    const reconnectTimer = useRef(null)
    const inrRateRef = useRef(86.0) // Safe fallback
    const cacheRef = useRef(new Map())
    const pendingRef = useRef(false)
    const throttleTimer = useRef(null)

    // Fetch USD→INR rate
    const fetchForexRate = useCallback(async () => {
        try {
            const res = await fetch(FOREX_API_URL)
            if (!res.ok) return
            const data = await res.json()
            if (data?.rates?.INR) {
                inrRateRef.current = data.rates.INR
            }
        } catch {
            // Keep using cached rate on failure
        }
    }, [])

    // Flush cached prices to React state (throttled)
    const scheduleFlush = useCallback(() => {
        pendingRef.current = true
        if (throttleTimer.current) return

        throttleTimer.current = setTimeout(() => {
            throttleTimer.current = null
            if (!pendingRef.current) return
            pendingRef.current = false

            const rate = inrRateRef.current
            const newPrices = new Map()

            SYMBOLS.forEach(s => {
                const cached = cacheRef.current.get(s.id)
                if (!cached) return

                newPrices.set(s.symbol, {
                    ...cached,
                    price_inr: cached.price_usd != null ? cached.price_usd * rate : null,
                    high_24h_inr: cached.high_24h != null ? cached.high_24h * rate : null,
                    low_24h_inr: cached.low_24h != null ? cached.low_24h * rate : null,
                })
            })

            setPrices(newPrices)
        }, BROADCAST_INTERVAL)
    }, [])

    useEffect(() => {
        // 1. Fetch INR rate immediately then poll every 5 min
        fetchForexRate()
        const forexInterval = setInterval(fetchForexRate, FOREX_POLL_INTERVAL)

        // 2. Connect to Binance WebSocket
        function connect() {
            const ws = new WebSocket(BINANCE_WS_URL)
            wsRef.current = ws

            ws.onopen = () => {
                setIsConnected(true)
                if (reconnectTimer.current) {
                    clearTimeout(reconnectTimer.current)
                    reconnectTimer.current = null
                }
            }

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data)
                    if (!msg.data || !msg.stream) return

                    const ticker = msg.data
                    const streamSymbol = msg.stream.split('@')[0]
                    const meta = SYMBOLS.find(s => s.id === streamSymbol)
                    if (!meta) return

                    cacheRef.current.set(streamSymbol, {
                        id: meta.id,
                        name: meta.name,
                        symbol: meta.symbol,
                        price_usd: parseFloat(ticker.c),
                        change_24h: parseFloat(ticker.P),
                        high_24h: parseFloat(ticker.h),
                        low_24h: parseFloat(ticker.l),
                        volume: parseFloat(ticker.q),
                    })

                    scheduleFlush()
                } catch {
                    // Ignore parse errors
                }
            }

            ws.onclose = () => {
                setIsConnected(false)
                if (!reconnectTimer.current) {
                    reconnectTimer.current = setTimeout(() => {
                        reconnectTimer.current = null
                        connect()
                    }, 3000)
                }
            }

            ws.onerror = () => {
                ws.close()
            }
        }

        connect()

        return () => {
            clearInterval(forexInterval)
            if (wsRef.current) wsRef.current.close()
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
            if (throttleTimer.current) clearTimeout(throttleTimer.current)
        }
    }, [fetchForexRate, scheduleFlush])

    return { prices, isConnected }
}
