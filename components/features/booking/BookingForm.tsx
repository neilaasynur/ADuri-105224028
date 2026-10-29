"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { skemaKunjungan } from "@/schema/skema";
import { z } from "zod";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/5U3uggCfscyyxQyg8";
const OWNER_WA_NUMBER = "6281234567890";
const DEPOSIT_FORMATTED = "Rp50.000";

type PaymentType = "qris" | "transfer";

export default function BookingForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitorCount, setVisitorCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("qris");

  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    visitDate?: string;
    visitTime?: string;
  }>({});

  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    // Validasi menggunakan skema Zod (nama huruf abjad, nomor telepon angka, tanggal & jam wajib)
    const hasil = skemaKunjungan.safeParse({
      fullName,
      phone,
      visitDate,
      visitTime,
      visitorCount,
      notes: notes || undefined,
      paymentMethod,
    });

    if (!hasil.success) {
      const fieldErrors = z.flattenError(hasil.error).fieldErrors;
      setErrors({
        fullName: fieldErrors.fullName?.[0],
        phone: fieldErrors.phone?.[0],
        visitDate: fieldErrors.visitDate?.[0],
        visitTime: fieldErrors.visitTime?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSuccess(true);
    }
  };

  const getWaConfirmationUrl = () => {
    const text = encodeURIComponent(
      `Halo Pemilik Kebun ADuri, saya ingin konfirmasi booking kunjungan & ambil sendiri di kebun:\n\n` +
      `👤 Nama: ${fullName}\n` +
      `📱 No HP: ${phone}\n` +
      `📅 Tanggal: ${visitDate}\n` +
      `⏰ Waktu: ${visitTime} WIB\n` +
      `👥 Jumlah Rombongan: ${visitorCount} orang\n` +
      `💳 Deposit: ${DEPOSIT_FORMATTED} (${paymentMethod.toUpperCase()})\n` +
      `📝 Catatan: ${notes || "-"}\n\n` +
      `Saya sudah melakukan transfer deposit booking. Mohon konfirmasi jadwal kunjungan saya. Terima kasih!`
    );
    return `https://wa.me/${OWNER_WA_NUMBER}?text=${text}`;
  };

  if (isSuccess) {
    return (
      <section
        aria-labelledby="success-heading"
        className="bg-[#e9f1d5] border-2 border-[#31572c] rounded-2xl p-6 sm:p-10 lg:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-sm"
      >
        <figure className="m-0 flex justify-center">
          <span role="img" aria-label="Booking Berhasil" className="text-5xl sm:text-6xl">
            📍
          </span>
        </figure>
        <hgroup className="space-y-2">
          <h2 id="success-heading" className="text-2xl sm:text-3xl font-extrabold text-[#31572c]">
            Booking Kunjungan Berhasil Tercatat!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Terima kasih, <strong>{fullName}</strong>. Jadwal kunjungan Anda telah kami siapkan.
          </p>
        </hgroup>

        <article className="bg-white p-5 sm:p-6 rounded-xl border border-[#dedbcf] text-left text-xs sm:text-sm space-y-3">
          <h3 className="font-bold text-[#26321f] text-sm sm:text-base border-b pb-2">
            Detail Booking Kunjungan
          </h3>
          <p>
            <strong>Jadwal:</strong> {visitDate} pukul {visitTime} WIB ({visitorCount} orang)
          </p>
          <p>
            <strong>Deposit Booking:</strong> {DEPOSIT_FORMATTED} ({paymentMethod === "qris" ? "QRIS" : "Transfer Bank"})
          </p>
          {paymentMethod === "transfer" ? (
            <p className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              Silakan transfer deposit ke rekening XXX: <strong>xxx-xxxx-xxx</strong> a.n. <strong>xxxxxxxx</strong>.
            </p>
          ) : (
            <p className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              Silakan lakukan pembayaran deposit melalui scan QRIS saat pesan konfirmasi dikirim.
            </p>
          )}
          <p>
            <strong>Petunjuk Arah:</strong>{" "}
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#31572c] font-bold underline hover:text-emerald-700"
            >
              Buka Rute Kebun di Google Maps 🗺️
            </a>
          </p>
        </article>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={getWaConfirmationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-md min-h-[44px]"
          >
            <span>💬</span> Konfirmasi via WhatsApp Pemilik Kebun
          </a>
          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3.5 bg-white hover:bg-neutral-100 text-[#31572c] border border-[#31572c] font-bold rounded-xl transition-colors min-h-[44px]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Pendaftaran Kunjungan */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
        {/* Fieldset 1: Data Pengunjung */}
        <fieldset className="bg-white border border-[#dedbcf] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <legend className="font-bold text-base sm:text-lg text-[#26321f] px-2">
            1. Data Diri Calon Pengunjung
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
                Nama Lengkap (Huruf Abjad) <span className="text-red-500">*</span>:
              </span>
              <input
                type="text"
                placeholder="Contoh: Andi Wijaya"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                aria-invalid={!!errors.fullName}
                className={`w-full p-3 border rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 min-h-[44px] transition-colors ${
                  errors.fullName ? "border-red-500 focus:ring-red-500 bg-red-50/40" : "border-[#dedbcf] focus:ring-[#31572c]"
                }`}
              />
              {errors.fullName && (
                <p role="alert" className="text-xs font-semibold text-red-600 mt-1">
                  ⚠️ {errors.fullName}
                </p>
              )}
            </label>

            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
                Nomor WhatsApp (Angka) <span className="text-red-500">*</span>:
              </span>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                aria-invalid={!!errors.phone}
                className={`w-full p-3 border rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 min-h-[44px] transition-colors ${
                  errors.phone ? "border-red-500 focus:ring-red-500 bg-red-50/40" : "border-[#dedbcf] focus:ring-[#31572c]"
                }`}
              />
              {errors.phone && (
                <p role="alert" className="text-xs font-semibold text-red-600 mt-1">
                  ⚠️ {errors.phone}
                </p>
              )}
            </label>
          </div>
        </fieldset>

        {/* Fieldset 2: Waktu & Detail Kunjungan */}
        <fieldset className="bg-white border border-[#dedbcf] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <legend className="font-bold text-base sm:text-lg text-[#26321f] px-2">
            2. Jadwal & Waktu Kedatangan
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
                Tanggal Kunjungan <span className="text-red-500">*</span>:
              </span>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => {
                  setVisitDate(e.target.value);
                  if (errors.visitDate) setErrors((prev) => ({ ...prev, visitDate: undefined }));
                }}
                aria-invalid={!!errors.visitDate}
                className={`w-full p-3 border rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 min-h-[44px] ${
                  errors.visitDate ? "border-red-500 focus:ring-red-500" : "border-[#dedbcf] focus:ring-[#31572c]"
                }`}
              />
              {errors.visitDate && (
                <p role="alert" className="text-xs font-semibold text-red-600 mt-1">
                  ⚠️ {errors.visitDate}
                </p>
              )}
            </label>

            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
                Perkiraan Jam <span className="text-red-500">*</span>:
              </span>
              <select
                value={visitTime}
                onChange={(e) => {
                  setVisitTime(e.target.value);
                  if (errors.visitTime) setErrors((prev) => ({ ...prev, visitTime: undefined }));
                }}
                aria-invalid={!!errors.visitTime}
                className={`w-full p-3 border rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 min-h-[44px] ${
                  errors.visitTime ? "border-red-500 focus:ring-red-500" : "border-[#dedbcf] focus:ring-[#31572c]"
                }`}
              >
                <option value="">-- Pilih Jam --</option>
                <option value="09:00 - 11:00">Pagi (09:00 - 11:00 WIB)</option>
                <option value="11:00 - 13:00">Siang (11:00 - 13:00 WIB)</option>
                <option value="14:00 - 16:00">Sore (14:00 - 16:00 WIB)</option>
                <option value="16:00 - 18:00">Senja (16:00 - 18:00 WIB)</option>
              </select>
              {errors.visitTime && (
                <p role="alert" className="text-xs font-semibold text-red-600 mt-1">
                  ⚠️ {errors.visitTime}
                </p>
              )}
            </label>

            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
                Jumlah Rombongan:
              </span>
              <input
                type="number"
                min={1}
                max={20}
                value={visitorCount}
                onChange={(e) => setVisitorCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-3 border border-[#dedbcf] rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] min-h-[44px]"
              />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
              Catatan Khusus (Varietas durian incaran / kebutuhan khusus):
            </span>
            <input
              type="text"
              placeholder="Contoh: Ingin mencicipi Durian Runtuh Pohon & Montong langsung"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-[#dedbcf] rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] min-h-[44px]"
            />
          </label>
        </fieldset>

        {/* Fieldset 3: Deposit Booking & Metode Pembayaran */}
        <fieldset className="bg-white border border-[#dedbcf] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <legend className="font-bold text-base sm:text-lg text-[#26321f] px-2">
            3. Deposit Booking ({DEPOSIT_FORMATTED})
          </legend>

          <div className="bg-[#e9f1d5]/60 border border-[#d3e2b1] p-4 rounded-xl text-xs sm:text-sm text-[#26321f] space-y-1">
            <p className="font-bold">💡 Mengapa ada deposit booking?</p>
            <p className="text-neutral-700 leading-relaxed m-0">
              Deposit sebesar <strong>{DEPOSIT_FORMATTED}</strong> diterapkan semata-mata untuk mencegah penipuan / booking fiktif serta memastikan pohon dan buah siap dipanen saat Anda tiba. Deposit ini nantinya <strong>langsung memotong total belanja durian Anda</strong> di lokasi.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
              Pilih Metode Pembayaran Deposit:
            </span>

            <label
              className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                paymentMethod === "qris" ? "border-[#31572c] bg-[#e9f1d5]/40" : "border-[#dedbcf] hover:bg-neutral-50"
              }`}
            >
              <input
                type="radio"
                name="depositMethod"
                value="qris"
                checked={paymentMethod === "qris"}
                onChange={() => setPaymentMethod("qris")}
                className="mt-1 accent-[#31572c]"
              />
              <div>
                <strong className="text-sm font-bold text-[#26321f] block">QRIS (Scan Barcode Instan)</strong>
                <span className="text-xs text-neutral-600 block">Dukung semua bank dan e-wallet.</span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                paymentMethod === "transfer" ? "border-[#31572c] bg-[#e9f1d5]/40" : "border-[#dedbcf] hover:bg-neutral-50"
              }`}
            >
              <input
                type="radio"
                name="depositMethod"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={() => setPaymentMethod("transfer")}
                className="mt-1 accent-[#31572c]"
              />
              <div>
                <strong className="text-sm font-bold text-[#26321f] block">Transfer Bank Direct</strong>
                <span className="text-xs text-neutral-600 block">
                  Rekening xxx: <strong>XXX-xxx-xxxx</strong> a.n. xxxxxxxxxxx
                </span>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-[#31572c] hover:bg-[#254322] active:bg-[#1a3018] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-700/50 min-h-[48px]"
        >
          Konfirmasi Jadwal Kunjungan & Lanjut WhatsApp
        </button>
      </form>

      {/* Sidebar: Lokasi & Panduan Kebun */}
      <aside className="space-y-6">
        {/* Card Lokasi Kebun */}
        <article className="bg-white border border-[#dedbcf] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#26321f] flex items-center gap-2">
            <span>📍</span> Lokasi Kebun Durian
          </h2>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            Kebun durian keluarga Asynur terletak di kawasan perkebunan Kampar, Riau. Suasana asri dan ramah keluarga.
          </p>

          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#31572c] border border-emerald-600 font-bold text-xs sm:text-sm rounded-xl transition-colors min-h-[44px]"
          >
            <span>🗺️</span> Buka Peta di Google Maps
          </a>

          <div className="pt-2 border-t border-[#dedbcf] space-y-2 text-xs text-neutral-600">
            <p className="font-semibold text-[#26321f]">Jam Operasional Kunjungan:</p>
            <p>Senin – Minggu: 08.30 – 17.30 WIB</p>
            <p className="text-amber-800 font-medium">
              *Wajib booking terlebih dahulu sebelum datang agar buah matang pohon dapat disiapkan.
            </p>
          </div>
        </article>

        {/* Card Keuntungan Ambil Sendiri */}
        <article className="bg-[#e9f1d5]/50 border border-[#d3e2b1] rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-[#31572c]">Keuntungan Ambil Sendiri:</h3>
          <ul className="text-xs sm:text-sm text-neutral-700 space-y-2 list-none p-0 m-0">
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Bisa cicip rasa buah di tempat sebelum dibungkus.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Garansi 100% buah fresh baru jatuh dari pohon.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Edukasi langsung dari pemilik kebun mengenai jenis durian.</span>
            </li>
          </ul>
        </article>
      </aside>
    </div>
  );
}
