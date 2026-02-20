import { Hexagon, Twitter, Send, MessageCircle, Instagram } from 'lucide-react'
import './Footer.css'

const FOOTER_LINKS = {
    Product: ['Features', 'Markets', 'P2P Trading', 'Learn & Earn', 'Mobile App'],
    Company: ['About Us', 'Careers', 'Blog', 'Press Kit', 'Contact'],
    Legal: ['Terms of Service', 'Privacy Policy', 'AML/KYC Policy', 'Risk Disclosure', 'Cookie Policy'],
    Support: ['Help Center', 'API Docs', 'System Status', 'Bug Bounty', 'Community'],
}

const SOCIAL_LINKS = [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Send, label: 'Telegram', href: '#' },
    { icon: MessageCircle, label: 'Discord', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
]

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__top">
                    <div className="footer__brand">
                        <div className="footer__logo">
                            <span className="footer__logo-icon">
                                <Hexagon size={20} />
                            </span>
                            <span className="footer__logo-text">Satmix</span>
                        </div>
                        <p className="footer__tagline">
                            India's most trusted crypto exchange. Buy, sell, and trade crypto with UPI.
                        </p>
                        <div className="footer__social">
                            {SOCIAL_LINKS.map((social) => {
                                const Icon = social.icon
                                return (
                                    <a href={social.href} className="footer__social-link" aria-label={social.label} key={social.label}>
                                        <Icon size={18} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                        <div className="footer__col" key={category}>
                            <h4 className="footer__col-title">{category}</h4>
                            <ul className="footer__list">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="footer__link">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="footer__bottom">
                    <p>© 2025 Satmix Exchange. All rights reserved.</p>
                    <p className="footer__reg">
                        Registered with FIU-IND | Crypto assets are subject to market risk | Not regulated by SEBI or RBI
                    </p>
                </div>
            </div>
        </footer>
    )
}
