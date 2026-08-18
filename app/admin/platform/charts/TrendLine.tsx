'use client'
import ReactECharts from 'echarts-for-react'
import { INK, MUTED, GRIDLINE } from '../chartTheme'

export default function TrendLine({
  data,
  color,
  valueFormatter,
  height = 260,
}: {
  data: { label: string, value: number }[]
  color: string
  valueFormatter: (v: number) => string
  height?: number
}) {
  const option = {
    grid: { left: 8, right: 16, top: 16, bottom: 28, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.label),
      boundaryGap: false,
      axisLine: { lineStyle: { color: GRIDLINE } },
      axisTick: { show: false },
      axisLabel: { color: MUTED, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: GRIDLINE } },
      axisLabel: { color: MUTED, fontSize: 11 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: INK,
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params: any) => {
        const p = params[0]
        return `<strong>${valueFormatter(p.value)}</strong><br/><span style="opacity:.6">${p.axisValue}</span>`
      },
    },
    series: [
      {
        type: 'line',
        data: data.map((d) => d.value),
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color },
        itemStyle: { color, borderWidth: 2, borderColor: '#fff' },
        areaStyle: { color, opacity: 0.08 },
      },
    ],
  }
  return <ReactECharts option={option} style={{ height }} notMerge />
}
