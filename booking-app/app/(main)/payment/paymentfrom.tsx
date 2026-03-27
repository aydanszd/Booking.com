"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1a1a2e",
      fontFamily: "'Outfit', sans-serif",
      "::placeholder": { color: "#a0aec0" },
    },
    invalid: { color: "#e53e3e" },
  },
};

type Booking = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalAmount: number;
};

function PaymentFormInner({ booking }: { booking: Booking }) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardHolder, setCardHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: booking.totalAmount,
          currency: "try",
          bookingId: booking.id,
        }),
      });

      const { clientSecret, error: serverError } = await res.json();
      if (serverError) throw new Error(serverError);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: { name: cardHolder },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message ?? "Xəta baş verdi" });
      } else if (paymentIntent?.status === "succeeded") {
        await fetch("/api/confirm-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking.id, paymentIntentId: paymentIntent.id }),
        });
        setSuccess(true);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-12 text-center">
        <div className="text-6xl text-green-600 mb-4">✓</div>
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
          <span className="text-xl">👤</span>
          <h2 className="text-lg font-semibold">Misafir bilgiləri</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Ad</label>
            <input
              type="text"
              defaultValue={booking.firstName}
              readOnly
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Soyad</label>
            <input
              type="text"
              defaultValue={booking.lastName}
              readOnly
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs font-medium text-gray-600">E-poçt ünvanı</label>
          <input
            type="email"
            defaultValue={booking.email}
            readOnly
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Telefon</label>
            <input
              type="text"
              defaultValue={booking.phone}
              readOnly
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Vətəndaşlıq</label>
            <input
              type="text"
              defaultValue="Türkiyə"
              readOnly
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Varış Zamanı */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xl">🗓️</span>
          <h2 className="text-lg font-semibold">Varış zamanı</h2>
        </div>
        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs font-medium text-gray-600">Təxmini varış saatiniz</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white">
            <option>12:00 – 13:00</option>
            <option>13:00 – 14:00</option>
            <option>14:00 – 15:00</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Xüsusi istək (isteğe bağlı)</label>
          <textarea
            placeholder="Örn: Üst katta oda, erken check-in..."
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Ödəniş Bilgiləri */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xl">💳</span>
          <h2 className="text-lg font-semibold">Ödəniş bilgiləri</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className="px-4 py-2 border-2 border-blue-600 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50"
          >
            Kredit / Banka kartı
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white"
          >
            PayPal
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white"
          >
            Havale
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
            alt="Visa"
            className="h-6 object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
            alt="MC"
            className="h-6 object-contain"
          />
          <span className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md">
            🔒 3D Secure
          </span>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs font-medium text-gray-600">Kart nömrəsi</label>
          <div className="border border-gray-300 rounded-lg px-3 py-3 focus-within:border-blue-500 transition-colors">
            <CardNumberElement options={ELEMENT_STYLE} />
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <label className="text-xs font-medium text-gray-600">Kart üzərindəki ad</label>
          <input
            type="text"
            placeholder="AD SOYAD"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            required
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Son istifadə tarixi</label>
            <div className="border border-gray-300 rounded-lg px-3 py-3 focus-within:border-blue-500 transition-colors">
              <CardExpiryElement options={ELEMENT_STYLE} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">CVC / CVV</label>
            <div className="border border-gray-300 rounded-lg px-3 py-3 focus-within:border-blue-500 transition-colors">
              <CardCvcElement options={ELEMENT_STYLE} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
          🧪 <strong>Test üçün:</strong> Kart:{" "}
          <code className="bg-yellow-100 px-1.5 py-0.5 rounded font-mono tracking-wider">
            4242 4242 4242 4242
          </code>{" "}
          · Tarix:{" "}
          <code className="bg-yellow-100 px-1.5 py-0.5 rounded font-mono">12/34</code> · CVC:{" "}
          <code className="bg-yellow-100 px-1.5 py-0.5 rounded font-mono">123</code>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "error"
              ? "bg-red-50 border border-red-200 text-red-600"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}
        >
          {message.type === "error" ? "❌ " : "✅ "}
          {message.text}
        </div>
      )}

      <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" required className="mt-0.5 accent-blue-600" />
        <span>İstifadə şərtlərini və gizlilik siyasətini oxudum, qəbul edirəm.</span>
      </label>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? "⟳ Ödəniş işlənir..."
          : `Rezervasiyanı tamamla — ₺${(booking.totalAmount / 100).toLocaleString("tr-TR")}`}
      </button>
      <p className="text-center text-xs text-gray-400">
        🔒 Güvənli SSL şifrələməsi ilə qorunmaqdadır
      </p>
    </form>
  );
}

export default function PaymentForm({ booking }: { booking: Booking }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner booking={booking} />
    </Elements>
  );
}