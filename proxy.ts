import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pemeriksaan optimistik: hanya memeriksa keberadaan cookie sesi di lapisan jaringan terdepan
export function proxy(request: NextRequest) {
  if (!request.cookies.has("sesi")) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/produk/tambah", "/katalog/tambah-katalog"],
};
