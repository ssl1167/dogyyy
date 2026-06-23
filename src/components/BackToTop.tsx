import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <a className={`back-top ${visible ? 'visible' : ''}`} href="#top" aria-label="返回顶部">
      <ArrowUp aria-hidden="true" />
    </a>
  )
}
