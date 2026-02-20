import { createContext, useContext } from 'react'
import useCryptoPrices from '../hooks/useCryptoPrices'

const CryptoPricesContext = createContext({ prices: new Map(), isConnected: false })

/**
 * Wraps the app tree and provides live crypto prices via context.
 * Only one WebSocket connection is created, shared by all consumers.
 */
export function CryptoPricesProvider({ children }) {
    const data = useCryptoPrices('ws://localhost:8080')

    return (
        <CryptoPricesContext.Provider value={data}>
            {children}
        </CryptoPricesContext.Provider>
    )
}

/**
 * Hook to access live crypto prices from any component.
 * @returns {{ prices: Map<string, object>, isConnected: boolean }}
 */
export function useLivePrices() {
    return useContext(CryptoPricesContext)
}
