import { Product, PaymentOption } from "@/types/durian";

export const DURIAN_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "durian-kampung",
    name: "Durian Kampung Riau",
    tagline: "Rasa manis gurih dan aroma khas kebun keluarga",
    price: 35000,
    priceFormatted: "Rp35.000",
    unit: "kg",
    sweetness: 4,
    creaminess: 4,
    aroma: "Harum Khas Durian Asli",
    weightRange: "1.2 - 2.0 kg / buah",
    description:
      "Durian Kampung Riau pilihan dipetik langsung dari kebun keluarga di Kampar dan Pekanbaru. Memiliki rasa manis yang dipadu dengan gurih alami serta tekstur daging yang lembut.",
    details: [
      "Dipetik langsung saat matang pohon",
      "Garansi ganti jika buah mentah atau busuk",
      "Tekstur legit dan ramah di kantong",
      "Cocok untuk hidangan keluarga"
    ],
    image: "/durian.png",
    origin: "Kampar, Riau",
    isBestSeller: true
  },
  {
    id: "2",
    slug: "durian-montong",
    name: "Durian Montong Riau",
    tagline: "Daging super tebal, manis legit membekas",
    price: 60000,
    priceFormatted: "Rp60.000",
    unit: "kg",
    sweetness: 5,
    creaminess: 5,
    aroma: "Manis Harum Semerbak",
    weightRange: "2.5 - 4.0 kg / buah",
    description:
      "Varian Montong unggulan dengan daging super tebal dan biji yang relatif kecil. Setiap ulas dagingnya memberikan kelezatan manis legit dengan kadar air yang pas.",
    details: [
      "Daging super tebal & biji kempes",
      "Kadar manis alami tinggi (Brix 28+)",
      "Garansi kualitas kualitas super",
      "Pilihan paling favorit untuk pecinta durian tebal"
    ],
    image: "/durian.png",
    origin: "Pekanbaru, Riau",
    isBestSeller: true
  },
  {
    id: "3",
    slug: "durian-lokal-riau",
    name: "Durian Tembaga Riau",
    tagline: "Warna kuning emas tembaga dengan pahit manis berkelas",
    price: 45000,
    priceFormatted: "Rp45.000",
    unit: "kg",
    sweetness: 4,
    creaminess: 5,
    aroma: "Kuat Semerbak",
    weightRange: "1.5 - 2.5 kg / buah",
    description:
      "Durian varietas Tembaga khas Riau dengan warna ulas kuning keemasan yang cantik. Rasanya kaya dengan perpaduan manis legit dan sedikit sentuhan pahit khas durian premium.",
    details: [
      "Warna daging kuning tembaga pekat",
      "Rasa manis berpadu pahit lembut (Complex flavor)",
      "Daging creamy meleleh di mulut",
      "Hasil panen terbatas dari pohon tua"
    ],
    image: "/durian.png",
    origin: "Siak & Kampar, Riau",
    isBestSeller: false
  },
  {
    id: "4",
    slug: "durian-musang-king",
    name: "Durian Musang King Riau",
    tagline: "Raja durian dengan ulas kuning kunyit super kremy",
    price: 150000,
    priceFormatted: "Rp150.000",
    unit: "kg",
    sweetness: 5,
    creaminess: 5,
    aroma: "Harum Sangat Pekat",
    weightRange: "1.8 - 2.8 kg / buah",
    description:
      "Hasil budidaya varietas Musang King di tanah Riau. Memiliki tekstur mentega (creamy butter), warna kuning kunyit terang, dan rasa manis pahit seimbang yang sangat mewah.",
    details: [
      "Kualitas Grade A Super Premium",
      "Biji gepeng / pipih 80%",
      "Tekstur mentega sangat halus",
      "Garansi 100% kepuasan rasa"
    ],
    image: "/durian.png",
    origin: "Kebun Mitra Pekanbaru",
    isBestSeller: true
  },
  {
    id: "5",
    slug: "durian-black-thorn",
    name: "Durian Duri Hitam Riau",
    tagline: "Tekstur sangat lembut tanpa serat dengan manis karamel",
    price: 180000,
    priceFormatted: "Rp180.000",
    unit: "kg",
    sweetness: 5,
    creaminess: 5,
    aroma: "Wangi Karamel Lembut",
    weightRange: "1.5 - 2.2 kg / buah",
    description:
      "Varietas langka Duri Hitam (Ochee) panen lokal. Daging buahnya berwarna oranye kemerahan, sangat lembut tanpa serat, serta sensasi rasa manis mirip karamel.",
    details: [
      "Sensasi rasa manis karamel mewah",
      "Sangat creamy tanpa serat sama sekali",
      "Daging tebal ulas besar",
      "Buah langka dan stok terbatas"
    ],
    image: "/durian.png",
    origin: "Riau",
    isBestSeller: false
  }
];

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "qris",
    title: "QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay)",
    description: "Scan kode QR gratis biaya admin dan instan terkonfirmasi.",
    badge: "Paling Cepat & Praktis"
  },
  {
    id: "transfer",
    title: "Transfer Bank Direct (BCA / Mandiri)",
    description: "Transfer manual ke rekening kebun keluarga kami.",
    accountInfo: "BCA: 893-0192-881 a.n. Kebun Durian Riau"
  },
  {
    id: "cod",
    title: "Bayar di Tempat (COD)",
    description: "Bayar tunai ke kurir saat durian sampai di tempat Anda.",
    badge: "Khusus Pekanbaru & Kampar"
  }
];

