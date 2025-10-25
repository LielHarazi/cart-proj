"use client";

import ProductCard from "@/components/ProductCard";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface ProductGridProps {
  products: Product[];
  currentUser: User | null;
  onSignInClick: () => void;
  onAddToCart: (productId: number) => void;
}

export default function ProductGrid({
  products,
  currentUser,
  onSignInClick,
  onAddToCart,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currentUser={currentUser}
          onSignInClick={onSignInClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
