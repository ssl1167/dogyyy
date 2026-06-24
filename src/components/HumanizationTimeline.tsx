import { useState } from 'react'
import { figures } from '../content/article'
import { FigureCard } from './ImageLightbox'

const timelineStages = [
  {
    from: 0,
    tag: 'SPOT',
    label: '传统动物名',
    quote: '“你是一只动物，你要看家护院。”',
    detail: '过去，人们给狗起名"Spot"，名字直指它的动物身份。',
  },
  {
    from: 18,
    tag: 'FIDO',
    label: '简短好喊',
    quote: '当时的狗名同样简短好喊：Spot（斑点）、Fido（阿黄）、Fluffy（毛毛）、Rover（流浪者）。',
    detail: '这些名字强调外貌、动作或传统动物属性。',
  },
  {
    from: 36,
    tag: '转折',
    label: '动物名衰落',
    quote: '然而今天，这些强调动物特征的名字在纽约街头已经很难见到了。',
    detail: '一场无声的命名革命，正在时间轴上发生。',
  },
  {
    from: 54,
    tag: '2000+',
    label: '人类名兴起',
    quote: 'Bella 和 Charlie 这类纯正的人类名如同海啸般拔地而起。',
    detail: '2000年之后，名字的语义开始明显向家庭与人的世界靠近。',
  },
  {
    from: 72,
    tag: 'OLIVER',
    label: '幼儿园名册',
    quote: '取而代之的，是你在幼儿园点名册上能看到的那批名字：Oliver、Chloe、Charlie、Leo。',
    detail: '宠物名字与人类名字之间的边界，变得越来越模糊。',
  },
  {
    from: 88,
    tag: '家人',
    label: '家庭成员',
    quote: '“你是我们家的一员。”',
    detail: '人们把给人类婴儿准备的名字，郑重其事地赋予给小狗。',
  },
]

export function HumanizationTimeline() {
  const [time, setTime] = useState(32)
  const current = [...timelineStages].reverse().find((stage) => time >= stage.from) ?? timelineStages[0]
  const modern = current.from >= 54

  return (
    <div className="humanization-timeline">
      <FigureCard figure={figures.phonetics} />
      <div className="time-slider-card">
        <label htmlFor="name-time">拖动滑块，观察语义的转变</label>
        <input id="name-time" type="range" min="0" max="100" value={time} onChange={(event) => setTime(Number(event.target.value))} aria-valuetext={`${current.label}：${current.quote}`} />
        <div className="slider-labels"><span>过去 / 传统动物名</span><span>2000年之后 / 人类名字</span></div>
        <div className="slider-stages" aria-hidden="true">
          {timelineStages.map((stage) => <span key={stage.tag} className={current.tag === stage.tag ? 'active' : ''}>{stage.label}</span>)}
        </div>
        <div className={`mirror-quote ${modern ? 'modern' : 'past'}`} aria-live="polite">
          <span>{current.tag}</span>
          <blockquote className={current.quote.length > 34 ? 'compact' : ''}>{current.quote}</blockquote>
          <p>{current.detail}</p>
        </div>
      </div>
      <FigureCard figure={figures.humanizationHistory} />
    </div>
  )
}
