'use client'
import { useState } from 'react'

export default function BarChart({
  data,
  color,
  formatValue,
  height = 120,
}: {
  data: { label: string, value: number }[]
  color: string
  formatValue: (v: number) => string
  height?: number
}) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="relative">
      {hover !== null && (
        <div
          className="absolute -top-9 -translate-x-1/2 bg-[#1A1A1A] text-white text-xs px-2.5 py-1.5 rounded whitespace-nowrap pointer-events-none z-10"
          style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}
        >
          <span className="font-medium">{formatValue(data[hover].value)}</span>
          <span className="text-white/50 ml-1.5">{data[hover].label}</span>
        </div>
      )}
      <div className="flex items-end gap-[2px]" style={{ height }}>
        {data.map((d, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            aria-label={`${d.label}: ${formatValue(d.value)}`}
            className="flex-1 h-full flex flex-col items-center justify-end group focus:outline-none"
          >
            <div
              className="w-full max-w-[20px] rounded-t-[4px] transition-opacity group-hover:opacity-70 group-focus:opacity-70"
              style={{
                height: d.value > 0 ? `${Math.max(3, (d.value / max) * height)}px` : 0,
                backgroundColor: color,
              }}
            />
          </button>
        ))}
      </div>
      <div className="flex gap-[2px] mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-[#888]">
            {i % Math.ceil(data.length / 7) === 0 ? d.label : ''}
          </div>
        ))}
      </div>
    </div>
  )
}
