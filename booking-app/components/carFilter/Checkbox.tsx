export default function Checkbox({ checked, onChange, label, count }: {
    checked: boolean; onChange: () => void; label: string; count?: number
}) {
    return (
        <label className="flex items-center justify-between cursor-pointer group py-0.5 select-none">
            <div className="flex items-center gap-2.5">
                <button
                    onClick={onChange}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400 bg-white'}`}
                >
                    {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">{label}</span>
            </div>
            {count !== undefined && <span className="text-xs text-gray-400 tabular-nums ml-2">{count}</span>}
        </label>
    )
}
