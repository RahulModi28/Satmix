import { MessageCircle, User } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import AnimatedCounter from '../components/AnimatedCounter'
import './Testimonials.css'

const REVIEWS = [
    {
        name: 'Priya Sharma',
        location: 'Mumbai',
        color: '#F59E0B',
        text: 'Bought ₹500 of Bitcoin using Google Pay in literally 30 seconds. This is what crypto in India should feel like!',
        role: 'Engineering Student',
    },
    {
        name: 'Arjun Patel',
        location: 'Ahmedabad',
        color: '#8B5CF6',
        text: 'After the WazirX incident, I was skeptical. But Satmix\'s Proof of Reserves and PMLA compliance won me over.',
        role: 'Small Business Owner',
    },
    {
        name: 'Deepika Nair',
        location: 'Kochi',
        color: '#10B981',
        text: 'The Learn & Earn feature is amazing. I earned 200 SAT Points just by learning about blockchain in Malayalam!',
        role: 'College Student',
    },
    {
        name: 'Rajesh Kumar',
        location: 'Delhi',
        color: '#06B6D4',
        text: 'KYC under 3 minutes was not a joke. Aadhaar + PAN verified via DigiLocker and I was trading in no time.',
        role: 'Freelance Developer',
    },
]

const STATS = [
    { value: 50, suffix: 'K+', label: 'Waitlist Signups' },
    { value: 0, prefix: '₹', suffix: '', label: 'Deposit Fees', display: '₹0' },
    { value: 0.1, suffix: '%', label: 'Trading Fee' },
    { value: 3, prefix: '< ', suffix: ' min', label: 'Average KYC' },
]

export default function Testimonials() {
    return (
        <section className="testimonials section" id="testimonials">
            <div className="container">
                <ScrollReveal>
                    <div className="badge">
                        <MessageCircle size={14} /> Community Love
                    </div>
                    <h2 className="section-title">
                        What Early Users <span className="gradient-text">Are Saying</span>
                    </h2>
                    <p className="section-subtitle">
                        Real feedback from our beta testers across India.
                    </p>
                </ScrollReveal>

                <div className="test__grid">
                    {REVIEWS.map((review, i) => (
                        <ScrollReveal delay={i * 100} key={i}>
                            <div className="card test__card">
                                <div className="test__quote">"</div>
                                <p className="test__text">{review.text}</p>
                                <div className="test__author">
                                    <span className="test__avatar" style={{ background: `${review.color}20`, color: review.color, borderColor: `${review.color}30` }}>
                                        <User size={20} />
                                    </span>
                                    <div>
                                        <div className="test__name">{review.name}</div>
                                        <div className="test__meta">{review.role} · {review.location}</div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Stats row with animated counters */}
                <ScrollReveal delay={300}>
                    <div className="test__stats">
                        {STATS.map((stat, i) => (
                            <div className="test__stat" key={i}>
                                <span className="test__stat-val">
                                    {stat.display ? stat.display : (
                                        <AnimatedCounter
                                            end={stat.value}
                                            prefix={stat.prefix || ''}
                                            suffix={stat.suffix || ''}
                                        />
                                    )}
                                </span>
                                <span className="test__stat-lbl">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
