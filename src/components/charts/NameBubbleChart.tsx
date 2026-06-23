import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { bubbleColor, CHART_THEME } from './chartTheme'
import { useChartSize } from './useChartSize'
import { useScrollAnimation } from './useScrollAnimation'

interface BubbleNode {
  name: string
  count: number
  rank: number
  x?: number
  y?: number
}

interface BubbleData {
  bubbles: BubbleNode[]
  metadata: { min_count: number; max_count: number; total: number }
}

export default function NameBubbleChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { containerRef, width, height } = useChartSize({ aspectRatio: 2.8, minHeight: 650 })
  const [data, setData] = useState<BubbleData | null>(null)
  const [hoveredName, setHoveredName] = useState<string | null>(null)
  const { isVisible } = useScrollAnimation(0.15, containerRef)

  useEffect(() => {
    fetch('/data/bubbleData.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current || width < 1 || !isVisible) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const padding = Math.max(40, width * 0.05)
    const bubbles: BubbleNode[] = data.bubbles.map(b => ({ ...b }))

    const radiusScale = d3.scaleSqrt()
      .domain([data.metadata.min_count, data.metadata.max_count])
      .range([Math.max(14, width * 0.02), Math.max(32, width * 0.065)])

    const simulation = d3.forceSimulation<BubbleNode>(bubbles)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<BubbleNode>(d => radiusScale(d.count) + 3))
      .force('charge', d3.forceManyBody().strength(10))
      .force('bounds', () => {
        bubbles.forEach(d => {
          const r = radiusScale(d.count)
          if (d.x !== undefined && d.y !== undefined) {
            d.x = Math.max(r + padding, Math.min(width - r - padding, d.x))
            d.y = Math.max(r + padding, Math.min(height - r - padding, d.y))
          }
        })
      })
      .stop()

    for (let i = 0; i < 150; i++) simulation.tick()

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)

    const g = svg.append('g')

    const bubblesGroup = g.selectAll('g')
      .data(bubbles)
      .join('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .style('cursor', 'default')
      .on('mouseenter', function (event, d) {
        setHoveredName(d.name)
        d3.select(this).select('circle').transition().duration(200)
          .attr('r', radiusScale(d.count) + 4)
        bubblesGroup.selectAll('circle')
          .transition()
          .duration(300)
          .ease(d3.easeElasticOut)
          .attr('fill-opacity', (bubble: unknown) => ((bubble as BubbleNode).name === d.name ? 0.88 : 0.15))
        tooltip.transition().duration(200).style('opacity', 0.95)
        tooltip.html(`
          <div><strong>${d.name}</strong></div>
          <div>排名：第 ${d.rank} 位</div>
          <div>数量：${d.count.toLocaleString()} 条记录</div>
          <div>占比：${((d.count / data.metadata.total) * 100).toFixed(1)}%</div>
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })
      .on('mouseleave', function (_event, d) {
        setHoveredName(null)
        d3.select(this).select('circle').transition().duration(200)
          .attr('r', radiusScale(d.count))
        bubblesGroup.selectAll('circle')
          .transition()
          .duration(300)
          .attr('fill-opacity', 0.88)
        tooltip.transition().duration(200).style('opacity', 0)
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })

    bubblesGroup.append('circle')
      .attr('r', 0)
      .attr('fill', d => bubbleColor(d.rank, data.bubbles.length))
      .attr('fill-opacity', d => hoveredName === null ? 0.88 : (hoveredName === d.name ? 0.88 : 0.15))
      .attr('stroke', CHART_THEME.white)
      .attr('stroke-width', 1.5)
      .transition()
      .duration(800)
      .delay((d, i) => i * 30)
      .ease(d3.easeElasticOut)
      .attr('r', d => radiusScale(d.count))

    bubblesGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.15em')
      .attr('font-size', 0)
      .attr('font-weight', '700')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .text(d => d.name)
      .transition()
      .duration(600)
      .delay((_d, i) => i * 30 + 200)
      .attr('font-size', d => {
        const r = radiusScale(d.count)
        const maxFontSize = Math.max(8, r * 0.32)
        return Math.min(maxFontSize, d.name.length > 6 ? maxFontSize * 0.7 : maxFontSize)
      })

    bubblesGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.1em')
      .attr('font-size', 0)
      .attr('font-weight', '600')
      .attr('fill', 'rgba(255,255,255,0.92)')
      .attr('pointer-events', 'none')
      .text(d => d.count.toLocaleString())
      .transition()
      .duration(600)
      .delay((_d, i) => i * 30 + 200)
      .attr('font-size', d => {
        const r = radiusScale(d.count)
        const countStr = d.count.toLocaleString()
        const maxFontSize = Math.max(7, r * 0.2)
        return Math.min(maxFontSize, countStr.length > 4 ? maxFontSize * 0.7 : maxFontSize)
      })

    bubblesGroup.transition()
      .duration(800)
      .delay((d, i) => i * 30)
      .ease(d3.easeElasticOut)
      .attr('transform', d => `translate(${d.x ?? 0}, ${d.y ?? 0})`)

    return () => {
      tooltip.remove()
    }
  }, [data, width, height, isVisible])

  if (!data) {
    return (
      <div ref={containerRef} className="chart-container">
        <div className="chart-loading">加载中...</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`chart-container ${isVisible ? 'chart-scroll-visible' : 'chart-scroll-hidden'}`}>
      <svg
        ref={svgRef}
        className="chart-svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  )
}
