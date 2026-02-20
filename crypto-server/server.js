/**
 * ============================================================
 *  SATMIX — Real-Time Crypto Price Broadcasting Server
 * ============================================================
 *
 *  Architecture:
 *    Binance WebSocket Streams  →  Node.js Server  →  × INR Rate  →  Our WebSocket Server  →  Browser Clients
 *
 *  How to run:
 *    1. cd crypto-server
 *    2. npm install
 *    3. npm start
 *    4. Open http://localhost:8080 in your browser
 *
 *  The server connects to Binance's free public WebSocket streams
 *  for real-time ticker data, converts prices to INR using a free
 *  forex API, and relays everything to connected browser clients.
 * ============================================================
 */

const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const path = require('path');

// ─── CONFIGURATION ──────────────────────────────────────────

const PORT = 8080;

// Binance combined stream endpoint
const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/stream';

// Frankfurter API — free, no API key, ECB reference rates
const FOREX_API_URL = 'https://api.frankfurter.app/latest?from=USD&to=INR';
const FOREX_POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Symbols to track — Binance trading pairs (all USDT pairs)
const SYMBOLS = [
    { id: 'btcusdt', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethusdt', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solusdt', name: 'Solana', symbol: 'SOL' },
    { id: 'bnbusdt', name: 'BNB', symbol: 'BNB' },
    { id: 'xrpusdt', name: 'XRP', symbol: 'XRP' },
    { id: 'dogeusdt', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'adausdt', name: 'Cardano', symbol: 'ADA' },
];

// Build stream names: btcusdt@ticker, ethusdt@ticker, etc.
const STREAM_NAMES = SYMBOLS.map(s => `${s.id}@ticker`);

// ─── IN-MEMORY STATE ────────────────────────────────────────

// Map of symbol → latest ticker data (USD only)
const priceCache = new Map();
let lastUpdateTime = null;

// Current USD→INR exchange rate
let inrRate = 86.0; // Safe fallback until first fetch
let inrRateLastUpdated = null;

// Throttled broadcast — batches updates every 1 second
const BROADCAST_INTERVAL = 1000; // 1 second
let broadcastTimer = null;
let broadcastPending = false;

function scheduleBroadcast() {
    broadcastPending = true;
    if (broadcastTimer) return; // Already scheduled

    broadcastTimer = setTimeout(() => {
        broadcastTimer = null;
        if (broadcastPending) {
            broadcastPending = false;
            const sent = broadcast({
                type: 'price_update',
                data: getCacheAsArray(),
                inrRate,
                timestamp: lastUpdateTime,
            });

            // Log BTC price once per broadcast cycle
            const btc = priceCache.get('btcusdt');
            if (btc) {
                const inrPrice = (btc.price_usd * inrRate).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                console.log(`[Broadcast] BTC: $${btc.price_usd.toLocaleString()} / ₹${inrPrice} (${btc.change_24h > 0 ? '+' : ''}${btc.change_24h.toFixed(2)}%) → ${sent} client(s)`);
            }
        }
    }, BROADCAST_INTERVAL);
}

// ─── EXPRESS + HTTP SERVER ──────────────────────────────────

const app = express();
const server = http.createServer(app);

// Serve client.html at the root URL
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client.html'));
});

// Health-check / debugging endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        connectedClients: wss.clients.size,
        binanceConnected: binanceWs && binanceWs.readyState === WebSocket.OPEN,
        cachedSymbols: priceCache.size,
        inrRate,
        inrRateLastUpdated,
        lastUpdateTime,
    });
});

// ─── USD → INR FOREX RATE POLLER ─────────────────────────────

async function fetchForexRate() {
    try {
        console.log('[Forex] Fetching USD→INR rate...');
        const response = await fetch(FOREX_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.rates && data.rates.INR) {
            inrRate = data.rates.INR;
            inrRateLastUpdated = new Date().toISOString();
            console.log(`[Forex] ✓ USD→INR rate: ₹${inrRate}`);

            // Re-broadcast with updated INR rate
            if (priceCache.size > 0) {
                broadcast({
                    type: 'price_update',
                    data: getCacheAsArray(),
                    inrRate,
                    timestamp: lastUpdateTime,
                });
            }
        } else {
            console.error('[Forex] ✗ Unexpected response shape:', JSON.stringify(data).slice(0, 200));
        }
    } catch (err) {
        console.error(`[Forex] ✗ Failed to fetch rate: ${err.message}`);
        console.error('[Forex]   Using cached rate: ₹' + inrRate);
    }
}

