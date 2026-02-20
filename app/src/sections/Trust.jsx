import { ShieldCheck, Scale, Server, Lock, Shield, FileText } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import './Trust.css'

const TRUST_ITEMS = [
    {
        icon: ShieldCheck,
        title: 'Proof of Reserves',
        description: '1:1 asset reserves published monthly. Every rupee is backed. Full transparency, always.',
        variant: '',
    },
    {
        icon: Scale,
        title: 'PMLA Compliant',
        description: 'Registered with FIU-IND. Full AML/KYC compliance. 1% TDS auto-deducted as per Indian IT Act.',
        variant: '--purple',
    },
    {
        icon: Server,
        title: 'India Data Residency',
        description: 'All data stored on AWS Mumbai (ap-south-1). Your data never leaves India. Full data sovereignty.',
        variant: '--green',
    },
    {
        icon: Lock,
        title: 'Bank-Grade Security',
        description: '2FA mandatory for withdrawals. AES-256 encryption at rest, TLS 1.3 in transit. Cold wallet architecture.',
        variant: '--cyan',
    },
]

export default function Trust() {
    return (
        <section className="trust section" id="trust">
            <div className="container">
                <ScrollReveal>
                    <div className="badge">
                        <Shield size={14} /> Security First
                    </div>
                    <h2 className="section-title">
                        Built on <span className="gradient-text">Trust</span>
                    </h2>
                    <p className="section-subtitle">
                        In a post-WazirX era, trust isn't optional — it's foundational. Satmix is transparent, regulated, and secure from day one.
                    </p>
                </ScrollReveal>

                <div className="trust__grid">
                    {TRUST_ITEMS.map((item, i) => {
                        const Icon = item.icon
                        return (
                            <ScrollReveal delay={i * 100} key={i}>
                                <div className="trust__card">
                                    <div className={`icon-container${item.variant ? ' icon-container' + item.variant : ''}`}>
                                        <Icon />
                                    </div>
                                    <div className="trust__content">
                                        <h3 className="trust__title">{item.title}</h3>
                                        <p className="trust__desc">{item.description}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        )
                    })}
                </div>

                <ScrollReveal delay={400}>
                    <div className="trust__banner">
                        <div className="trust__banner-inner">
                            <span className="trust__banner-icon">
                                <FileText size={20} />
                            </span>
                            <div>
                                <strong>Regulatory Disclosure:</strong> Crypto is not legal tender in India. All crypto gains are taxed at 30%. Satmix provides P&L reports for ITR filing.
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
