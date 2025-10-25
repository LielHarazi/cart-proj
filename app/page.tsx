import Shop from "@/components/shop";
import { getProducts, getCart, getCurrentUser } from "@/app/actions";

export default async function Home() {
  const [products, cart, currentUser] = await Promise.all([
    getProducts(),
    getCart(),
    getCurrentUser(),
  ]);

  return <Shop products={products} cart={cart} currentUser={currentUser} />;
}
