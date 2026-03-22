"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FlightType } from "@/types/flight";
import { flightApi } from "@/api/flight";

interface FlightDeleteModalProps {
    flight: FlightType | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function FlightDeleteModal({ flight, onClose, onSuccess }: FlightDeleteModalProps) {
    const [deleting, setDeleting] = useState(false);

    if (!flight) return null;

    const handleDelete = async () => {
        if (!flight._id) return;
        setDeleting(true);
        try {
            await flightApi.delete(flight._id);
            toast.success(`${flight.airline} ${flight.flightNumber} silindi`);
            onSuccess();
        } catch (e: any) {
            toast.error(e.message || "Silinmə zamanı xəta");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                    <Trash2 size={20} className="text-red-500" />
                </div>

                <h2 className="font-bold text-gray-800 text-base mb-1">Uçuşu Sil</h2>
                <p className="text-sm text-gray-400 mb-6">
                    <span className="text-gray-700 font-medium">
                        {flight.airline} {flight.flightNumber} — {flight.origin.code} → {flight.destination.code}
                    </span>{" "}
                    silinəcək. Bu əməliyyat geri alına bilməz.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 text-sm text-gray-500 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Ləğv et
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 text-sm text-white bg-red-500 px-4 py-2.5 rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-60"
                    >
                        {deleting ? "Silinir..." : "Sil"}
                    </button>
                </div>
            </div>
        </div>
    );
}