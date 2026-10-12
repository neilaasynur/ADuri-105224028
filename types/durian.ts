export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  priceFormatted: string;
  unit: string;
  sweetness: number; // scale 1-5
  creaminess: number; // scale 1-5
  aroma: string;
  weightRange: string;
  description: string;
  details: string[];
  image: string;
  origin: string;
  isBestSeller?: boolean;
}

export type PaymentMethodType = "qris" | "transfer";

export interface PaymentOption {
  id: PaymentMethodType;
  title: string;
  description: string;
  accountInfo?: string;
  badge?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  district: string;
  address: string;
  notes?: string;
  paymentMethod: PaymentMethodType;
}

export interface NavbarProps {
  currentPath?: string;
}

export interface ProductCardProps {
  product: Product;
}

