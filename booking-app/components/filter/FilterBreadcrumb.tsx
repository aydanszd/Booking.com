import { ChevronRight } from 'lucide-react'

export default function FilterBreadcrumb() {
    return (
        <div className="flex items-center gap-1.5 text-xs text-[#006ce4] mb-4 flex-wrap">
            {['Home', 'Properties'].map((crumb, i, arr) => (
                <span key={crumb} className="flex items-center gap-1.5">
                    <a href="#" className="hover:underline">{crumb}</a>
                    {i < arr.length - 1 && <ChevronRight size={12} className="text-gray-400" />}
                </span>
            ))}
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-gray-500">Search results</span>
        </div>
    )
}
