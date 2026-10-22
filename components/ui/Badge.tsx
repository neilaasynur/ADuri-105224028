import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "warning" | "success";
  className?: string;
}

export default function Badge({ children, variant = "primary", className = "" }: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#e9f1d5] text-[#26321f] border border-[#d3e2b1]",
    warning: "bg-amber-400 text-neutral-900",
    success: "bg-emerald-600 text-white",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
