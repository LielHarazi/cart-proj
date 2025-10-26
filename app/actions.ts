"use server";
import { db } from "@/scripts/db_conn";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getProducts() {
  return await db("products").select("*").orderBy("created_at", "desc");
}

export async function getCart() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { items: [] };

  const items = await db("cart_items")
    .join("products", "cart_items.product_id", "products.id")
    .where("cart_items.user_id", Number(userId))
    .select(
      "cart_items.id as cart_item_id",
      "cart_items.quantity",
      "cart_items.product_id",
      "products.name",
      "products.price"
    );

  return { items };
}

export async function addToCart(productId: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { error: "Not authenticated" };

  const existingItem = await db("cart_items")
    .where("user_id", Number(userId))
    .where("product_id", productId)
    .first();

  if (existingItem) {
    await db("cart_items")
      .where("id", existingItem.id)
      .update({ quantity: existingItem.quantity + 1 });
  } else {
    await db("cart_items").insert({
      user_id: Number(userId),
      product_id: productId,
      quantity: 1,
    });
  }

  revalidatePath("/");
}

export async function updateQuantity(cartItemId: number, quantity: number) {
  if (quantity <= 0) {
    await db("cart_items").where("id", cartItemId).del();
  } else {
    await db("cart_items").where("id", cartItemId).update({ quantity });
  }
  revalidatePath("/");
}

export async function removeFromCart(cartItemId: number) {
  await db("cart_items").where("id", cartItemId).del();
  revalidatePath("/");
}

export async function getReviews(productId: number) {
  return await db("reviews")
    .join("users", "reviews.user_id", "users.id")
    .where("reviews.product_id", productId)
    .select("reviews.*", "users.username")
    .orderBy("reviews.created_at", "desc");
}

export async function addReview(data: any) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { error: "Not authenticated" };

  await db("reviews").insert({
    ...data,
    user_id: Number(userId),
  });

  revalidatePath("/");
}

export async function signUp(data: any) {
  const existing = await db("users").where("email", data.email).first();
  if (existing) {
    return { error: "Email already exists" };
  }

  const [user] = await db("users").insert(data).returning("*");

  const cookieStore = await cookies();
  cookieStore.set("userId", String(user.id), { maxAge: 60 * 60 * 24 * 30 });

  revalidatePath("/");
  return { success: true };
}

export async function signIn(email: string) {
  const user = await db("users").where("email", email).first();
  if (!user) {
    return { error: "User not found" };
  }

  const cookieStore = await cookies();
  cookieStore.set("userId", String(user.id), { maxAge: 60 * 60 * 24 * 30 });

  revalidatePath("/");
  return { success: true };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  return await db("users").where("id", Number(userId)).first();
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  revalidatePath("/");
}

export async function completePurchase() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { error: "Not authenticated" };

  const cartItems = await db("cart_items")
    .where("user_id", Number(userId))
    .select("*");

  if (cartItems.length === 0) return { error: "Cart is empty" };

  // שמירה בטבלת purchases
  const purchases = cartItems.map((item) => ({
    user_id: Number(userId),
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  await db("purchases").insert(purchases);

  // ניקוי העגלה
  await db("cart_items").where("user_id", Number(userId)).del();

  revalidatePath("/");
  return { success: true };
}

export async function getPurchaseHistory() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return [];

  return await db("purchases")
    .join("products", "purchases.product_id", "products.id")
    .where("purchases.user_id", Number(userId))
    .select(
      "purchases.quantity",
      "purchases.created_at",
      "products.name",
      "products.price"
    )
    .orderBy("purchases.created_at", "desc");
}
