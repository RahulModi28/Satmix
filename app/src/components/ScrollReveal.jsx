import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({ children, delay = 0, className = '', threshold = 0.15, variant = 'up' }) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.unobserve(el)
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold])

    const variantClass = variant === 'scale' ? 'reveal--scale' : 'reveal'

    return (
        <div
            ref={ref}
            className={`${variantClass} ${visible ? 'visible' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}
