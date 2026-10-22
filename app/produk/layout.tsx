import ProductSidebarFilter from "@/components/features/products/ProductSidebarFilter";

export default function LayoutProduk({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:grid lg:grid-cols-[18rem_1fr] lg:gap-8 items-start">
      {/* Sidebar Filter & Layout State Holder */}
      <ProductSidebarFilter />

      {/* Main Content (Katalog atau Detail Produk) */}
      <main className="min-w-0">{children}</main>
    </div>
  );
}
