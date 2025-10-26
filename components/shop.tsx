"use client";

import { useState } from "react";
import {
  addToCart,
  updateQuantity,
  signOut,
  completePurchase,
} from "@/app/actions";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import CartDialog from "@/components/CartDialog";
import AuthDialog from "@/components/AuthDialog";

interface CartItem {
  cart_item_id: number;
  quantity: number;
  product_id: number;
  name: string;
  price: number;
}

interface Cart {
  items: CartItem[];
}

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

export default function Shop({
  products = [],
  cart = { items: [] },
  currentUser = null,
}: {
  products?: Product[];
  cart?: Cart;
  currentUser?: User | null;
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  async function handleAddToCart(productId: number) {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    await addToCart(productId);
  }

  async function handleUpdateQuantity(cartItemId: number, quantity: number) {
    await updateQuantity(cartItemId, quantity);
  }

  async function handleAuthSuccess() {
    setAuthOpen(false);
  }

  async function handleSignOut() {
    await signOut();
  }

  async function handleCheckout() {
    if (cart.items.length === 0) return;

    await completePurchase();

    alert("Purchase Complete! Thank you for your purchase!");
    setCartOpen(false);
  }

  const cartItemCount = cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        cartItemCount={cartItemCount}
        onSignInClick={() => setAuthOpen(true)}
        onSignOutClick={handleSignOut}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid
          products={products}
          currentUser={currentUser}
          onSignInClick={() => setAuthOpen(true)}
          onAddToCart={handleAddToCart}
        />
      </main>

      <AuthDialog
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <CartDialog
        cart={cart.items}
        currentUser={currentUser}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onSignInClick={() => setAuthOpen(true)}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
