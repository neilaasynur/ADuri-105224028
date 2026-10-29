"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { skemaMasuk } from "@/schema/skema";
import { buatSesi, hapusSesi } from "@/schema/sesi";
import type { StatusForm } from "@/schema/status-form";

export async function masuk(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const hasil = skemaMasuk.safeParse(Object.fromEntries(formData));

  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }

  const { email, kataSandi } = hasil.data;

  // Verifikasi kredensial akun pengelola kebun (dari environment variable)
  if (
    email !== process.env.DEMO_EMAIL ||
    kataSandi !== process.env.DEMO_KATA_SANDI
  ) {
    return { pesan: "Email atau kata sandi pengelola salah." };
  }

  // Buat sesi server aman dengan cookie HttpOnly
  await buatSesi(email);

  // Alihkan langsung ke beranda dengan notifikasi pop-up berhasil masuk
  redirect("/?status=masuk");
}

export async function keluar() {
  await hapusSesi();
  redirect("/");
}
