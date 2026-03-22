"use client";
import { useState } from "react";
import { Search, MessageSquare } from "lucide-react";

const messages = [
    { id: 1, from: "Leyla Hüseynova", email: "leyla@example.com", subject: "Booking confirmation request", preview: "Hello, I would like to confirm my hotel reservation for next week...", time: "10:42 AM", read: false, avatar: "LH", color: "bg-violet-500" },
    { id: 2, from: "Rauf Əliyev", email: "rauf@example.com", subject: "Car rental issue", preview: "The car I rented has a scratch on the rear bumper that was not listed...", time: "09:15 AM", read: false, avatar: "RƏ", color: "bg-emerald-500" },
    { id: 3, from: "Kamran İsmayılov", email: "kamran@example.com", subject: "Flight cancellation refund", preview: "My flight J2-315 was cancelled and I am requesting a full refund...", time: "Yesterday", read: true, avatar: "Kİ", color: "bg-orange-500" },
    { id: 4, from: "Nərmin Quliyeva", email: "nermin@example.com", subject: "Room upgrade request", preview: "Is it possible to upgrade our room from standard to deluxe?", time: "Yesterday", read: true, avatar: "NQ", color: "bg-pink-500" },
    { id: 5, from: "Elnur Həsənov", email: "elnur@example.com", subject: "Late check-in inquiry", preview: "We will be arriving around midnight, is late check-in available?", time: "2 days ago", read: true, avatar: "EH", color: "bg-blue-500" },
    { id: 6, from: "Sevinc Babayeva", email: "sevinc@example.com", subject: "Invoice request", preview: "Could you please send me an official invoice for my last booking?", time: "3 days ago", read: true, avatar: "SB", color: "bg-teal-500" },
    { id: 7, from: "Günel Rzayeva", email: "gunel@example.com", subject: "Partnership proposal", preview: "Our travel agency would like to discuss a potential partnership...", time: "1 week ago", read: true, avatar: "GR", color: "bg-indigo-500" },
];

export default function MessagesPage() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number | null>(1);

    const filtered = messages.filter(m =>
        m.from.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase())
    );

    const active = messages.find(m => m.id === selected);

    return (
        <div className="flex gap-5 h-[calc(100vh-200px)] min-h-[500px]">
            {/* Left panel */}
            <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                        <Search size={13} className="text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                    {filtered.map(m => (
                        <button key={m.id} onClick={() => setSelected(m.id)} className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors flex gap-3 items-start ${selected === m.id ? "bg-blue-50 border-l-2 border-[#006ce4]" : ""}`}>
                            <div className={`w-9 h-9 rounded-xl ${m.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>{m.avatar}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <p className={`text-[13px] truncate ${m.read ? "text-gray-700" : "text-gray-900 font-bold"}`}>{m.from}</p>
                                    <p className="text-[10px] text-gray-400 flex-shrink-0">{m.time}</p>
                                </div>
                                <p className={`text-xs truncate mt-0.5 ${m.read ? "text-gray-400" : "text-gray-600 font-medium"}`}>{m.subject}</p>
                                {!m.read && <span className="inline-block mt-1 w-1.5 h-1.5 bg-[#006ce4] rounded-full" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                {active ? (
                    <>
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${active.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>{active.avatar}</div>
                                <div>
                                    <p className="text-[14px] font-bold text-gray-800">{active.from}</p>
                                    <p className="text-xs text-gray-400">{active.email}</p>
                                </div>
                                <div className="ml-auto text-xs text-gray-400">{active.time}</div>
                            </div>
                            <h3 className="mt-4 text-[15px] font-semibold text-gray-800">{active.subject}</h3>
                        </div>
                        <div className="flex-1 p-5 overflow-y-auto">
                            <p className="text-sm text-gray-600 leading-relaxed">{active.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a arcu ac purus dapibus consectetur eu at felis. Donec varius neque a est accumsan vestibulum. Vivamus aliquet ipsum non finibus tincidunt.</p>
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex gap-3">
                                <input placeholder="Type your reply..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#006ce4] transition-colors placeholder-gray-400" />
                                <button className="bg-[#006ce4] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#0057b8] transition-colors">Send</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                        <MessageSquare size={40} />
                        <p className="mt-3 text-sm">Select a message to read</p>
                    </div>
                )}
            </div>
        </div>
    );
}