"use client";

import { useState } from "react";
import {
  User, Calendar, CreditCard, Lock, Shield,
  CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import { validatePaymentForm } from "@/validators/paymentFormValidators";

type Booking = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalAmount: number;
};

export default function PaymentForm({ booking }: { booking: Booking }) {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [arrivalTime, setArrivalTime] = useState("12:00 – 13:00");
  const [terms, setTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [success, setSuccess] = useState(false);

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { errors } = validatePaymentForm({ cardHolder, arrivalTime, terms });
    if (errors) { setFieldErrors(errors); return; }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setFieldErrors(prev => ({ ...prev, cardNumber: "Kart nömrəsini tam daxil edin" }));
      return;
    }
    setFieldErrors({});
    setLoading(true);
    setMessage(null);

    try {
      await new Promise(r => setTimeout(r, 1200));
      setSuccess(true);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-12 text-center">
        <CheckCircle2 size={56} className="text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-800 mb-2">Rezervasiya Tamamlandı!</h2>
        <p className="text-gray-600">
          Təsdiq e-poçtu göndərildi: <strong>{booking.email}</strong>
        </p>
        <p className="mt-2 text-gray-500">
          Rezervasiya №: <strong>BK-{booking.id}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Misafir Bilgiləri */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <User size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Misafir bilgiləri</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Ad</label>
            <input type="text" defaultValue={booking.firstName} readOnly
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Soyad</label>
            <input type="text" defaultValue={booking.lastName} readOnly
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none" />
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs font-medium text-gray-600">E-poçt ünvanı</label>
          <input type="email" defaultValue={booking.email} readOnly
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Telefon</label>
            <input type="text" defaultValue={booking.phone} readOnly
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Vətəndaşlıq</label>
            <input type="text" defaultValue="Türkiyə" readOnly
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Varış Zamanı */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <Calendar size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Varış zamanı</h2>
        </div>
        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs font-medium text-gray-600">Təxmini varış saatiniz</label>
          <select value={arrivalTime}
            onChange={e => { setArrivalTime(e.target.value); setFieldErrors(prev => ({ ...prev, arrivalTime: "" })) }}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white">
            <option>12:00 – 13:00</option>
            <option>13:00 – 14:00</option>
            <option>14:00 – 15:00</option>
          </select>
          {fieldErrors.arrivalTime && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.arrivalTime}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Xüsusi istək (isteğe bağlı)</label>
          <textarea placeholder="Örn: Üst katta oda, erken check-in..." rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
        </div>
      </div>

      {/* Ödəniş Bilgiləri */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <CreditCard size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Ödəniş bilgiləri</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <button type="button" className="px-4 py-2 border-2 border-blue-600 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50">
            Kredit / Banka kartı
          </button>
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white">
            PayPal
          </button>
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white">
            Havale
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="MC" className="h-6 object-contain" />
          <span className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
            <Lock size={11} /> 3D Secure
          </span>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs font-medium text-gray-600">Kart nömrəsi</label>
          <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber}
            onChange={e => { setCardNumber(formatCardNumber(e.target.value)); setFieldErrors(prev => ({ ...prev, cardNumber: "" })) }}
            className={`border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 font-mono tracking-wider transition-colors ${fieldErrors.cardNumber ? "border-red-400" : "border-gray-300"}`} />
          {fieldErrors.cardNumber && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.cardNumber}</p>}
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs font-medium text-gray-600">Kart üzərindəki ad</label>
          <input type="text" placeholder="AD SOYAD" value={cardHolder}
            onChange={e => { setCardHolder(e.target.value.toUpperCase()); setFieldErrors(prev => ({ ...prev, cardHolder: "" })) }}
            className={`border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors ${fieldErrors.cardHolder ? "border-red-400" : "border-gray-300"}`} />
          {fieldErrors.cardHolder && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.cardHolder}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Son istifadə tarixi</label>
            <input type="text" placeholder="MM/YY" value={expiry}
              onChange={e => setExpiry(formatExpiry(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">CVC / CVV</label>
            <input type="text" placeholder="123" value={cvc}
              onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 font-mono" />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === "error" ? "bg-red-50 border border-red-200 text-red-600" : "bg-green-50 border border-green-200 text-green-700"}`}>
          {message.type === "error"
            ? <XCircle size={15} className="shrink-0" />
            : <CheckCircle2 size={15} className="shrink-0" />}
          {message.text}
        </div>
      )}

      <label className={`flex items-start gap-2 text-sm text-gray-600 cursor-pointer ${fieldErrors.terms ? "text-red-500" : ""}`}>
        <input type="checkbox" checked={terms}
          onChange={e => { setTerms(e.target.checked); setFieldErrors(prev => ({ ...prev, terms: "" })) }}
          className="mt-0.5 accent-blue-600" />
        <span>İstifadə şərtlərini və gizlilik siyasətini oxudum, qəbul edirəm.</span>
      </label>
      {fieldErrors.terms && <p className="text-xs text-red-500 -mt-2">{fieldErrors.terms}</p>}

      <button type="submit" disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {loading
          ? <><Loader2 size={18} className="animate-spin" /> Ödəniş işlənir...</>
          : <><Lock size={16} /> Rezervasiyanı tamamla — ₺{(booking.totalAmount / 100).toLocaleString("tr-TR")}</>}
      </button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Shield size={12} /> Güvənli SSL şifrələməsi ilə qorunmaqdadır
      </p>
    </form>
  );
}
