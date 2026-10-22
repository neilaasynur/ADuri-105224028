"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Tautan = { href: string; label: string };

interface TautanNavProps {
  tautan: Tautan[];
  onItemClick?: () => void;
}

export default function TautanNav({ tautan, onItemClick }: TautanNavProps) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col md:flex-row items-stretch md:items-center gap-1.5 md:gap-4 m-0 p-0 list-none">
      {tautan.map((t) => {
        const aktif =
          t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);

        return (
          <li key={t.href}>
            <Link
              href={t.href}
              onClick={onItemClick}
              aria-current={aktif ? "page" : undefined}
              className={`flex items-center px-3 py-2.5 md:py-1.5 rounded-lg text-base md:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] md:min-h-0 ${
                aktif
                  ? "bg-emerald-900/60 md:bg-transparent text-amber-300 font-bold underline decoration-2 underline-offset-4"
                  : "text-white hover:bg-emerald-800/50 md:hover:bg-transparent hover:text-amber-200"
              }`}
            >
              {t.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
