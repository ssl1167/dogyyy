import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { CHART_THEME, tealHeat } from './chartTheme'
import { useChartSize } from './useChartSize'
import { useScrollAnimation } from './useScrollAnimation'

interface SyllablePoint {
  syllables: number
  percentage: number
}

interface PhoneticsData {
  syllables: {
    dog: SyllablePoint[]
    english?: SyllablePoint[]
  }
  endings: Array<{ letter: string; percentage: number }>
  first_last: {
    rows: string[]
    cols: string[]
    matrix: number[][]
  }
}

export default function PhoneticsChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<PhoneticsData | null>(null)
  const { containerRef, width, height } = useChartSize({ aspectRatio: 1.45, minHeight: 520 })
  const { isVisible } = useScrollAnimation(0.15, containerRef)

  useEffect(() => {
    fetch('/data/phoneticsData.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current || width < 1 || !isVisible) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const padding = { top: 24, right: 24, bottom: 20, left: 52 }
    const chartHeight = (height - padding.top - padding.bottom) / 3 - 8
    const plotWidth = width - padding.left - padding.right

    const dogSyllables = data.syllables.dog
    const englishSyllables = data.syllables.english ?? []

    const syllableLabels = dogSyllables.map(d => String(d.syllables))
    const syllablesScaleX = d3.scaleBand()
      .domain(syllableLabels)
      .range([0, plotWidth])
      .padding(0.25)

    const syllablesMax = Math.max(
      d3.max(dogSyllables, d => d.percentage) ?? 0,
      d3.max(englishSyllables, d => d.percentage) ?? 0,
      1,
    )

    const syllablesScaleY = d3.scaleLinear()
      .domain([0, syllablesMax * 1.08])
      .range([chartHeight - 24, 8])

    const g1 = svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`)

    g1.append('text')
      .attr('x', plotWidth / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', '700')
      .attr('fill', CHART_THEME.ink)
      .text('音节偏好对比')

    g1.selectAll('rect.dog')
      .data(dogSyllables)
      .join('rect')
      .attr('class', 'dog')
      .attr('x', d => syllablesScaleX(String(d.syllables))!)
      .attr('y', chartHeight - 24)
      .attr('width', syllablesScaleX.bandwidth())
      .attr('height', 0)
      .attr('fill', CHART_THEME.teal)
      .attr('rx', 3)
      .transition()
      .delay((_d, i) => i * 80)
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('y', d => syllablesScaleY(d.percentage))
      .attr('height', d => chartHeight - 24 - syllablesScaleY(d.percentage))

    if (englishSyllables.length > 0) {
      const englishLine = d3.line<SyllablePoint>()
        .x(d => (syllablesScaleX(String(d.syllables)) ?? 0) + syllablesScaleX.bandwidth() / 2)
        .y(d => syllablesScaleY(d.percentage))

      g1.append('path')
        .datum(englishSyllables)
        .attr('fill', 'none')
        .attr('stroke', CHART_THEME.muted)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,4')
        .attr('d', englishLine)

      g1.selectAll('circle.english')
        .data(englishSyllables)
        .join('circle')
        .attr('class', 'english')
        .attr('cx', d => (syllablesScaleX(String(d.syllables)) ?? 0) + syllablesScaleX.bandwidth() / 2)
        .attr('cy', d => syllablesScaleY(d.percentage))
        .attr('r', 3.5)
        .attr('fill', CHART_THEME.paper)
        .attr('stroke', CHART_THEME.muted)
        .attr('stroke-width', 1.5)
    }

    g1.selectAll('text.label')
      .data(dogSyllables)
      .join('text')
      .attr('class', 'label')
      .attr('x', d => (syllablesScaleX(String(d.syllables)) ?? 0) + syllablesScaleX.bandwidth() / 2)
      .attr('y', chartHeight - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', CHART_THEME.muted)
      .text(d => `${d.syllables}音节`)

    const legendY = 14
    g1.append('rect').attr('x', plotWidth - 150).attr('y', legendY - 8).attr('width', 10).attr('height', 10).attr('fill', CHART_THEME.teal)
    g1.append('text').attr('x', plotWidth - 134).attr('y', legendY).attr('font-size', 10).attr('fill', CHART_THEME.ink).text('纽约犬名')
    if (englishSyllables.length > 0) {
      g1.append('line').attr('x1', plotWidth - 72).attr('x2', plotWidth - 58).attr('y1', legendY - 3).attr('y2', legendY - 3)
        .attr('stroke', CHART_THEME.muted).attr('stroke-dasharray', '4,3')
      g1.append('text').attr('x', plotWidth - 52).attr('y', legendY).attr('font-size', 10).attr('fill', CHART_THEME.ink).text('英文基准')
    }

    const endingsData = data.endings.slice(0, 12)
    const endingsScaleX = d3.scaleBand()
      .domain(endingsData.map(d => d.letter))
      .range([0, plotWidth])
      .padding(0.2)
    const endingsMax = d3.max(endingsData, d => d.percentage) ?? 20
    const endingsScaleY = d3.scaleLinear()
      .domain([0, endingsMax * 1.08])
      .range([chartHeight - 24, 8])

    const g2 = svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top + chartHeight + 12})`)

    g2.append('text')
      .attr('x', plotWidth / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', '700')
      .attr('fill', CHART_THEME.ink)
      .text('高频结尾字母')

    g2.selectAll('rect')
      .data(endingsData)
      .join('rect')
      .attr('x', d => endingsScaleX(d.letter)!)
      .attr('y', chartHeight - 24)
      .attr('width', endingsScaleX.bandwidth())
      .attr('height', 0)
      .attr('fill', (_d, i) => d3.interpolateRgb(CHART_THEME.purple, CHART_THEME.brick)(i / Math.max(endingsData.length - 1, 1)))
      .attr('rx', 3)
      .transition()
      .delay((_d, i) => i * 60)
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('y', d => endingsScaleY(d.percentage))
      .attr('height', d => chartHeight - 24 - endingsScaleY(d.percentage))

    g2.selectAll('text.label')
      .data(endingsData)
      .join('text')
      .attr('class', 'label')
      .attr('x', d => (endingsScaleX(d.letter) ?? 0) + endingsScaleX.bandwidth() / 2)
      .attr('y', chartHeight - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('font-weight', '600')
      .attr('fill', CHART_THEME.ink)
      .text(d => d.letter)

    const flData = data.first_last
    const flRows = flData.rows.length
    const flCols = flData.cols.length
    const flCellWidth = plotWidth / flCols
    const flCellHeight = (chartHeight - 20) / flRows
    const flMax = d3.max(flData.matrix.flat()) ?? 5

    const g3 = svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top + (chartHeight + 12) * 2})`)

    g3.append('text')
      .attr('x', plotWidth / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', '700')
      .attr('fill', CHART_THEME.ink)
      .text('开头-结尾字母组合热度')

    const flCells = g3.selectAll('g.cell')
      .data(d3.range(flRows * flCols))
      .join('g')
      .attr('class', 'cell')
      .attr('transform', i => {
        const row = Math.floor(i / flCols)
        const col = i % flCols
        return `translate(${col * flCellWidth}, ${row * flCellHeight + 12})`
      })

    flCells.append('rect')
      .attr('width', Math.max(0, flCellWidth - 2))
      .attr('height', Math.max(0, flCellHeight - 2))
      .attr('fill', i => {
        const row = Math.floor(i / flCols)
        const col = i % flCols
        return tealHeat(flData.matrix[row][col] / flMax)
      })
      .attr('rx', 2)

    g3.selectAll('text.row-label')
      .data(flData.rows)
      .join('text')
      .attr('class', 'row-label')
      .attr('x', -6)
      .attr('y', (_d, i) => i * flCellHeight + flCellHeight / 2 + 12)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', 9)
      .attr('fill', CHART_THEME.muted)
      .text(d => d)

    g3.selectAll('text.col-label')
      .data(flData.cols)
      .join('text')
      .attr('class', 'col-label')
      .attr('x', (_d, i) => i * flCellWidth + flCellWidth / 2)
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9)
      .attr('fill', CHART_THEME.muted)
      .text(d => d)

    g3.append('text')
      .attr('x', plotWidth / 2)
      .attr('y', flRows * flCellHeight + 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', CHART_THEME.muted)
      .text('log(组合记录数+1)')
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
