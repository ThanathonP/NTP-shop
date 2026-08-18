'use client'
import ReactECharts from 'echarts-for-react'
import { INK, MUTED } from '../chartTheme'

export default function RankBar({
  data,
  color,
  valueFormatter,
  height,
}: {
  data: { name: string, value: number }[]
  color: string
  valueFormatter: (v: number) => string
  height?: number
}) {
  if (data.length === 0) return <p className="text-sm text-[#888] py-16 text-center">ยังไม่มีข้อมูลในช่วงนี้</p>

  // เรียงน้อย→มาก เพราะแกน category ของ echarts วาดจากล่างขึ้นบน ต้องการให้อันดับ 1 อยู่บนสุด
  const sorted = [...data].sort((a, b) => a.value - b.value)
  const option = {
    grid: { left: 8, right: 56, top: 8, bottom: 8, containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: sorted.map((d) => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: INK, fontSize: 12, width: 130, overflow: 'truncate' },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: INK,
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (p: any) => `${p.name}: <strong>${valueFormatter(p.value)}</strong>`,
    },
    series: [
      {
        type: 'bar',
        data: sorted.map((d) => d.value),
        itemStyle: { color, borderRadius: [0, 4, 4, 0] },
        barMaxWidth: 20,
        label: { show: true, position: 'right', color: MUTED, fontSize: 11, formatter: (p: any) => valueFormatter(p.value) },
      },
    ],
  }
  return <ReactECharts option={option} style={{ height: height || Math.max(160, sorted.length * 42) }} notMerge />
}
