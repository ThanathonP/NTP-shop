'use client'
import ReactECharts from 'echarts-for-react'
import { INK, MUTED } from '../chartTheme'

export default function DonutChart({
  data,
  valueFormatter,
  height = 280,
}: {
  data: { name: string, value: number, color: string }[]
  valueFormatter: (v: number) => string
  height?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <p className="text-sm text-[#888] py-16 text-center">ยังไม่มีข้อมูลในช่วงนี้</p>

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: INK,
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (p: any) => `${p.marker}${p.name}: <strong>${valueFormatter(p.value)}</strong> (${p.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      right: 4,
      top: 'center',
      textStyle: { color: MUTED, fontSize: 12 },
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['32%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        labelLine: { show: false },
        data: data.map((d) => ({ name: d.name, value: d.value, itemStyle: { color: d.color } })),
      },
    ],
  }
  return <ReactECharts option={option} style={{ height }} notMerge />
}
