export default function Field({ label, icon, error, hint, children }: {
    label: string
    icon?: React.ReactNode
    error?: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 tracking-wide">{label}</label>
            <div className="relative flex items-center flex-col">
                {icon && <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none z-10">{icon}</span>}
                {children}
            </div>
            {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
            {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>
    )
}
