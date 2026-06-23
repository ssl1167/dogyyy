import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { applyAxisStyle, CHART_THEME } from './chartTheme'
import { useChartSize } from './useChartSize'
import { useScrollAnimation } from './useScrollAnimation'

interface GenderBiasData {
  names: string[]
  values: number[]
  totals: number[]
  female_shares: number[]
  female_counts: number[]
  male_counts: number[]
}

export default function GenderBiasChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<GenderBiasData | null>(null)
  const chartHeight = data ? Math.max(420, data.names.length * 22 + 100) : 450
  const { containerRef, width, height } = useChartSize({ height: chartHeight })
  const { isVisible } = useScrollAnimation(0.15, containerRef)

  useEffect(() => {
    fetch('/data/genderBiasData.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current || width < 1 || !isVisible) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const padding = { top: 36, right: 48, bottom: 56, left: 88 }
    const xExtent = Math.max(2.5, ...data.values.map(Math.abs)) * 1.05

    const xScale = d3.scaleLinear()
      .domain([-xExtent, xExtent])
      .range([padding.left, width - padding.right])

    const yScale = d3.scaleBand()
      .domain(data.names)
      .range([padding.top, height - padding.bottom])
      .padding(0.28)

    const maxTotal = d3.max(data.totals) ?? 1
    const g = svg.append('g')

    data.names.forEach((name, i) => {
      const value = data.values[i]
      const y = yScale(name)! + yScale.bandwidth() / 2
      const color = value > 0 ? CHART_THEME.brick : CHART_THEME.teal

      const line = g.append('line')
        .attr('x1', xScale(0))
        .attr('x2', xScale(0))
        .attr('y1', y)
        .attr('y2', y)
        .attr('stroke', color)
        .attr('stroke-width', 2.4)
        .attr('stroke-opacity', 0.85)

      line.transition()
        .delay(i * 40)
        .duration(700)
        .ease(d3.easeCubicOut)
        .attr('x2', xScale(value))

      g.append('circle')
        .attr('cx', xScale(0))
        .attr('cy', y)
        .attr('r', 0)
        .attr('fill', color)
        .attr('stroke', CHART_THEME.white)
        .attr('stroke-width', 1.2)
        .transition()
        .delay(i * 40 + 400)
        .duration(400)
        .ease(d3.easeBackOut)
        .attr('cx', xScale(value))
        .attr('r', 4 + (data.totals[i] / maxTotal) * 10)
    })

    g.selectAll('text.name')
      .data(data.names)
      .join('text')
      .attr('class', 'name')
      .attr('x', padding.left - 10)
      .attr('y', d => yScale(d)! + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('fill', CHART_THEME.ink)
      .text(d => d)

    g.append('line')
      .attr('x1', xScale(0))
      .attr('y1', padding.top)
      .attr('x2', xScale(0))
      .attr('y2', height - padding.bottom)
      .attr('stroke', CHART_THEME.ink)
      .attr('stroke-width', 1)

    g.append('text')
      .attr('x', padding.left)
      .attr('y', padding.top - 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('font-weight', '700')
      .attr('fill', CHART_THEME.teal)
      .text('雄性偏向')

    g.append('text')
      .attr('x', width - padding.right)
      .attr('y', padding.top - 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('font-weight', '700')
      .attr('fill', CHART_THEME.brick)
      .text('雌性偏向')

    const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d => d3.format('.1f')(d as number))
    const axisG = g.append('g')
      .attr('transform', `translate(0, ${height - padding.bottom})`)
      .call(xAxis)
    applyAxisStyle(axisG)

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height - 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', CHART_THEME.muted)
      .text('性别偏向 log₂(雌性记录数 / 雄性记录数)')

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)

    g.selectAll('circle')
      .on('mouseenter', function (event, _d) {
        const i = g.selectAll('circle').nodes().indexOf(this)
        const name = data.names[i]
        d3.select(this).attr('stroke-width', 2.5)
        const femaleShare = (data.female_shares[i] * 100).toFixed(1)
        tooltip.transition().duration(200).style('opacity', 0.95)
        tooltip.html(`
          <div><strong>${name}</strong></div>
          <div>偏向：${data.values[i] > 0 ? '雌性' : '雄性'} (${data.values[i].toFixed(2)})</div>
          <div>雌性占比：${femaleShare}%</div>
          <div>雌性：${data.female_counts[i].toLocaleString()} · 雄性：${data.male_counts[i].toLocaleString()}</div>
          <div>总计：${data.totals[i].toLocaleString()} 条记录</div>
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke-width', 1.2)
        tooltip.transition().duration(200).style('opacity', 0)
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })

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
