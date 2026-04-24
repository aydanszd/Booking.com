"use client";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { Heart, MapPin, Star, Hotel, Car, Plane, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";

function TypeBadge({ type }: { type: WishlistItem["type"] }) {
    if (type === "car")
        return <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit"><Car size={9} />Car</span>;
    if (type === "flight")
        return <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit"><Plane size={9} />Flight</span>;
    return <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1 w-fit"><Hotel size={9} />Hotel</span>;
}

export default function WishlistPage() {
    const { items, remove } = useWishlist();

    return (
        <div className="min-h-screen bg-[#f2f6fa] py-8 px-4 pt-20">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Heart size={18} className="text-red-500 fill-red-500" />
                    <h1 className="text-xl font-bold text-gray-900">Saved</h1>
                    {items.length > 0 && (
                        <span className="ml-1 text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            {items.length}
                        </span>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 px-8 py-14 text-center">
                        <Heart size={40} className="text-gray-200 mx-auto mb-4" />
                        <p className="font-semibold text-gray-700 mb-1">Nothing saved yet</p>
                        <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                            Tap the heart on any hotel, car or flight to save it here for later.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link href="/filter" className="bg-[#006ce4] hover:bg-[#0057b8] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                Hotels
                            </Link>
                            <Link href="/carrender" className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors bg-white">
                                Car rentals
                            </Link>
                            <Link href="/flights" className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors bg-white">
                                Flights
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    <th className="text-left px-4 py-3 w-12">#</th>
                                    <th className="text-left px-4 py-3">Property</th>
                                    <th className="text-left px-4 py-3 hidden sm:table-cell">Location</th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell">Rating</th>
                                    <th className="text-right px-4 py-3">Price</th>
                                    <th className="text-center px-4 py-3 w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Index */}
                                        <td className="px-4 py-3 text-gray-400 text-xs font-medium">
                                            {index + 1}
                                        </td>

                                        {/* Property */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                                    {item.image
                                                        ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            {item.type === "car" ? <Car size={14} /> : item.type === "flight" ? <Plane size={14} /> : <Hotel size={14} />}
                                                          </div>
                                                    }
                                                </div>
                                                <div className="min-w-0">
                                                    <Link href={item.href} className="font-semibold text-[#006ce4] hover:underline text-sm line-clamp-1">
                                                        {item.title}
                                                    </Link>
                                                    <div className="sm:hidden text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                        <MapPin size={9} />{item.location || "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <MapPin size={10} className="text-gray-400 shrink-0" />
                                                {item.location || "—"}
                                            </span>
                                        </td>

                                        {/* Type */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <TypeBadge type={item.type} />
                                        </td>

                                        {/* Rating */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            {item.rating != null ? (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="bg-[#003580] text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                                        {item.rating}
                                                    </div>
                                                    <div className="flex items-center gap-0.5">
                                                        {[1,2,3,4,5].map(s => (
                                                            <Star key={s} size={9} className={s <= Math.round(item.rating!) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-300">—</span>
                                            )}
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3 text-right">
                                            <p className="font-bold text-gray-900 text-sm">${item.price}</p>
                                            <p className="text-[10px] text-gray-400">{item.priceLabel}</p>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={item.href}
                                                    className="text-[#006ce4] hover:text-[#0057b8] p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                                    title="View"
                                                >
                                                    <ChevronRight size={15} />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(item.id)}
                                                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Remove"
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
                )}
            </div>
        </div>
    );
}
