import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { CHART_THEME, warmHeat } from './chartTheme'
import { useChartSize } from './useChartSize'
import { useScrollAnimation } from './useScrollAnimation'

interface BoroughCategoryData {
  boroughs: string[]
  categories: string[]
  category_labels: Record<string, string>
  matrix: number[][]
}

export default function BoroughCategoryChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<BoroughCategoryData | null>(null)
  const { containerRef, width, height } = useChartSize({ aspectRatio: 2.1, minHeight: 300 })
  const { isVisible } = useScrollAnimation(0.15, containerRef)

  useEffect(() => {
    fetch('/data/boroughCategoryData.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current || width < 1 || !isVisible) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const padding = { top: 44, right: 24, bottom: 52, left: 92 }
    const rows = data.boroughs.length
    const cols = data.categories.length
    const cellWidth = (width - padding.left - padding.right) / cols
    const cellHeight = (height - padding.top - padding.bottom) / rows
    const maxValue = d3.max(data.matrix.flat()) ?? 70

    const g = svg.append('g')

    const cells = g.selectAll('g.cell')
      .data(d3.range(rows * cols))
      .join('g')
      .attr('class', 'cell')
      .attr('transform', i => {
        const row = Math.floor(i / cols)
        const col = i % cols
        return `translate(${padding.left + col * cellWidth}, ${padding.top + row * cellHeight})`
      })

    cells.append('rect')
      .attr('width', Math.max(0, cellWidth - 4))
      .attr('height', Math.max(0, cellHeight - 4))
      .attr('fill', i => {
        const row = Math.floor(i / cols)
        const col = i % cols
        return warmHeat(data.matrix[row][col] / maxValue)
      })
      .attr('rx', 3)
      .attr('stroke', CHART_THEME.white)
      .attr('stroke-width', 2)
      .attr('transform', `scale(0)`)
      .attr('transform-origin', `${cellWidth / 2} ${cellHeight / 2}`)
      .transition()
      .delay((_d, i) => i * 30)
      .duration(500)
      .ease(d3.easeBackOut)
      .attr('transform', `scale(1)`)

    cells.append('text')
      .attr('x', (cellWidth - 4) / 2)
      .attr('y', (cellHeight - 4) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', '600')
      .attr('fill', i => {
        const row = Math.floor(i / cols)
        const col = i % cols
        return data.matrix[row][col] > maxValue * 0.55 ? CHART_THEME.white : CHART_THEME.ink
      })
      .text(i => {
        const row = Math.floor(i / cols)
        const col = i % cols
        return `${data.matrix[row][col].toFixed(1)}%`
      })

    g.selectAll('text.row-label')
      .data(data.boroughs)
      .join('text')
      .attr('class', 'row-label')
      .attr('x', padding.left - 10)
      .attr('y', (_d, i) => padding.top + i * cellHeight + cellHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('font-weight', '600')
      .attr('fill', CHART_THEME.ink)
      .text(d => d)

    g.selectAll('text.col-label')
      .data(data.categories)
      .join('text')
      .attr('class', 'col-label')
      .attr('x', (_d, i) => padding.left + i * cellWidth + cellWidth / 2)
      .attr('y', padding.top - 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', '600')
      .attr('fill', CHART_THEME.ink)
      .text(d => data.category_labels[d])

    const legendWidth = Math.min(180, width * 0.35)
    const legendX = width - padding.right - legendWidth
    const legendY = height - 18
    const gradientId = 'boroughCategoryLegend'

    const legendGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%')

    legendGradient.append('stop').attr('offset', '0%').attr('stop-color', warmHeat(0))
    legendGradient.append('stop').attr('offset', '100%').attr('stop-color', warmHeat(1))

    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY - 8)
      .attr('width', legendWidth)
      .attr('height', 10)
      .attr('fill', `url(#${gradientId})`)
      .attr('rx', 2)

    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY - 12)
      .attr('font-size', 10)
      .attr('fill', CHART_THEME.muted)
      .text('0%')

    svg.append('text')
      .attr('x', legendX + legendWidth)
      .attr('y', legendY - 12)
      .attr('text-anchor', 'end')
      .attr('font-size', 10)
      .attr('fill', CHART_THEME.muted)
      .text(`${maxValue.toFixed(0)}%`)

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)

    cells
      .on('mouseenter', function (event, i) {
        const row = Math.floor(i / cols)
        const col = i % cols
        d3.select(this).select('rect').attr('stroke', CHART_THEME.ink).attr('stroke-width', 2.5)
        tooltip.transition().duration(200).style('opacity', 0.95)
        tooltip.html(`
          <div><strong>${data.boroughs[row]}</strong></div>
          <div>${data.category_labels[data.categories[col]]}</div>
          <div>占比：${data.matrix[row][col].toFixed(1)}%</div>
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })
      .on('mouseleave', function () {
        d3.select(this).select('rect').attr('stroke', CHART_THEME.white).attr('stroke-width', 2)
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
