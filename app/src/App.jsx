import { useState } from 'react'
import './App.css'
import { CryptoPricesProvider } from './context/CryptoPricesContext'
import ParticleBackground from './components/ParticleBackground'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Ticker from './sections/Ticker'
import Features from './sections/Features'
import HowItWorks from './sections/HowItWorks'
import Trust from './sections/Trust'
import Comparison from './sections/Comparison'
import Markets from './sections/Markets'
import Referral from './sections/Referral'
import Learn from './sections/Learn'
import Testimonials from './sections/Testimonials'
import Waitlist from './sections/Waitlist'
import Footer from './components/Footer'
import Dashboard from './sections/Dashboard'
import Trading from './sections/Trading'

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing')
  const [currentTradingPair, setCurrentTradingPair] = useState('BTC')

  const goToTrading = (coin = 'BTC') => {
    setCurrentTradingPair(coin)
    setCurrentScreen('trading')
  }

  return (
    <CryptoPricesProvider>
      {currentScreen === 'landing' && (
        <div className="app">
          <ParticleBackground />
          <Navbar onLogin={() => setCurrentScreen('dashboard')} />
          <Hero onGetStarted={() => setCurrentScreen('dashboard')} />
          <Ticker />
          <Features />
          <HowItWorks />
          <Trust />
          <Comparison />
          <Markets onTrade={goToTrading} />
          <Referral />
          <Learn />
          <Testimonials />
          <Waitlist />
          <Footer />
        </div>
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard
          onBackToLanding={() => setCurrentScreen('landing')}
          onTrade={goToTrading}
        />
      )}
      {currentScreen === 'trading' && (
        <Trading
          initialCoin={currentTradingPair}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
    </CryptoPricesProvider>
  )
}

export default App
