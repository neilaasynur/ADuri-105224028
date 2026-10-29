"use client";

import { useState, use, FormEvent } from "react";
import Link from "next/link";
import { DURIAN_PRODUCTS, PAYMENT_OPTIONS } from "@/data/products";
import { PaymentMethodType } from "@/types/durian";
import { skemaPembayaran } from "@/lib/skema";
import { z } from "zod";

interface PaymentFormProps {
  searchParams: Promise<{ produk?: string }>;
}

export default function PaymentForm({ searchParams }: PaymentFormProps) {
  const resolvedParams = use(searchParams);
  const initialProductSlug = resolvedParams?.produk || DURIAN_PRODUCTS[0].slug;

  const [selectedSlug, setSelectedSlug] = useState<string>(initialProductSlug);
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("qris");

  // Customer form inputs
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [district, setDistrict] = useState<string>("Pekanbaru");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Client-side validation error state
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    address?: string;
  }>({});

  // Order submission state
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const selectedProduct =
    DURIAN_PRODUCTS.find((p) => p.slug === selectedSlug) || DURIAN_PRODUCTS[0];

  const totalPrice = selectedProduct.price * quantity;
  const totalPriceFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalPrice);

  const validateForm = (): boolean => {
    // Validasi menggunakan skema Zod (nama huruf abjad, nomor telepon angka, alamat min 10)
    const hasil = skemaPembayaran.safeParse({
      fullName,
      phone,
      district,
      address,
      notes: notes || undefined,
      quantity,
      paymentMethod,
      productSlug: selectedSlug,
    });

    if (!hasil.success) {
      const fieldErrors = z.flattenError(hasil.error).fieldErrors;
      setErrors({
        fullName: fieldErrors.fullName?.[0],
        phone: fieldErrors.phone?.[0],
        address: fieldErrors.address?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <section
        aria-labelledby="success-heading"
        className="bg-[#e9f1d5] border-2 border-[#31572c] rounded-2xl p-6 sm:p-10 lg:p-12 text-center space-y-5 sm:space-y-6 max-w-2xl mx-auto"
      >
        <figure className="m-0 flex justify-center">
          <span role="img" aria-label="Pesanan Berhasil" className="text-5xl sm:text-6xl">
            🎉
          </span>
        </figure>
        <hgroup className="space-y-2">
          <h2 id="success-heading" className="text-2xl sm:text-3xl font-extrabold text-[#31572c]">
            Pesanan Berhasil Dibuat!
          </h2>
          <p className="text-neutral-700 text-sm sm:text-lg leading-relaxed">
            Terima kasih <strong>{fullName}</strong>. Pesanan{" "}
            <strong>
              {quantity}x {selectedProduct.name}
            </strong>{" "}
            Anda senilai <strong>{totalPriceFormatted}</strong> telah terdaftar.
          </p>
        </hgroup>

        <article className="bg-white p-4 sm:p-6 rounded-xl border border-[#dedbcf] text-left space-y-3 text-xs sm:text-sm text-neutral-700">
          <h3 className="font-bold text-[#26321f] text-sm sm:text-base border-b pb-2">
            Instruksi Pembayaran selanjutnya:
          </h3>
          {paymentMethod === "qris" && (
            <p>
              Silakan lakukan pembayaran QRIS sejumlah <strong>{totalPriceFormatted}</strong>. Bukti transaksi akan langsung diverifikasi tim admin kami melalui WhatsApp.
            </p>
          )}
          {paymentMethod === "transfer" && (
            <p>
              Silakan transfer senilai <strong>{totalPriceFormatted}</strong> ke rekening XXX{" "}
              <strong>xxx-xxxx-xxx</strong> a.n. <strong>xxxxxxxx</strong>.
            </p>
          )}
          <p className="font-semibold text-emerald-800 pt-2 m-0">
            Tim Kebun Durian Riau akan mengonfirmasi via WhatsApp ke {phone}.
          </p>
        </article>

        <footer className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/produk"
            className="flex items-center justify-center px-6 py-3.5 bg-[#31572c] hover:bg-[#254322] text-white font-bold rounded-xl transition-colors shadow-md min-h-[44px]"
          >
            Pesan Durian Lainnya
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3.5 bg-white text-neutral-700 border border-[#dedbcf] font-bold rounded-xl transition-colors min-h-[44px]"
          >
            Kembali ke Beranda
          </Link>
        </footer>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Left Column: Form Controls */}
      <section className="lg:col-span-2 space-y-6">
        {/* Fieldset 1: Produk & Jumlah */}
        <fieldset className="bg-white border border-[#dedbcf] rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <legend className="font-bold text-base sm:text-lg text-[#26321f] px-2">
            1. Pilih Produk & Jumlah
          </legend>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="sm:col-span-2 space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">Varietas Durian:</span>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="w-full p-3 sm:p-3.5 border border-[#dedbcf] rounded-xl bg-[#faf8f1] text-xs sm:text-sm font-medium text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] min-h-[44px]"
              >
                {DURIAN_PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.slug}>
                    {prod.name} — {prod.priceFormatted} / {prod.unit}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">Jumlah (Kg/Buah):</span>
              <input
                type="number"
                min={1}
                max={20}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-3 sm:p-3.5 border border-[#dedbcf] rounded-xl bg-[#faf8f1] text-xs sm:text-base font-bold text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] min-h-[44px]"
              />
            </label>
          </section>
        </fieldset>

        {/* Fieldset 2: Data Pengiriman */}
        <fieldset className="bg-white border border-[#dedbcf] rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <legend className="font-bold text-base sm:text-lg text-[#26321f] px-2">
            2. Alamat & Penerima Pengiriman
          </legend>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
                Nama Lengkap (Huruf Abjad) <span className="text-red-500">*</span>:
              </span>
              <input
                type="text"
                placeholder="Contoh: Budi Pratama"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                aria-invalid={!!errors.fullName}
                className={`w-full p-3 sm:p-3.5 border rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 min-h-[44px] transition-colors ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500 bg-red-50/40"
                    : "border-[#dedbcf] focus:ring-[#31572c]"
                }`}
              />
              {errors.fullName && (
                <p role="alert" className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.fullName}
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
                className={`w-full p-3 sm:p-3.5 border rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 min-h-[44px] transition-colors ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500 bg-red-50/40"
                    : "border-[#dedbcf] focus:ring-[#31572c]"
                }`}
              />
              {errors.phone && (
                <p role="alert" className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.phone}
                </p>
              )}
            </label>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">Wilayah / Kabupaten:</span>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 sm:p-3.5 border border-[#dedbcf] rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] min-h-[44px]"
              >
                <option value="Pekanbaru">Pekanbaru</option>
                <option value="Kampar">Kampar / Bangkinang</option>
                <option value="Siak">Siak</option>
                <option value="Pelalawan">Pelalawan</option>
                <option value="Wilayah Riau Lainnya">Wilayah Riau Lainnya</option>
              </select>
            </label>

            <label className="space-y-1 block">
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">Catatan Pesanan (Opsional):</span>
              <input
                type="text"
                placeholder="Contoh: Minta durian yang manis pahit"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 sm:p-3.5 border border-[#dedbcf] rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] min-h-[44px]"
              />
            </label>
          </section>

          <label className="space-y-1 block">
            <span className="text-xs sm:text-sm font-semibold text-neutral-700 block">
              Alamat Lengkap Pengiriman <span className="text-red-500">*</span>:
            </span>
            <textarea
              rows={3}
              placeholder="Jalan, Nomor Rumah, RT/RW, Kecamatan, Patokan..."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
              }}
              aria-invalid={!!errors.address}
              className={`w-full p-3 sm:p-3.5 border rounded-xl bg-[#faf8f1] text-xs sm:text-base text-[#26321f] focus:outline-none focus:ring-2 transition-colors ${
                errors.address
                  ? "border-red-500 focus:ring-red-500 bg-red-50/40"
                  : "border-[#dedbcf] focus:ring-[#31572c]"
              }`}
            />
            {errors.address && (
              <p role="alert" className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.address}
              </p>
            )}
          </label>
        </fieldset>

        {/* Fieldset 3: Metode Pembayaran */}
        <fieldset className="bg-white border border-[#dedbcf] rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <legend className="font-bold text-base sm:text-lg text-[#26321f] px-2">
            3. Pilih Metode Pembayaran
          </legend>

          <ul className="space-y-3 m-0 p-0 list-none">
            {PAYMENT_OPTIONS.map((opt) => (
              <li key={opt.id}>
                <label
                  className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 border rounded-xl cursor-pointer transition-colors min-h-[44px] ${
                    paymentMethod === opt.id
                      ? "border-[#31572c] bg-[#e9f1d5]/40"
                      : "border-[#dedbcf] hover:bg-neutral-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="mt-1 accent-[#31572c] shrink-0"
                  />
                  <section className="space-y-1 flex-1">
                    <header className="flex flex-wrap items-center justify-between gap-1">
                      <strong className="text-sm sm:text-base text-[#26321f]">{opt.title}</strong>
                      {opt.badge && (
                        <mark className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded bg-amber-300 text-neutral-900 shrink-0">
                          {opt.badge}
                        </mark>
                      )}
                    </header>
                    <p className="text-xs sm:text-sm text-neutral-600 m-0">{opt.description}</p>
                    {opt.accountInfo && paymentMethod === opt.id && (
                      <p className="text-xs font-mono font-bold text-[#31572c] bg-white p-2 rounded border border-[#dedbcf] mt-2 m-0">
                        {opt.accountInfo}
                      </p>
                    )}
                  </section>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </section>

      {/* Right Column: Order Summary Card */}
      <aside className="lg:col-span-1 space-y-6">
        <section
          aria-labelledby="ringkasan-order"
          className="bg-white border border-[#dedbcf] rounded-2xl p-5 sm:p-6 shadow-sm static lg:sticky top-24 space-y-4"
        >
          <h2
            id="ringkasan-order"
            className="text-lg sm:text-xl font-bold text-[#26321f] border-b border-[#dedbcf] pb-3"
          >
            Ringkasan Pesanan
          </h2>

          <figure className="flex items-center gap-3 bg-[#faf8f1] p-3 rounded-xl border border-[#dedbcf] m-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0"
            />
            <figcaption className="space-y-0.5">
              <strong className="block text-xs sm:text-sm text-[#26321f]">{selectedProduct.name}</strong>
              <span className="text-xs text-neutral-500 block">
                {selectedProduct.priceFormatted} / {selectedProduct.unit}
              </span>
            </figcaption>
          </figure>

          <ul className="space-y-2 text-xs sm:text-sm text-neutral-700 m-0 p-0 list-none border-b border-[#dedbcf] pb-4">
            <li className="flex justify-between">
              <span>Jumlah:</span>
              <strong className="text-[#26321f]">
                {quantity} {selectedProduct.unit}
              </strong>
            </li>
            <li className="flex justify-between">
              <span>Harga Satuan:</span>
              <span>{selectedProduct.priceFormatted}</span>
            </li>
            <li className="flex justify-between">
              <span>Pengiriman:</span>
              <span className="text-emerald-700 font-semibold">Gratis Ongkir Riau*</span>
            </li>
          </ul>

          <footer className="space-y-4">
            <p className="flex justify-between items-baseline text-[#26321f] m-0">
              <span className="font-bold text-sm sm:text-base">Total Bayar:</span>
              <strong className="text-xl sm:text-2xl font-extrabold text-[#31572c]">{totalPriceFormatted}</strong>
            </p>

            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 px-6 bg-[#31572c] hover:bg-[#254322] text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-700/50 cursor-pointer min-h-[44px]"
            >
              Konfirmasi & Bayar Sekarang
            </button>
            <p className="text-[11px] sm:text-xs text-neutral-500 text-center m-0">
              🔒 Transaksi terenkripsi aman & garansi diganti jika mentah.
            </p>
          </footer>
        </section>
      </aside>
    </form>
  );
}
