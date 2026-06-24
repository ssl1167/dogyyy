import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { CHART_THEME, tealHeat } from './chartTheme'
import { useChartSize } from './useChartSize'
import { useScrollAnimation } from './useScrollAnimation'

interface BoroughTop20Data {
  boroughs: string[]
  names: string[]
  matrix: number[][]
}

export default function BoroughTop20Chart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<BoroughTop20Data | null>(null)
  const { containerRef, width, height } = useChartSize({ aspectRatio: 2.1, minHeight: 300 })
  const { isVisible } = useScrollAnimation(0.15, containerRef)

  useEffect(() => {
    fetch('/data/boroughTop20Data.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current || width < 1 || !isVisible) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const padding = { top: 52, right: 20, bottom: 72, left: 76 }
    const rows = data.boroughs.length
    const cols = data.names.length
    const cellWidth = (width - padding.left - padding.right) / cols
    const cellHeight = (height - padding.top - padding.bottom) / rows
    const maxValue = d3.max(data.matrix.flat()) ?? 10

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
      .attr('width', Math.max(0, cellWidth - 2))
      .attr('height', Math.max(0, cellHeight - 3))
      .attr('fill', i => {
        const row = Math.floor(i / cols)
        const col = i % cols
        return tealHeat(data.matrix[row][col] / maxValue)
      })
      .attr('rx', 2)
      .attr('stroke', CHART_THEME.white)
      .attr('stroke-width', 1)
      .attr('transform', `scale(0)`)
      .attr('transform-origin', `${cellWidth / 2} ${cellHeight / 2}`)
      .transition()
      .delay((_d, i) => i * 20)
      .duration(500)
      .ease(d3.easeBackOut)
      .attr('transform', `scale(1)`)

    const showLabels = cellWidth >= 28
    if (showLabels) {
      cells.append('text')
        .attr('x', (cellWidth - 2) / 2)
        .attr('y', (cellHeight - 3) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', Math.min(9, cellWidth * 0.28))
        .attr('fill', i => {
          const row = Math.floor(i / cols)
          const col = i % cols
          return data.matrix[row][col] > maxValue * 0.6 ? CHART_THEME.white : CHART_THEME.ink
        })
        .text(i => {
          const row = Math.floor(i / cols)
          const col = i % cols
          return data.matrix[row][col].toFixed(1)
        })
    }

    g.selectAll('text.row-label')
      .data(data.boroughs)
      .join('text')
      .attr('class', 'row-label')
      .attr('x', padding.left - 8)
      .attr('y', (_d, i) => padding.top + i * cellHeight + cellHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('font-weight', '600')
      .attr('fill', CHART_THEME.ink)
      .text(d => d)

    g.selectAll('text.col-label')
      .data(data.names)
      .join('text')
      .attr('class', 'col-label')
      .attr('x', (_d, i) => padding.left + i * cellWidth + cellWidth / 2)
      .attr('y', padding.top - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', Math.min(10, cellWidth * 0.32))
      .attr('fill', CHART_THEME.muted)
      .attr('transform', (_d, i) => {
        const x = padding.left + i * cellWidth + cellWidth / 2
        return `rotate(-45, ${x}, ${padding.top - 8})`
      })
      .text(d => d)

    const legendWidth = Math.min(180, width * 0.35)
    const legendX = width - padding.right - legendWidth
    const legendY = height - 16
    const gradientId = 'boroughTop20Legend'

    const legendGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%')

    legendGradient.append('stop').attr('offset', '0%').attr('stop-color', tealHeat(0))
    legendGradient.append('stop').attr('offset', '100%').attr('stop-color', tealHeat(1))

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
      .text(`${maxValue.toFixed(1)}%`)

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)

    cells
      .on('mouseenter', function (event, i) {
        const row = Math.floor(i / cols)
        const col = i % cols
        d3.select(this).select('rect').attr('stroke', CHART_THEME.ink).attr('stroke-width', 2)
        tooltip.transition().duration(200).style('opacity', 0.95)
        tooltip.html(`
          <div><strong>${data.boroughs[row]}</strong></div>
          <div>名字：${data.names[col]}</div>
          <div>占比：${data.matrix[row][col].toFixed(2)}%</div>
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })
      .on('mouseleave', function () {
        d3.select(this).select('rect').attr('stroke', CHART_THEME.white).attr('stroke-width', 1)
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
