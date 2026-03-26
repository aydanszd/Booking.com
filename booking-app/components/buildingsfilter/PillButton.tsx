interface Props {
    label: string;
    active: boolean;
    onClick: () => void;
}

export function PillButton({ label, active, onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${active
                    ? "bg-[#006ce4] text-white border-[#006ce4]"
                    : "border-gray-200 text-gray-600 hover:border-[#006ce4]"
                }`}
        >
            {label}
        </button>
    );
}