import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }) {
    const ref = useRef(null)
    const [count, setCount] = useState(0)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true)
                    observer.unobserve(el)
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return

        const numericEnd = parseFloat(String(end).replace(/[^0-9.]/g, ''))
        if (isNaN(numericEnd)) {
            setCount(end)
            return
        }

        const startTime = performance.now()
        const isFloat = String(end).includes('.')

        function animate(currentTime) {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = eased * numericEnd

            setCount(isFloat ? current.toFixed(1) : Math.floor(current))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [started, end, duration])

    return (
        <span ref={ref}>
            {prefix}{count}{suffix}
        </span>
    )
}
