import React from "react";

interface BagianProps {
  id: string;
  judul: string;
  children: React.ReactNode;
  className?: string;
}

export default function Bagian({ id, judul, children, className = "" }: BagianProps) {
  return (
    <section id={id} className={`my-8 ${className}`}>
      <h2 className="text-xl sm:text-2xl font-bold text-[#26321f] mb-4 border-b border-[#dedbcf] pb-2">
        {judul}
      </h2>
      {children}
    </section>
  );
}