// ─── OUR WEBSOCKET SERVER (for browser clients) ─────────────

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log(`[WS] Browser client connected — total: ${wss.clients.size}`);

    // Immediately send cached prices + INR rate
    if (priceCache.size > 0) {
        ws.send(JSON.stringify({
            type: 'price_update',
            data: getCacheAsArray(),
            inrRate,
            timestamp: lastUpdateTime,
        }));
    }

    ws.on('close', () => {
        console.log(`[WS] Browser client disconnected — total: ${wss.clients.size}`);
    });

    ws.on('error', (err) => {
        console.error('[WS] Client error:', err.message);
    });
});

/**
 * Broadcast a message to ALL connected browser clients.
 */
function broadcast(message) {
    const payload = JSON.stringify(message);
    let sent = 0;

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
            sent++;
        }
    });

    return sent;
}

/**
 * Convert the priceCache Map into a sorted array for the client.
 * Each coin includes both USD and INR prices (INR computed server-side).
 */
function getCacheAsArray() {
    return SYMBOLS.map(s => {
        const cached = priceCache.get(s.id);
        if (!cached) {
            return {
                id: s.id, name: s.name, symbol: s.symbol,
                price_usd: null, price_inr: null,
                change_24h: null,
                high_24h: null, low_24h: null,
                high_24h_inr: null, low_24h_inr: null,
                volume: null,
            };
        }

        return {
            ...cached,
            // Server-side INR conversion
            price_inr: cached.price_usd != null ? cached.price_usd * inrRate : null,
            high_24h_inr: cached.high_24h != null ? cached.high_24h * inrRate : null,
            low_24h_inr: cached.low_24h != null ? cached.low_24h * inrRate : null,
        };
    });
}

// ─── BINANCE UPSTREAM WEBSOCKET ─────────────────────────────

let binanceWs = null;
let reconnectTimer = null;

/**
 * Connect to Binance's combined WebSocket stream.
 */
function connectToBinance() {
    const url = `${BINANCE_WS_BASE}?streams=${STREAM_NAMES.join('/')}`;
    console.log(`[Binance] Connecting to: ${url}`);

    binanceWs = new WebSocket(url);

    binanceWs.on('open', () => {
        console.log('[Binance] ✓ Connected to Binance WebSocket streams');
        console.log(`[Binance]   Tracking: ${SYMBOLS.map(s => s.symbol).join(', ')}`);

        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
    });

    binanceWs.on('message', (raw) => {
        try {
            const msg = JSON.parse(raw.toString());

            if (!msg.data || !msg.stream) return;

            const ticker = msg.data;
            const streamSymbol = msg.stream.split('@')[0];

            const meta = SYMBOLS.find(s => s.id === streamSymbol);
            if (!meta) return;

            // Store USD prices in cache
            const priceData = {
                id: meta.id,
                name: meta.name,
                symbol: meta.symbol,
                price_usd: parseFloat(ticker.c),
                change_24h: parseFloat(ticker.P),
                high_24h: parseFloat(ticker.h),
                low_24h: parseFloat(ticker.l),
                volume: parseFloat(ticker.q),
            };

            priceCache.set(streamSymbol, priceData);
            lastUpdateTime = new Date().toISOString();

            // Schedule a throttled broadcast (max once per second)
            scheduleBroadcast();

        } catch (err) {
            console.error('[Binance] Failed to parse message:', err.message);
        }
    });

    binanceWs.on('close', (code, reason) => {
        console.warn(`[Binance] ✗ Disconnected (code: ${code}, reason: ${reason || 'none'})`);
        scheduleReconnect();
    });

    binanceWs.on('error', (err) => {
        console.error(`[Binance] ✗ Error: ${err.message}`);
    });

    binanceWs.on('ping', () => {
        binanceWs.pong();
    });
}

function scheduleReconnect() {
    if (reconnectTimer) return;

    const delayMs = 5000;
    console.log(`[Binance] Reconnecting in ${delayMs / 1000}s...`);

    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectToBinance();
    }, delayMs);
}

// ─── START EVERYTHING ───────────────────────────────────────

server.listen(PORT, async () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   SATMIX Crypto Price Server (Binance + INR)   ║');
    console.log(`║   HTTP + WebSocket running on port ${PORT}          ║`);
    console.log('║                                                  ║');
    console.log('║   → Open http://localhost:8080 in your browser   ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');

    // 1. Fetch INR rate immediately, then every 5 minutes
    await fetchForexRate();
    setInterval(fetchForexRate, FOREX_POLL_INTERVAL);

    // 2. Connect to Binance
    connectToBinance();
});

// ─── GRACEFUL SHUTDOWN ──────────────────────────────────────

process.on('SIGINT', () => {
    console.log('\n[Server] Shutting down gracefully...');

    if (binanceWs) {
        binanceWs.close(1000, 'Server shutting down');
    }
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
    }

    wss.clients.forEach((client) => {
        client.close(1001, 'Server shutting down');
    });

    server.close(() => {
        console.log('[Server] Goodbye.');
        process.exit(0);
    });
});
