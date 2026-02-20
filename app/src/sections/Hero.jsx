import { Rocket } from 'lucide-react'
import './Hero.css'

export default function Hero({ onGetStarted }) {
    return (
        <section className="hero" id="hero">
            {/* Background Effects */}
            <div className="hero__bg-glow hero__bg-glow--1"></div>
            <div className="hero__bg-glow hero__bg-glow--2"></div>
            <div className="hero__grid-overlay"></div>

            {/* Floating Coins */}
            <div className="hero__coins">
                <span className="hero__coin hero__coin--btc" aria-hidden="true">₿</span>
                <span className="hero__coin hero__coin--eth" aria-hidden="true">Ξ</span>
                <span className="hero__coin hero__coin--sol" aria-hidden="true">◎</span>
                <span className="hero__coin hero__coin--usdt" aria-hidden="true">₮</span>
            </div>

            <div className="container hero__content">
                <div className="badge hero__badge">🇮🇳 Made for India</div>

                <h1 className="hero__title">
                    Crypto as Easy as{' '}
                    <span className="gradient-text">UPI</span>
                </h1>

                <p className="hero__subtitle">
                    Buy &amp; sell crypto with UPI in under 60 seconds. Lightning-fast KYC,
                    lowest fees at <strong>0.1%</strong>, and full regulatory compliance.
                    Built for the next 100 million Indian investors.
                </p>

                <div className="hero__cta-group">
                    <a href="#" className="btn btn-cta" onClick={(e) => {
                        e.preventDefault()
                        onGetStarted?.()
                    }}>
                        <Rocket size={18} /> Get Started
                    </a>
                    <a href="#features" className="btn btn-secondary" onClick={(e) => {
                        e.preventDefault()
                        document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
                    }}>
                        Explore Features →
                    </a>
                </div>

                <div className="hero__stats">
                    <div className="hero__stat">
                        <span className="hero__stat-value">0.1%</span>
                        <span className="hero__stat-label">Trading Fee</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-value">&lt; 3 min</span>
                        <span className="hero__stat-label">KYC Time</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-value">₹0</span>
                        <span className="hero__stat-label">Deposit Fee</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
