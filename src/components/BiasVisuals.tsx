import { useState } from 'react'
import { figures } from '../content/article'
import { FigureCard } from './ImageLightbox'

// --- 数据层：丰富数据以支持更高级的展示 ---

const GENDER_DATA = {
  female: {
    label: '偏雌性 (Female)',
    color: '#ad5e85a9', // 粉色系
    names: [
      { id: 'Princess', score: 98 },
      { id: 'Stella', score: 85 },
      { id: 'Daisy', score: 82 },
      { id: 'Bella', score: 90 }
    ]
  },
  male: {
    label: '偏雄性 (Male)',
    color: '#6081b7cb', // 蓝色系
    names: [
      { id: 'Buddy', score: 88 },
      { id: 'Zeus', score: 95 },
      { id: 'Max', score: 99 },
      { id: 'Diesel', score: 92 }
    ]
  }
}

const SIZE_DATA: Record<string, { desc: string; heat: number[] }> = {
  Coco: { 
    desc: '在超小型/小型犬中呈现出极高热度，常让人联想到精致与小巧。', 
    heat: [95, 80, 20, 5, 2] // [超小型, 小型, 中型, 大型, 超大型] 的热度值
  },
  Diesel: { 
    desc: '充满力量感与工业感，在大型猛犬中红得发紫。', 
    heat: [2, 5, 30, 85, 95] 
  },
  Apollo: { 
    desc: '带有强烈的神话色彩与威严感，主要集中在中大型犬。', 
    heat: [5, 15, 60, 90, 75] 
  },
  Max: { 
    desc: '名字自带“最大”之意，几乎是超大型犬的专属代名词。', 
    heat: [0, 2, 15, 75, 100] 
  },
}

const SIZE_LABELS = ['超小', '小', '中', '大', '超大']

// --- 组件层 ---

export function GenderBiasVisual() {
  const [side, setSide] = useState<'female' | 'male'>('female')
  const currentData = GENDER_DATA[side]

  return (
    <div className="bias-visual-container" style={{ margin: '2rem 0', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
      <style>{`
        .bias-toggle button:hover { color: #1a1a1a !important; }
        .bias-toggle button { color: #1a1a1a; }
      `}</style>
      
      {/* 头部控制区 */}
      <div className="bias-toggle" role="group" aria-label="高亮性别偏向名字" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          type="button" 
          aria-pressed={side === 'female'} 
          onClick={() => setSide('female')}
          style={{ padding: '0.5rem 1rem', border: `2px solid ${side === 'female' ? GENDER_DATA.female.color : '#e2e8f0'}`, borderRadius: '8px', background: side === 'female' ? '#fdf2f8' : 'white', cursor: 'pointer', transition: 'all 0.2s', color: '#1a1a1a' }}
        >
          ♀️ 雌性高频名
        </button>
        <button 
          type="button" 
          aria-pressed={side === 'male'} 
          onClick={() => setSide('male')}
          style={{ padding: '0.5rem 1rem', border: `2px solid ${side === 'male' ? GENDER_DATA.male.color : '#e2e8f0'}`, borderRadius: '8px', background: side === 'male' ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s', color: '#1a1a1a' }}
        >
          ♂️ 雄性高频名
        </button>
      </div>

      {/* 数据可视化展示区 */}
      <div className="name-bars" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {currentData.names.map((item) => (
          <div key={item.id} className="name-bar-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: '80px', fontWeight: 'bold' }}>{item.id}</span>
            <div className="bar-track" style={{ flex: 1, height: '24px', backgroundColor: '#e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <div 
                className="bar-fill" 
                style={{ 
                  width: `${item.score}%`, 
                  height: '100%', 
                  backgroundColor: currentData.color, 
                  transition: 'width 0.5s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '0.5rem',
                  color: 'white',
                  fontSize: '0.8rem'
                }}
              >
                偏向度 {item.score}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <FigureCard figure={figures.genderBias} />
    </div>
  )
}

export function SizeNameHeatmap() {
  const [active, setActive] = useState('Coco')
  const currentHeat = SIZE_DATA[active].heat

  return (
    <div className="size-visual-container" style={{ margin: '2rem 0', padding: '1.5rem', backgroundColor: '#fdfbf7', borderRadius: '12px' }}>
      
      {/* 名字选择区 */}
      <div className="heatmap-controls" role="group" aria-label="查看名字与体型关联" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {Object.keys(SIZE_DATA).map((name) => (
          <button 
            key={name} 
            type="button" 
            aria-pressed={active === name} 
            onMouseEnter={() => setActive(name)} 
            onFocus={() => setActive(name)} 
            onClick={() => setActive(name)}
            style={{ 
              padding: '0.5rem 1.5rem', 
              borderRadius: '99px', 
              border: 'none',
              backgroundColor: active === name ? '#334155' : '#e2e8f0',
              color: active === name ? 'white' : '#475569',
              cursor: 'pointer',
              fontWeight: active === name ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            {name}
          </button>
        ))}
      </div>


      {/* 文案解读 */}
      <p className="tooltip-panel" role="status" style={{ fontSize: '1rem', lineHeight: '1.6', color: '#334155' }}>
        <strong>{active}</strong>：{SIZE_DATA[active].desc} 
      </p>

      {/* 保留原本的图表作为支撑 */}
      <FigureCard figure={figures.sizeHeatmap} />
    </div>
  )
}