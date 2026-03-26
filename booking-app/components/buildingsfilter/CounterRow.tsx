interface Props {
    label: string;
    value: number;
    onChange: (v: number) => void;
}

export function CounterRow({ label, value, onChange }: Props) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{label}</span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(0, value - 1))}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors text-sm"
                >
                    −
                </button>
                <span className="text-sm text-gray-700 w-4 text-center">{value}</span>
                <button
                    type="button"
                    onClick={() => onChange(value + 1)}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors text-sm"
                >
                    +
                </button>
            </div>
        </div>
    );
}