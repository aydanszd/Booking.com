"use client";
import { useEffect, useState } from "react";
import { carApi } from "@/api/carapi";
import { CarType } from "@/types/car";
import { Loader2, Car, Plus, Pencil, Trash2, Star, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function AdminCarsPage() {
    const [cars, setCars] = useState<CarType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const res = await carApi.getAll({ page: 1, limit: 100 });
            setCars(res.cars);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCars(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await carApi.delete(id);
            toast.success("Car deleted");
            fetchCars();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Car className="text-blue-600" /> Car Management
                </h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                    <Plus size={20} /> Add New Car
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Car</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Daily Price</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cars.map(car => (
                            <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={car.images?.[0] || "/placeholder.jpg"} className="w-10 h-10 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-bold text-gray-900">{car.title}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{car.brand} {car.model}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                                        {car.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-black text-gray-900">${car.pricePerDay}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={12} fill="currentColor" className="text-amber-400" />
                                        <span className="font-bold">{car.rating}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(car._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}