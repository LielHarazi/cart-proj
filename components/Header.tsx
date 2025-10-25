"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut } from "lucide-react";

interface UserType {
  id: number;
  username: string;
  email: string;
}

interface HeaderProps {
  currentUser: UserType | null;
  cartItemCount: number;
  onSignInClick: () => void;
  onSignOutClick: () => void;
  onCartClick: () => void;
}

export default function Header({
  currentUser,
  cartItemCount,
  onSignInClick,
  onSignOutClick,
  onCartClick,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Hello, {currentUser.username}
                </span>
                <Button variant="ghost" size="sm" onClick={onSignOutClick}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" onClick={onSignInClick}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cartItemCount})
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
