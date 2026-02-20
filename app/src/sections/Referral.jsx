import { Gift, Coins, Star, Trophy } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import './Referral.css'

export default function Referral() {
    return (
        <section className="referral section" id="referral">
            <div className="container">
                <div className="referral__wrapper">
                    <ScrollReveal>
                        <div className="referral__content">
                            <div className="badge">
                                <Gift size={14} /> Rewards Program
                            </div>
                            <h2 className="referral__title">
                                Invite Friends,{' '}
                                <span className="gradient-text">Earn Together</span>
                            </h2>
                            <p className="referral__desc">
                                Share Satmix with your friends via WhatsApp, Instagram, or any platform.
                                When they sign up and complete KYC, you both earn <strong>SAT Points</strong>.
                            </p>

                            <div className="referral__perks">
                                <div className="referral__perk">
                                    <span className="referral__perk-icon">
                                        <Coins size={22} />
                                    </span>
                                    <div>
                                        <strong>20% Commission</strong>
                                        <p>Earn 20% of your referral's trading fees for their first 3 months.</p>
                                    </div>
                                </div>
                                <div className="referral__perk">
                                    <span className="referral__perk-icon referral__perk-icon--purple">
                                        <Star size={22} />
                                    </span>
                                    <div>
                                        <strong>SAT Points</strong>
                                        <p>Earn points on every trade and referral. Redeem for fee discounts and exclusive perks.</p>
                                    </div>
                                </div>
                                <div className="referral__perk">
                                    <span className="referral__perk-icon referral__perk-icon--green">
                                        <Trophy size={22} />
                                    </span>
                                    <div>
                                        <strong>Leaderboard Rewards</strong>
                                        <p>Top referrers get monthly cash prizes and exclusive Satmix merch.</p>
                                    </div>
                                </div>
                            </div>

                            <a href="#waitlist" className="btn btn-primary" onClick={(e) => {
                                e.preventDefault()
                                document.querySelector('#waitlist')?.scrollIntoView({ behavior: 'smooth' })
                            }}>
                                Start Referring →
                            </a>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <div className="referral__visual">
                            <div className="referral__card-mock">
                                <div className="referral__card-header-mock">Your Referral Dashboard</div>
                                <div className="referral__stat-row">
                                    <div className="referral__stat-item">
                                        <span className="referral__stat-num">12</span>
                                        <span className="referral__stat-lbl">Referrals</span>
                                    </div>
                                    <div className="referral__stat-item">
                                        <span className="referral__stat-num">₹2,450</span>
                                        <span className="referral__stat-lbl">Earned</span>
                                    </div>
                                    <div className="referral__stat-item">
                                        <span className="referral__stat-num">840</span>
                                        <span className="referral__stat-lbl">SAT Points</span>
                                    </div>
                                </div>
                                <div className="referral__code-mock">
                                    <span>Your Code:</span>
                                    <code>SATMIX-EARLY</code>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}
