import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook that connects to the Binance WebSocket relay server
 * and provides live crypto prices to any component.
 *
 * @param {string} wsUrl - WebSocket server URL (defaults to localhost:8080)
 * @returns {{ prices: Map<string, object>, isConnected: boolean }}
 */
export default function useCryptoPrices(wsUrl = 'ws://localhost:8080') {
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
            // Cleanup on unmount
            if (wsRef.current) {
                wsRef.current.close()
            }
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current)
            }
        }
    }, [wsUrl])

    return { prices, isConnected }
}
