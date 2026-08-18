'use client'
import { useState } from 'react'

export type Preset = 'today' | 'week' | 'month' | 'custom'
export type DateRange = { from: Date, to: Date, preset: Preset }

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function endOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}
function startOfWeek(d: Date) {
  const x = startOfDay(d)
  const day = x.getDay() // 0=Sun..6=Sat
  const diff = day === 0 ? 6 : day - 1 // จันทร์เป็นวันแรกของสัปดาห์
  x.setDate(x.getDate() - diff)
  return x
}
function startOfMonth(d: Date) {
  const x = startOfDay(d)
  x.setDate(1)
  return x
}

export function rangeForPreset(preset: Preset): DateRange {
  const now = new Date()
  if (preset === 'week') return { from: startOfWeek(now), to: endOfDay(now), preset }
  if (preset === 'month') return { from: startOfMonth(now), to: endOfDay(now), preset }
  return { from: startOfDay(now), to: endOfDay(now), preset: 'today' }
}

function toInputValue(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function DateRangeFilter({ value, onChange }: { value: DateRange, onChange: (r: DateRange) => void }) {
  const [customFrom, setCustomFrom] = useState(toInputValue(value.from))
  const [customTo, setCustomTo] = useState(toInputValue(value.to))

  const presets: { key: Preset, label: string }[] = [
    { key: 'today', label: 'วันนี้' },
    { key: 'week', label: 'สัปดาห์นี้' },
    { key: 'month', label: 'เดือนนี้' },
  ]

  const applyCustom = () => {
    const from = startOfDay(new Date(customFrom))
    const to = endOfDay(new Date(customTo))
    if (from > to) return
    onChange({ from, to, preset: 'custom' })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {presets.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(rangeForPreset(key))}
          className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
            value.preset === key
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'border-[#E8E4DF] text-[#888] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
          }`}
        >
          {label}
        </button>
      ))}

      <div className={`flex items-center gap-2 px-3 py-1.5 border ${value.preset === 'custom' ? 'border-[#1A1A1A]' : 'border-[#E8E4DF]'}`}>
        <input
          type="date"
          value={customFrom}
          onChange={(e) => setCustomFrom(e.target.value)}
          className="text-xs bg-transparent focus:outline-none"
          aria-label="วันที่เริ่มต้น"
        />
        <span className="text-[#888] text-xs">ถึง</span>
        <input
          type="date"
          value={customTo}
          onChange={(e) => setCustomTo(e.target.value)}
          className="text-xs bg-transparent focus:outline-none"
          aria-label="วันที่สิ้นสุด"
        />
        <button onClick={applyCustom} className="text-xs text-[#C8A882] hover:underline ml-1">ใช้ช่วงนี้</button>
      </div>

      <span className="text-xs text-[#888] ml-auto">
        {value.from.toLocaleDateString('th-TH', { dateStyle: 'medium' })} – {value.to.toLocaleDateString('th-TH', { dateStyle: 'medium' })}
      </span>
    </div>
  )
}
