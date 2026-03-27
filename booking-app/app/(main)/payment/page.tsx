// app/(main)/payment/page.tsx
// ✅ Server Component — "use client" yoxdur, styled-jsx yoxdur

import PaymentForm from "./paymentfrom";

type Booking = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalAmount: number;
};

async function getBooking(id?: string): Promise<Booking> {
  // Real Strapi çağırışı (hazır olduqda açın):
  // const res = await fetch(`${process.env.STRAPI_URL}/api/bookings/${id}`, {
  //   headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
  //   cache: "no-store",
  // });
  // const { data } = await res.json();
  // return data.attributes;

  return {
    id: id ?? "8472",
    firstName: "Ayşe",
    lastName: "Kaya",
    email: "ayse.kaya@email.com",
    phone: "+90 532 100 20 30",
    totalAmount: 1336500,
  };
}

export default async function OdemeSayfasi({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const booking = await getBooking(searchParams.id);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-4">
          <span className="text-blue-600 font-semibold">✓ Arama</span>
          <span className="text-gray-400">›</span>
          <span className="text-blue-700 font-bold">2 Rezervasiya detalları</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-400">3 Son addım</span>
        </nav>

        {/* Urgency banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5 text-sm text-blue-800">
          ℹ️ Neredeyse dolu! Bu otel için yalnızca <strong>2 oda kaldı</strong>. Hemen tamamlayın.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

          {/* Sol: Ödəniş Formu (Client Component) */}
          <div>
            <PaymentForm booking={booking} />
          </div>

          {/* Sağ: Özet kartı (Server Component) */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Otel şəkli */}
              <div className="h-36 bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center text-6xl">
                🏨
              </div>

              <div className="p-5">
                {/* Otel adı */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold">Grand Hotel Bosphorus</h3>
                  <span className="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                    Genius
                  </span>
                </div>
                <div className="text-yellow-400 tracking-widest text-sm mb-1">★★★★★</div>
                <p className="text-sm text-gray-500 mb-4">Deluxe Deniz Mənzərəli Oda</p>

                {/* Tarixlər */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Giriş</span>
                    <span className="text-base font-bold">14 Nis</span>
                    <span className="text-xs text-gray-400">Sal, 14:00-dən</span>
                  </div>
                  <span className="text-gray-300 text-lg">→</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Çıxış</span>
                    <span className="text-base font-bold">17 Nis</span>
                    <span className="text-xs text-gray-400">Cüm, 12:00-a qədər</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4">👥 2 yetişkin · 1 oda · 3 gecə</p>

                {/* Qiymət bölgüsü */}
                <div className="border-t border-gray-100 pt-3 space-y-2 mb-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>3 gecə × ₺4.500</span>
                    <span>₺13.500</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Genius endirim (10%)</span>
                    <span>-₺1.350</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Vergi və ücretler</span>
                    <span>₺1.215</span>
                  </div>
                </div>

                {/* Toplam */}
                <div className="flex justify-between items-center border-t-2 border-gray-100 pt-3 mb-1">
                  <span className="font-bold text-base">Toplam</span>
                  <span className="text-blue-600 text-xl font-bold">₺13.365</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Türk Lirası, vergilər daxil</p>

                {/* İptal politikası */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold mb-2">İptal politikası</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-gray-600">✦ 12 Nisana qədər pulsuz iptal</li>
                    <li className="text-xs text-gray-600">✦ Erkən otaq girişi tələb edilə bilər</li>
                    <li className="text-xs text-gray-600">✦ Səhər yeməyi daxil deyil</li>
                  </ul>
                </div>

                <p className="text-center text-xs text-green-600 font-medium">
                  🛡️ Ödəməniz güvəndədir
                </p>
              </div>
            </div>

            {/* Yardım kartı */}
            <div className="bg-white rounded-xl p-5 shadow-sm text-sm">
              <p className="font-semibold mb-1">Yardım lazımdır?</p>
              <p className="text-gray-500 mb-2">
                Rezervasiyanızla bağlı suallar üçün 7/24 dəstək xəttimiz.
              </p>
              <a href="#" className="text-blue-600 font-medium hover:underline">
                Müştəri xidmətlərinə bağlan ›
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}