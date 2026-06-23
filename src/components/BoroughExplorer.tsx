import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { boroughs } from '../content/article'

const shapes: Record<string, string> = {
  'bronx': 'M164 20 L244 21 L246 83 L178 97 L153 62 Z',
  'manhattan': 'M130 47 L154 41 L165 151 L145 187 L126 138 Z',
  'queens': 'M172 101 L270 84 L327 139 L291 217 L202 189 L173 151 Z',
  'brooklyn': 'M169 157 L215 191 L286 222 L241 289 L143 274 L121 211 Z',
  'staten-island': 'M35 218 L106 200 L124 267 L91 305 L31 282 Z',
}

export function BoroughExplorer() {
  const [activeId, setActiveId] = useState<(typeof boroughs)[number]['id']>('manhattan')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const active = boroughs.find((borough) => borough.id === activeId) ?? boroughs[0]
  const hovered = boroughs.find((borough) => borough.id === hoveredId)

  return (
    <div className="borough-explorer" id="borough-explorer">
      <div className="borough-map-and-tabs">
        <div className="borough-map-wrap">
          <svg className="borough-map" viewBox="0 0 360 330" role="img" aria-labelledby="borough-map-title borough-map-desc">
            <title id="borough-map-title">纽约五大区命名文化探索地图</title>
            <desc id="borough-map-desc">选择曼哈顿、布朗克斯、史泰登岛、布鲁克林或皇后区查看文档中对应的命名画像。</desc>
            <path className="river-line" d="M13 186 C80 145 84 56 119 16 M111 318 C133 274 142 227 134 181 M265 19 C263 57 280 85 342 112" />
            {boroughs.map((borough) => (
              <path
                key={borough.id}
                d={shapes[borough.id]}
                className={activeId === borough.id ? 'active' : ''}
                role="button"
                tabIndex={0}
                aria-label={`${borough.name}：${borough.metric}`}
                onMouseEnter={() => setHoveredId(borough.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(borough.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => setActiveId(borough.id)}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveId(borough.id) } }}
              />
            ))}
            {hovered && <text x="180" y="320" textAnchor="middle">{hovered.name} / {hovered.english}</text>}
          </svg>
        </div>
        <div className="borough-tabs" role="group" aria-label="选择纽约行政区">
          {boroughs.map((borough) => <button key={borough.id} type="button" aria-pressed={activeId === borough.id} onClick={() => setActiveId(borough.id)}>{borough.name}</button>)}
        </div>
      </div>
      <div className="borough-panel" aria-live="polite">
        {/* <p className="visual-label">SELECTED BOROUGH</p> */}
        <h3>{active.name}<small>{active.english}</small></h3>
        <strong>{active.metric}</strong>
        <p>{active.summary}</p>
        {/* <div className="name-chips" aria-label="代表名字">{active.names.map((name) => <span key={name}>{name}</span>)}</div> */}
      </div>
    </div>
  )
}
