import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({ children, className = '', delay = 0, duration = 500, direction = 'up', once = true }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        if (once) observer.disconnect()
      } else if (!once) {
        setVisible(false)
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    observer.observe(element)
    return () => observer.disconnect()
  }, [once])

  return <div ref={ref} className={`motion-reveal motion-reveal-${direction} ${visible ? 'motion-reveal-visible' : ''} ${className}`} style={{ '--motion-delay': `${delay}ms`, '--motion-duration': `${duration}ms` }}>{children}</div>
}
