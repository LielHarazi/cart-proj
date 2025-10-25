"use client";

import { useState } from "react";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  signOut,
  getCurrentUser,
  getCart,
} from "@/app/actions";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import CartDialog from "@/components/CartDialog";
import AuthDialog from "@/components/AuthDialog";

interface CartItem {
  cart_item_id: number;
  quantity: number;
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface Cart {
  items: CartItem[];
  total: number;
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
  cart = { items: [], total: 0 },
  currentUser = null,
}: {
  products?: Product[];
  cart?: Cart;
  currentUser?: User | null;
}) {
  const [cartState, setCartState] = useState<Cart>(cart);
  const [userState, setUserState] = useState<User | null>(currentUser);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  async function handleAddToCart(productId: number) {
    if (!userState) {
      setAuthOpen(true);
      return;
    }
    await addToCart(productId);
    // Refresh cart data
    const updatedCart = await getCart();
    setCartState(updatedCart);
  }

  async function handleUpdateQuantity(cartItemId: number, quantity: number) {
    await updateQuantity(cartItemId, quantity);
    // Refresh cart data
    const updatedCart = await getCart();
    setCartState(updatedCart);
  }

  async function handleRemoveFromCart(cartItemId: number) {
    await removeFromCart(cartItemId);
    // Refresh cart data
    const updatedCart = await getCart();
    setCartState(updatedCart);
  }

  async function handleAuthSuccess() {
    const user = await getCurrentUser();
    setUserState(user);
    // Refresh cart data
    const updatedCart = await getCart();
    setCartState(updatedCart);
  }

  async function handleSignOut() {
    await signOut();
    setUserState(null);
    setCartState({ items: [], total: 0 });
  }

  async function handleCheckout() {
    if (cartState.items.length === 0) return;

    for (const item of cartState.items) {
      await removeFromCart(item.cart_item_id);
    }

    alert("Purchase Complete! Thank you for your purchase!");
    setCartState({ items: [], total: 0 });
    setCartOpen(false);
  }

  const cartItemCount = cartState.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Convert cart items to match CartDialog props format
  const cartForDialog = cartState.items.map((item) => ({
    id: item.cart_item_id,
    product_id: item.id,
    quantity: item.quantity,
    product: {
      id: item.id,
      name: item.name,
      description: "",
      price: item.price,
    },
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={userState}
        cartItemCount={cartItemCount}
        onSignInClick={() => setAuthOpen(true)}
        onSignOutClick={handleSignOut}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid
          products={products}
          currentUser={userState}
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
        cart={cartForDialog}
        currentUser={userState}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onSignInClick={() => setAuthOpen(true)}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
