"use client";

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

interface CartItem {
  cart_item_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
}

interface CartDialogProps {
  cart: CartItem[];
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSignInClick: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCheckout: () => void;
}

export default function CartDialog({
  cart,
  currentUser,
  isOpen,
  onClose,
  onSignInClick,
  onUpdateQuantity,
  onCheckout,
}: CartDialogProps) {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto backdrop-blur-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {!currentUser ? (
            <div className="text-center py-8">
              <p className="mb-4">Sign in to view your cart</p>
              <button
                onClick={() => {
                  onSignInClick();
                  onClose();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          ) : cart.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.cart_item_id, item.quantity - 1)
                      }
                      className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.cart_item_id, item.quantity + 1)
                      }
                      className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total: ${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full mt-4 bg-green-500 text-white py-3 rounded hover:bg-green-600 font-semibold"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
