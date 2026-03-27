export default function SpecBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1 sm:gap-1.5 bg-gray-50 rounded-xl px-2 sm:px-3 py-2 sm:py-3 min-w-17 sm:min-w-20">
            <div className="text-blue-600">{icon}</div>
            <span className="text-[10px] sm:text-xs text-gray-600 text-center leading-tight font-medium">{label}</span>
        </div>
    )
}
