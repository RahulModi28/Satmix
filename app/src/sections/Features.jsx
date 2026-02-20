import { Zap, ScanFace, BadgePercent, Languages, ArrowLeftRight, GraduationCap } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import './Features.css'

const FEATURES = [
    {
        icon: Zap,
        title: 'UPI-Native Trading',
        description: 'Buy crypto directly with UPI in under 60 seconds. No bank transfers, no waiting. Just scan and buy.',
        variant: '',
    },
    {
        icon: ScanFace,
        title: 'Lightning KYC',
        description: 'Aadhaar + PAN based eKYC completed in under 3 minutes via DigiLocker. Start trading instantly.',
        variant: '--purple',
    },
    {
        icon: BadgePercent,
        title: 'Lowest Fees',
        description: '0.1% trading fee, ₹0 deposit fee. The most competitive fee structure in the Indian market.',
        variant: '--green',
    },
    {
        icon: Languages,
        title: 'Vernacular Support',
        description: 'Full app experience in Hindi, Tamil, Telugu, Bengali & Kannada. Crypto in your language.',
        variant: '--cyan',
    },
    {
        icon: ArrowLeftRight,
        title: 'P2P Trading',
        description: 'Trade USDT ↔ INR directly with other users. Escrow-protected, dispute-resolved, zero risk.',
        variant: '--purple',
    },
    {
        icon: GraduationCap,
        title: 'Learn & Earn',
        description: 'Complete bite-sized crypto courses and earn SAT Points. Education meets rewards.',
        variant: '',
    },
]

export default function Features() {
    return (
        <section className="features section" id="features">
            <div className="container">
                <ScrollReveal>
                    <div className="badge">
                        <Zap size={14} /> Why Satmix?
                    </div>
                    <h2 className="section-title">
                        Everything You Need to{' '}
                        <span className="gradient-text">Start Trading</span>
                    </h2>
                    <p className="section-subtitle">
                        From your first ₹100 buy to advanced P2P trades, Satmix is designed to make crypto simple, safe, and accessible for every Indian.
                    </p>
                </ScrollReveal>

                <div className="features__grid">
                    {FEATURES.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                            <ScrollReveal delay={i * 100} key={i}>
                                <div className="card features__card">
                                    <div className={`icon-container${feature.variant ? ' icon-container' + feature.variant : ''}`}>
                                        <Icon />
                                    </div>
                                    <h3 className="features__title">{feature.title}</h3>
                                    <p className="features__desc">{feature.description}</p>
                                </div>
                            </ScrollReveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
