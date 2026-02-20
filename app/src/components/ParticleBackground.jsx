import { useEffect, useRef } from 'react'
import './ParticleBackground.css'

const PARTICLE_COUNT = 50

export default function ParticleBackground() {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let animationId
        let particles = []

        function resize() {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        function createParticle() {
            const colors = [
                'rgba(245, 158, 11, ',  // gold
                'rgba(139, 92, 246, ',  // purple
                'rgba(6, 182, 212, ',   // cyan
            ]
            const colorBase = colors[Math.floor(Math.random() * colors.length)]
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.1,
                colorBase,
                pulseSpeed: Math.random() * 0.02 + 0.005,
                pulseOffset: Math.random() * Math.PI * 2,
            }
        }

        function init() {
            resize()
            particles = Array.from({ length: PARTICLE_COUNT }, createParticle)
        }

        function draw(time) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (const p of particles) {
                // Parallax based on mouse
                const parallaxX = (mouseRef.current.x - canvas.width / 2) * 0.01
                const parallaxY = (mouseRef.current.y - canvas.height / 2) * 0.01

                p.x += p.speedX + parallaxX * p.size * 0.1
                p.y += p.speedY + parallaxY * p.size * 0.1

                // Wrap around
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                // Pulsing opacity
                const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7
                const opacity = p.opacity * pulse

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `${p.colorBase}${opacity})`
                ctx.fill()

                // Subtle glow for larger particles
                if (p.size > 1.2) {
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
                    ctx.fillStyle = `${p.colorBase}${opacity * 0.15})`
                    ctx.fill()
                }
            }

            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.08
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            animationId = requestAnimationFrame(draw)
        }

        function handleMouse(e) {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', handleMouse)

        init()
        animationId = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouse)
        }
    }, [])

    return <canvas ref={canvasRef} className="particle-bg" />
}
