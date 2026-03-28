import { forwardRef } from 'react'

const RegInput = forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        hasIcon?: boolean
        hasError?: boolean
        rightSlot?: React.ReactNode
    }
>(({ hasIcon = true, hasError = false, rightSlot, ...props }, ref) => (
    <div className="relative w-full flex items-center">
        <input
            {...props}
            ref={ref}
            className={[
                'w-full h-10 rounded-lg border text-sm bg-white text-gray-900 outline-none transition-all',
                'placeholder:text-gray-300 placeholder:text-[13px]',
                hasIcon ? 'pl-8.5' : 'pl-3',
                rightSlot ? 'pr-9' : 'pr-3',
                hasError
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/10',
            ].join(' ')}
        />
        {rightSlot}
    </div>
))
RegInput.displayName = 'RegInput'

export default RegInput
