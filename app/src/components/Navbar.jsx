import { useState, useEffect } from 'react'
import { Hexagon } from 'lucide-react'
import './Navbar.css'

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Markets', href: '#markets' },
    { label: 'Rewards', href: '#referral' },
    { label: 'Learn', href: '#learn' },
]

export default function Navbar({ onLogin }) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleNavClick = (e, href) => {
        e.preventDefault()
        setMobileOpen(false)
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <nav className={`navbar glass ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__inner container">
                {/* Logo */}
                <a href="#" className="navbar__logo">
                    <span className="navbar__logo-icon">
                        <Hexagon size={22} />
                    </span>
                    <span className="navbar__logo-text">Sat<span className="gradient-text">mix</span></span>
                </a>

                {/* Desktop Links */}
                <ul className="navbar__links">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* CTA Buttons */}
                <div className="navbar__cta-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button className="btn btn-secondary navbar__cta" onClick={() => onLogin?.()}>
                        Login
                    </button>
                    <a href="#waitlist" className="btn btn-primary navbar__cta" onClick={(e) => handleNavClick(e, '#waitlist')}>
                        Join Waitlist
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`navbar__hamburger ${mobileOpen ? 'active' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar__mobile ${mobileOpen ? 'open' : ''}`}>
                <ul>
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="#waitlist" className="btn btn-primary" onClick={(e) => handleNavClick(e, '#waitlist')} style={{ marginTop: '1rem', width: '100%' }}>
                            Join Waitlist
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
