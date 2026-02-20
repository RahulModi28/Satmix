import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook that connects to the Satmix crypto-server WebSocket
 * (Binance relay) and provides live crypto prices to any component.
 *
 * The server URL is configured via VITE_WS_URL env variable.
 * - Local dev:  ws://localhost:8080
 * - Production: wss://your-railway-app.up.railway.app
 *
 * @returns {{ prices: Map<string, object>, isConnected: boolean }}
 */
export default function useCryptoPrices() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'

    const [prices, setPrices] = useState(new Map())
    const [isConnected, setIsConnected] = useState(false)
    const wsRef = useRef(null)
    const reconnectTimer = useRef(null)

    useEffect(() => {
        function connect() {
            const ws = new WebSocket(wsUrl)
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
                    if (msg.type === 'price_update' && Array.isArray(msg.data)) {
                        const newPrices = new Map()
                        msg.data.forEach((coin) => {
                            newPrices.set(coin.symbol, coin)
                        })
                        setPrices(newPrices)
                    }
                } catch (err) {
                    console.error('[useCryptoPrices] Parse error:', err)
                }
            }

            ws.onclose = () => {
                setIsConnected(false)
                // Auto-reconnect after 3 seconds
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
            if (wsRef.current) wsRef.current.close()
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
        }
    }, [wsUrl])

    return { prices, isConnected }
}
