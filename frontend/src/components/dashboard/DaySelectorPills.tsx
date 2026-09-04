import React, { useState } from 'react'

export interface DayItem {
  day: string
  date: number | string
  isToday?: boolean
}

interface DaySelectorPillsProps {
  days?: DayItem[]
  selectedDay?: string
  onSelectDay?: (day: string) => void
  className?: string
}

const DEFAULT_DAYS: DayItem[] = [
  { day: 'Sun', date: 21 },
  { day: 'Mon', date: 22, isToday: true },
  { day: 'Tue', date: 23 },
  { day: 'Wed', date: 24 },
  { day: 'Thu', date: 25 },
]

export const DaySelectorPills: React.FC<DaySelectorPillsProps> = ({
  days = DEFAULT_DAYS,
  selectedDay: controlledSelectedDay,
  onSelectDay,
  className = ''
}) => {
  const [internalSelectedDay, setInternalSelectedDay] = useState('Mon')
  const activeDay = controlledSelectedDay ?? internalSelectedDay

  const handleSelect = (day: string) => {
    if (onSelectDay) {
      onSelectDay(day)
    } else {
      setInternalSelectedDay(day)
    }
  }

  return (
    <div className={`flex items-center gap-1.5 p-1 rounded-2xl bg-muted/40 border border-border/60 ${className}`}>
      {days.map((item) => {
        const isSelected = activeDay === item.day
        return (
          <button
            key={item.day}
            onClick={() => handleSelect(item.day)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer select-none ${
              isSelected
                ? 'bg-violet-600 text-white shadow-sm scale-100 font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 font-medium'
            }`}
          >
            <span className={`block text-[10px] uppercase tracking-wider ${isSelected ? 'text-violet-100' : 'text-muted-foreground'}`}>
              {item.day}
            </span>
            <span className="block text-xs font-black leading-tight">
              {item.date}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default DaySelectorPills
