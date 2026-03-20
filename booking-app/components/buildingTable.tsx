import { Building2, MapPin, Star, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Building, TYPE_COLORS } from '@/types/building';
import { IMG } from '@/lib/api';

interface Props {
    buildings: Building[];
    loading: boolean;
    onEdit: (b: Building) => void;
    onDelete: (id: string) => void;
}

export default function BuildingTable({ buildings, loading, onEdit, onDelete }: Props) {
    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 size={28} className="animate-spin text-[#006ce4]" />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
            <table className="w-full text-sm min-w-[800px]">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50">
                        {['Name', 'Location', 'Type', 'Rooms', 'Amenities', 'Price', 'Rating', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {buildings.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center py-12 text-gray-400">Bina tapılmadı</td>
                        </tr>
                    ) : buildings.map(b => (
                        <tr key={b._id} className="hover:bg-gray-50 transition-colors">

                            {/* Name + image */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    {b.images?.[0] ? (
                                        <img src={IMG(b.images[0])} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" alt={b.title} />
                                    ) : (
                                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <Building2 size={14} className="text-gray-400" />
                                        </div>
                                    )}
                                    <span className="font-semibold text-gray-800 text-[13px] whitespace-nowrap">{b.title}</span>
                                </div>
                            </td>

                            {/* Location */}
                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <MapPin size={11} />{b.location.city}, {b.location.country}
                                </div>
                            </td>

                            {/* Type */}
                            <td className="px-4 py-3">
                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${TYPE_COLORS[b.type] || 'bg-gray-100 text-gray-600'}`}>
                                    {b.type}
                                </span>
                            </td>

                            {/* Rooms */}
                            <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                                {b.rooms ? `${b.rooms.bedrooms} bed / ${b.rooms.bathrooms} bath` : '—'}
                            </td>

                            {/* Amenities */}
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1 max-w-[160px]">
                                    {b.amenities?.slice(0, 3).map(a => (
                                        <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
                                    ))}
                                    {(b.amenities?.length || 0) > 3 && (
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                            +{(b.amenities?.length || 0) - 3}
                                        </span>
                                    )}
                                </div>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3 font-semibold text-gray-800 text-[13px] whitespace-nowrap">
                                ${b.pricePerNight}/night
                            </td>

                            {/* Rating */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                    <span className="text-[13px] font-semibold text-gray-700">{b.rating}</span>
                                </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${b.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                    }`}>
                                    {b.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onEdit(b)}
                                        className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(b._id)}
                                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}