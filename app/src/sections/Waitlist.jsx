import { useState } from 'react'
import { Rocket, PartyPopper, Lock } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import './Waitlist.css'

export default function Waitlist() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email.trim()) {
            setSubmitted(true)
            setEmail('')
        }
    }

    return (
        <section className="waitlist section" id="waitlist">
            <div className="container">
                <div className="waitlist__wrapper">
                    {/* Background effects */}
                    <div className="waitlist__glow waitlist__glow--1"></div>
                    <div className="waitlist__glow waitlist__glow--2"></div>

                    <ScrollReveal>
                        <div className="badge" style={{ position: 'relative' }}>
                            <Rocket size={14} /> Early Access
                        </div>
                        <h2 className="section-title" style={{ position: 'relative' }}>
                            Join the <span className="gradient-text">Waitlist</span>
                        </h2>
                        <p className="section-subtitle" style={{ position: 'relative' }}>
                            Be among the first to experience India's most trusted crypto exchange.
                            Early adopters get <strong style={{ color: 'var(--color-primary)' }}>3 months zero trading fees</strong>.
                        </p>
                    </ScrollReveal>

                    {!submitted ? (
                        <ScrollReveal delay={200}>
                            <form className="waitlist__form" onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    className="waitlist__input"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary waitlist__btn">
                                    <Rocket size={16} /> Join Now
                                </button>
                            </form>
                        </ScrollReveal>
                    ) : (
                        <div className="waitlist__success">
                            <span className="waitlist__success-icon">
                                <PartyPopper size={32} />
                            </span>
                            <h3>You're In!</h3>
                            <p>We'll notify you as soon as Satmix launches. Check your inbox for a confirmation.</p>
                        </div>
                    )}

                    <p className="waitlist__privacy" style={{ position: 'relative' }}>
                        <Lock size={14} /> No spam. Unsubscribe anytime. We respect your privacy.
                    </p>
                </div>
            </div>
        </section>
    )
}
