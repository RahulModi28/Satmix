import { UserPlus, Wallet, TrendingUp, Footprints } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import './HowItWorks.css'

const STEPS = [
    {
        number: '01',
        icon: UserPlus,
        title: 'Sign Up & KYC',
        description: 'Register with your phone number, verify via Aadhaar + PAN through DigiLocker. Done in under 3 minutes.',
    },
    {
        number: '02',
        icon: Wallet,
        title: 'Deposit via UPI',
        description: 'Add funds instantly using any UPI app — Google Pay, PhonePe, Paytm. Zero deposit fees.',
    },
    {
        number: '03',
        icon: TrendingUp,
        title: 'Start Trading',
        description: 'Buy Bitcoin, Ethereum, Solana & 50+ coins. Track your portfolio, earn rewards, and grow your wealth.',
    },
]

export default function HowItWorks() {
    return (
        <section className="how-it-works section" id="how-it-works">
            <div className="container">
                <ScrollReveal>
                    <div className="badge">
                        <Footprints size={14} /> Simple 3 Steps
                    </div>
                    <h2 className="section-title">
                        How <span className="gradient-text">Satmix</span> Works
                    </h2>
                    <p className="section-subtitle">
                        From signup to your first trade — it takes less than 5 minutes. No prior crypto experience needed.
                    </p>
                </ScrollReveal>

                <div className="hiw__steps">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <ScrollReveal delay={i * 150} key={i}>
                                <div className="hiw__step">
                                    <div className="hiw__number">{step.number}</div>
                                    <div className="hiw__icon-wrap">
                                        <Icon size={28} className="hiw__icon" />
                                    </div>
                                    <h3 className="hiw__title">{step.title}</h3>
                                    <p className="hiw__desc">{step.description}</p>
                                    {i < STEPS.length - 1 && <div className="hiw__connector" aria-hidden="true"></div>}
                                </div>
                            </ScrollReveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
