'use client'

interface Props {
    min: number
    max: number
    value: number
    onChange: (v: number) => void
    format?: (v: number) => string
}

export default function RangeSlider({ min, max, value, onChange, format }: Props) {
    const pct = ((value - min) / (max - min)) * 100

    return (
        <div className="relative pt-1">
            <input type="range" min={min} max={max} value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500"
                style={{ background: `linear-gradient(to right, #3b82f6 ${pct}%, #e5e7eb ${pct}%)` }} />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>{format ? format(min) : min}</span>
                <span>{format ? format(value) : value}</span>
            </div>
        </div>
    )
}
