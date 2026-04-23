import { Building2, Star } from 'lucide-react';
import { Building } from '@/types/building';

export default function BuildingStats({ buildings, total }: { buildings: Building[]; total: number }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {[
                { label: 'Total Buildings', value: total, icon: <Building2 size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
                { label: 'Available', value: buildings.filter(b => b.isAvailable).length, icon: <Building2 size={18} className="text-emerald-600" />, bg: 'bg-emerald-50' },
                { label: 'Top Rated', value: buildings.filter(b => b.rating >= 4.5).length, icon: <Star size={18} className="text-violet-600" />, bg: 'bg-violet-50' },
            ].map(({ label, value, icon, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
                    <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-xl font-bold text-gray-800">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
