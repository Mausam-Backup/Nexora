import React from 'react'

interface CircularGaugeProps {
  value: number // 0 to 100
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  color?: string
  trackColor?: string
  className?: string
  showPercentSymbol?: boolean
  customDisplayValue?: string
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  size = 110,
  strokeWidth = 9,
  label,
  sublabel,
  color = '#8B5CF6',
  trackColor = 'currentColor',
  className = '',
  showPercentSymbol = true,
  customDisplayValue
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted/30 opacity-40"
          />

          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black tracking-tight text-foreground leading-none">
            {customDisplayValue ?? (
              <>
                {Math.round(clampedValue)}
                {showPercentSymbol && <span className="text-xs font-bold text-muted-foreground">%</span>}
              </>
            )}
          </span>
          {sublabel && (
            <span className="text-[10px] font-semibold text-muted-foreground mt-0.5 leading-none">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="text-xs font-bold text-foreground mt-2 text-center">
          {label}
        </span>
      )}
    </div>
  )
}

export default CircularGauge
