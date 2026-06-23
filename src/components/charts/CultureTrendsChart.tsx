import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { applyAxisStyle, CHART_THEME, CULTURE_COLORS } from './chartTheme'
import { useChartSize } from './useChartSize'
import { useScrollAnimation } from './useScrollAnimation'

interface CultureTrendsData {
  names: string[]
  events: Record<string, { year: number; event: string }>
  years: number[]
  series: Array<{ name: string; data: Array<{ issue_year: number; pct: number }> }>
}

export default function CultureTrendsChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<CultureTrendsData | null>(null)
  const { containerRef, width, height } = useChartSize({ minHeight: 380, aspectRatio: 1.8 })
  const { isVisible } = useScrollAnimation(0.15, containerRef)

  useEffect(() => {
    fetch('/data/cultureTrendsData.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current || width < 1 || !isVisible) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const padding = { top: 28, right: 20, bottom: 36, left: 20 }
    const gap = 16
    const cols = 2
    const rows = 2
    const panelWidth = (width - padding.left - padding.right - gap) / cols
    const panelHeight = (height - padding.top - padding.bottom - gap) / rows
    const innerPad = { top: 28, right: 14, bottom: 36, left: 44 }

    const xDomain: [number, number] = [2014, 2018]
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)

    data.series.forEach((series, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const originX = padding.left + col * (panelWidth + gap)
      const originY = padding.top + row * (panelHeight + gap)
      const color = CULTURE_COLORS[series.name] ?? CHART_THEME.purple
      const plotWidth = panelWidth - innerPad.left - innerPad.right
      const plotHeight = panelHeight - innerPad.top - innerPad.bottom
      const maxPct = (d3.max(series.data, d => d.pct) ?? 1) * 1.12

      const panel = svg.append('g')
        .attr('transform', `translate(${originX}, ${originY})`)

      panel.append('rect')
        .attr('width', panelWidth)
        .attr('height', panelHeight)
        .attr('fill', CHART_THEME.white)
        .attr('stroke', CHART_THEME.line)
        .attr('rx', 6)

      panel.append('text')
        .attr('x', innerPad.left)
        .attr('y', 18)
        .attr('font-size', 14)
        .attr('font-weight', '700')
        .attr('fill', color)
        .text(series.name)

      const xScale = d3.scaleLinear()
        .domain(xDomain)
        .range([innerPad.left, innerPad.left + plotWidth])

      const yScale = d3.scaleLinear()
        .domain([0, maxPct])
        .range([innerPad.top + plotHeight, innerPad.top])

      const line = d3.line<{ issue_year: number; pct: number }>()
        .x(d => xScale(d.issue_year))
        .y(d => yScale(d.pct))
        .curve(d3.curveMonotoneX)

      const path = panel.append('path')
        .datum(series.data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.8)
        .attr('d', line)

      const totalLength = (path.node() as SVGPathElement)?.getTotalLength() ?? 0
      path
        .attr('stroke-dasharray', totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .delay(index * 200)
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0)

      panel.selectAll('circle')
        .data(series.data)
        .join('circle')
        .attr('cx', d => xScale(d.issue_year))
        .attr('cy', d => yScale(d.pct))
        .attr('r', 0)
        .attr('fill', color)
        .attr('stroke', CHART_THEME.white)
        .attr('stroke-width', 1.5)
        .transition()
        .delay((_d, i) => index * 200 + 800 + i * 80)
        .duration(300)
        .ease(d3.easeBackOut)
        .attr('r', 4)

      const event = data.events[series.name]
      if (event) {
        panel.append('line')
          .attr('x1', xScale(event.year))
          .attr('x2', xScale(event.year))
          .attr('y1', innerPad.top)
          .attr('y2', innerPad.top + plotHeight)
          .attr('stroke', CHART_THEME.muted)
          .attr('stroke-dasharray', '4,4')
          .attr('stroke-opacity', 0.7)

        panel.append('text')
          .attr('x', xScale(event.year) + 4)
          .attr('y', innerPad.top + 12)
          .attr('font-size', 9)
          .attr('fill', CHART_THEME.muted)
          .text(event.event)
      }

      const xAxis = d3.axisBottom(xScale)
        .tickValues([2014, 2015, 2016, 2017, 2018])
        .tickFormat(d => `${d}`)

      const yAxis = d3.axisLeft(yScale).ticks(4)

      const xAxisG = panel.append('g')
        .attr('transform', `translate(0, ${innerPad.top + plotHeight})`)
        .call(xAxis)
      applyAxisStyle(xAxisG)
      xAxisG.selectAll('text').attr('font-size', 10)

      const yAxisG = panel.append('g')
        .attr('transform', `translate(${innerPad.left}, 0)`)
        .call(yAxis)
      applyAxisStyle(yAxisG)
      yAxisG.selectAll('text').attr('font-size', 9)

      panel.append('text')
        .attr('x', 6)
        .attr('y', innerPad.top + plotHeight / 2)
        .attr('transform', `rotate(-90, 6, ${innerPad.top + plotHeight / 2})`)
        .attr('text-anchor', 'middle')
        .attr('font-size', 9)
        .attr('fill', CHART_THEME.muted)
        .text('占比 (‱)')

      panel.selectAll('circle')
        .on('mouseenter', function (event, d) {
          const point = d as { issue_year: number; pct: number }
          tooltip.transition().duration(200).style('opacity', 0.95)
          tooltip.html(`
            <div><strong>${series.name}</strong></div>
            <div>${point.issue_year} 年：${point.pct.toFixed(2)} ‱</div>
            ${event ? `<div>${event.year}：${event.event}</div>` : ''}
          `)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
        })
        .on('mouseleave', () => {
          tooltip.transition().duration(200).style('opacity', 0)
        })
        .on('mousemove', function (event) {
          tooltip
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
        })
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
