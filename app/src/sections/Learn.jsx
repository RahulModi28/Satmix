import { Bitcoin, Wallet, ShieldCheck, LineChart, BookOpen, Globe, Clock, Award } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import './Learn.css'

const COURSES = [
    {
        icon: Bitcoin,
        title: 'Crypto Kya Hai?',
        language: 'Hindi + English',
        duration: '10 min',
        reward: '50 SAT Points',
        description: 'Understand what cryptocurrency is, how blockchain works, and why it matters for India.',
        level: 'Beginner',
    },
    {
        icon: Wallet,
        title: 'Your First Bitcoin',
        language: 'English',
        duration: '8 min',
        reward: '30 SAT Points',
        description: 'Step-by-step guide to buying your first Bitcoin on Satmix using UPI.',
        level: 'Beginner',
    },
    {
        icon: ShieldCheck,
        title: 'Crypto Safety 101',
        language: 'Hindi + English',
        duration: '12 min',
        reward: '40 SAT Points',
        description: 'Learn how to secure your crypto, avoid scams, and understand wallet safety.',
        level: 'Beginner',
    },
    {
        icon: LineChart,
        title: 'Reading Charts',
        language: 'English',
        duration: '15 min',
        reward: '60 SAT Points',
        description: 'Master candlestick charts, support/resistance, and basic trading indicators.',
        level: 'Intermediate',
    },
]

export default function Learn() {
    return (
        <section className="learn section" id="learn">
            <div className="container">
                <ScrollReveal>
                    <div className="badge">
                        <BookOpen size={14} /> Learn & Earn
                    </div>
                    <h2 className="section-title">
                        Learn Crypto, <span className="gradient-text">Earn Rewards</span>
                    </h2>
                    <p className="section-subtitle">
                        Complete bite-sized courses and earn SAT Points. No prior knowledge needed — start in Hindi or English.
                    </p>
                </ScrollReveal>

                <div className="learn__grid">
                    {COURSES.map((course, i) => {
                        const Icon = course.icon
                        return (
                            <ScrollReveal delay={i * 100} key={i}>
                                <div className="card learn__card">
                                    <div className="learn__card-top">
                                        <span className="learn__icon-wrap">
                                            <Icon size={24} />
                                        </span>
                                        <span className={`learn__level learn__level--${course.level.toLowerCase()}`}>
                                            {course.level}
                                        </span>
                                    </div>
                                    <h3 className="learn__title">{course.title}</h3>
                                    <p className="learn__desc">{course.description}</p>
                                    <div className="learn__meta">
                                        <span><Globe size={14} /> {course.language}</span>
                                        <span><Clock size={14} /> {course.duration}</span>
                                        <span><Award size={14} /> {course.reward}</span>
                                    </div>
                                </div>
                            </ScrollReveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
