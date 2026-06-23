import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { applyAxisStyle, CHART_THEME, humanizationColor } from './chartTheme'
import { useChartSize } from './useChartSize'
import { useScrollAnimation } from './useScrollAnimation'

interface HumanizationData {
  names: string[]
  years: number[]
  series: Array<{ name: string; data: number[] }>
}

const LEGEND_ROW_HEIGHT = 22
const LEGEND_ROWS = 2

export default function HumanizationChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<HumanizationData | null>(null)
  const { containerRef, width, height } = useChartSize({ minHeight: 400, aspectRatio: 1.65 })
  const { isVisible } = useScrollAnimation(0.15, containerRef)

  useEffect(() => {
    fetch('/data/humanizationData.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current || width < 1 || !isVisible) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const legendHeight = LEGEND_ROWS * LEGEND_ROW_HEIGHT + 16
    const padding = {
      top: 32,
      right: 20,
      bottom: 48 + legendHeight,
      left: 54,
    }

    const minYear = d3.min(data.years) ?? 1910
    const maxYear = d3.max(data.years) ?? 2025

    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([padding.left, width - padding.right])

    const stackInput = data.years.map((year, i) => {
      const row: Record<string, number> = { year }
      data.names.forEach(name => {
        const series = data.series.find(s => s.name === name)
        row[name] = series?.data[i] ?? 0
      })
      return row
    })

    const stack = d3.stack<Record<string, number>>()
      .keys(data.names)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone)

    const stackedData = stack(stackInput)

    const maxStackTotal = d3.max(
      stackedData,
      layer => d3.max(layer, point => point[1]),
    ) ?? 1

    const yScale = d3.scaleLinear()
      .domain([0, maxStackTotal * 1.06])
      .range([height - padding.bottom, padding.top])

    const g = svg.append('g')

    const area = d3.area<d3.SeriesPoint<Record<string, number>>>()
      .x((_d, i) => xScale(data.years[i]))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveMonotoneX)

    const clipId = 'humanization-clip'
    svg.append('defs')
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('x', padding.left)
      .attr('y', height - padding.bottom)
      .attr('width', width - padding.left - padding.right)
      .attr('height', 0)

    const areaPaths: Record<string, d3.Selection<SVGPathElement, unknown, null, undefined>> = {}
    stackedData.forEach((layer, i) => {
      const name = data.names[i]
      const color = humanizationColor(name, i)
      const path = g.append('path')
        .datum(layer)
        .attr('class', `area-path area-path-${i}`)
        .attr('fill', color)
        .attr('stroke', CHART_THEME.white)
        .attr('stroke-width', 0.5)
        .attr('clip-path', `url(#${clipId})`)
        .attr('d', area)
        .style('cursor', 'pointer')
      areaPaths[name] = path as d3.Selection<SVGPathElement, unknown, null, undefined>
    })

    d3.select(`#${clipId} rect`)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr('y', padding.top)
      .attr('height', height - padding.bottom - padding.top)

    const xAxis = d3.axisBottom(xScale)
      .ticks(width < 560 ? 5 : 7)
      .tickFormat(d => `${d}`)

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => d3.format('~s')(d as number))

    const xAxisG = g.append('g')
      .attr('transform', `translate(0, ${height - padding.bottom})`)
      .call(xAxis)
    applyAxisStyle(xAxisG)

    const yAxisG = g.append('g')
      .attr('transform', `translate(${padding.left}, 0)`)
      .call(yAxis)
    applyAxisStyle(yAxisG)

    g.append('text')
      .attr('x', padding.left - 8)
      .attr('y', padding.top - 10)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('fill', CHART_THEME.muted)
      .text('纽约州同名婴儿数')

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height - legendHeight - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', CHART_THEME.muted)
      .text('出生年份')

    const legendTop = height - legendHeight + 8
    const legendItemWidth = Math.min(88, (width - padding.left - padding.right) / 4)
    const legendBlockWidth = legendItemWidth * 4
    const legendStartX = padding.left + (width - padding.left - padding.right - legendBlockWidth) / 2

    data.names.forEach((name, i) => {
      const row = Math.floor(i / 4)
      const col = i % 4
      const lx = legendStartX + col * legendItemWidth
      const ly = legendTop + row * LEGEND_ROW_HEIGHT

      const legendGroup = g.append('g')
        .attr('class', 'legend-item')
        .style('cursor', 'pointer')

      legendGroup.append('rect')
        .attr('x', lx)
        .attr('y', ly)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', humanizationColor(name, i))
        .attr('rx', 2)
        .attr('class', `legend-swatch legend-swatch-${i}`)

      legendGroup.append('text')
        .attr('x', lx + 14)
        .attr('y', ly + 9)
        .attr('font-size', 10)
        .attr('fill', CHART_THEME.ink)
        .attr('class', `legend-text legend-text-${i}`)
        .text(name)

      legendGroup
        .on('mouseenter', () => highlightArea(name))
        .on('mouseleave', () => highlightArea(null))
    })

    const bisect = d3.bisector((year: number) => year).left

    const highlightArea = (name: string | null) => {
      Object.entries(areaPaths).forEach(([areaName, path]) => {
        if (name === null) {
          path.transition().duration(200)
            .attr('fill-opacity', 0.85)
            .attr('stroke-width', 0.5)
        } else if (areaName === name) {
          path.transition().duration(150)
            .attr('fill-opacity', 1)
            .attr('stroke-width', 2)
        } else {
          path.transition().duration(150)
            .attr('fill-opacity', 0.35)
            .attr('stroke-width', 0.5)
        }
      })
    }

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)

    const overlay = g.append('rect')
      .attr('x', padding.left)
      .attr('y', padding.top)
      .attr('width', width - padding.left - padding.right)
      .attr('height', height - padding.top - padding.bottom)
      .attr('fill', 'transparent')

    const focus = g.append('g').style('display', 'none')
    focus.append('line')
      .attr('stroke', CHART_THEME.ink)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4')
      .attr('y1', padding.top)
      .attr('y2', height - padding.bottom)

    overlay
      .on('mouseenter', () => {
        focus.style('display', null)
        tooltip.transition().duration(150).style('opacity', 0.95)
      })
      .on('mouseleave', () => {
        focus.style('display', 'none')
        highlightArea(null)
        tooltip.transition().duration(200).style('opacity', 0)
      })
      .on('mousemove', function (event) {
        const [mouseX] = d3.pointer(event, this)
        const x0 = xScale.invert(mouseX)
        const i = bisect(data.years, x0, 1)
        const d0 = data.years[i - 1]
        const d1 = data.years[i]
        const year = !d1 || (x0 - d0 > d1 - x0) ? d1 ?? d0 : d0
        const yearIndex = data.years.indexOf(year)

        focus.select('line')
          .attr('x1', xScale(year))
          .attr('x2', xScale(year))

        let maxVal = 0
        let maxName = ''
        let html = `<div><strong>${year} 年</strong></div>`
        data.series.forEach(s => {
          const val = yearIndex >= 0 ? s.data[yearIndex] : 0
          if (val > maxVal) {
            maxVal = val
            maxName = s.name
          }
          html += `<div>${s.name}: ${val.toLocaleString()}</div>`
        })
        tooltip.html(html)
          .style('left', `${event.pageX + 12}px`)
          .style('top', `${event.pageY - 10}px`)

        highlightArea(maxName)
      })

    return () => {
      tooltip.remove()
    }
  }, [data, width, height, isVisible])

  if (!data) {
    return (
      <div ref={containerRef} className="chart-container chart-container--humanization">
        <div className="chart-loading">加载中...</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`chart-container chart-container--humanization ${isVisible ? 'chart-scroll-visible' : 'chart-scroll-hidden'}`}>
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
