import { Check } from 'lucide-react'

interface Props {
    current: number
    steps: string[]
}

export default function Stepper({ current, steps }: Props) {
    return (
        <div className="flex items-start mb-7">
            {steps.map((label, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                        <div className={[
                            'w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold border-2 transition-all duration-300',
                            i < current
                                ? 'bg-[#1d9e75] border-[#1d9e75] text-white'
                                : i === current
                                    ? 'bg-[#003580] border-[#003580] text-white'
                                    : 'bg-white border-gray-200 text-gray-400',
                        ].join(' ')}>
                            {i < current ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={[
                            'text-[10px] mt-1 whitespace-nowrap',
                            i < current
                                ? 'text-[#1d9e75] font-medium'
                                : i === current
                                    ? 'text-[#003580] font-semibold'
                                    : 'text-gray-400',
                        ].join(' ')}>
                            {label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={[
                            'flex-1 h-0.5 mx-1 -mt-3 transition-all duration-300',
                            i < current ? 'bg-[#1d9e75]' : 'bg-gray-200',
                        ].join(' ')} />
                    )}
                </div>
            ))}
        </div>
    )
}
