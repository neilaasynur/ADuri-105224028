import { Metadata } from "next";
import Link from "next/link";
import BookingForm from "@/components/features/booking/BookingForm";

export const metadata: Metadata = {
  title: "Kunjungan & Ambil Sendiri di Kebun | ADuri Durian Riau",
  description: "Sensasi memilih dan menikmati durian langsung di bawah pohonnya di Kebun Keluarga Asynur, Kampar, Riau.",
};

export default function AmbilSendiriPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-xs sm:text-sm text-neutral-600">
        <ol className="flex items-center gap-2 list-none p-0 m-0">
          <li>
            <Link href="/" className="hover:text-[#31572c] underline">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li className="font-semibold text-[#26321f]">Ambil Sendiri di Kebun</li>
        </ol>
      </nav>

      {/* Header Section */}
      <header className="mb-8 sm:mb-10 text-left space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26321f]">
          Kunjungan Kebun & Ambil Durian Sendiri 🌿
        </h1>
        <p className="text-sm sm:text-base text-neutral-700 max-w-2xl leading-relaxed">
          Rasakan sensasi memilih dan menikmati durian langsung di bawah pohonnya. Kami menyambut Anda dan keluarga untuk berkunjung langsung ke kebun keluarga Asynur.
        </p>
      </header>

      {/* Booking Form and Garden Info */}
      <BookingForm />
    </div>
  );
}
