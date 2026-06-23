import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navigation } from '../content/article'

export function ChapterNav() {
  const [active, setActive] = useState('intro')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-25% 0px -60%', threshold: [0, 0.1, 0.4] },
    )
    navigation.forEach(({ id }) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [])

  const activeLabel = navigation.find((item) => item.id === active)?.label ?? navigation[0].label

  return (
    <nav className="chapter-nav" aria-label="章节导航">
      <a className="nav-brand" href="#top" aria-label="返回页面顶部">NYC / DOG NAMES</a>
      <span className="current-chapter" aria-live="polite">{activeLabel}</span>
      <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="chapter-menu" onClick={() => setOpen(!open)}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        <span className="sr-only">{open ? '关闭章节菜单' : '打开章节菜单'}</span>
      </button>
      <div id="chapter-menu" className={`nav-links ${open ? 'is-open' : ''}`}>
        {navigation.map((item) => (
          <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
