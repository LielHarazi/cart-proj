import { db } from "./db_conn";

async function test() {
  // מחיקת הטבלאות הישנות בסדר הנכון (תחילה התלויות)
  const hasOldCartItems = await db.schema.hasTable("cart_items");
  if (hasOldCartItems) {
    await db.schema.dropTable("cart_items");
    console.log("🗑️ Dropped old 'cart_items' table");
  }

  const hasOldCarts = await db.schema.hasTable("carts");
  if (hasOldCarts) {
    await db.schema.dropTable("carts");
    console.log("🗑️ Dropped old 'carts' table");
  }

  const hasUsers = await db.schema.hasTable("users");
  if (!hasUsers) {
    await db.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username", 50).notNullable().unique();
      table.string("email", 100).notNullable().unique();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  const hasProducts = await db.schema.hasTable("products");
  if (!hasProducts) {
    await db.schema.createTable("products", (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable();
      table.text("description");
      table.decimal("price", 10, 2).notNullable();
      table.text("image_url");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  const hasReviews = await db.schema.hasTable("reviews");
  if (!hasReviews) {
    await db.schema.createTable("reviews", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("product_id")
        .unsigned()
        .references("id")
        .inTable("products")
        .onDelete("CASCADE");
      table.integer("rating").notNullable().checkBetween([1, 5]);
      table.text("comment");
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.unique(["user_id", "product_id"]);
    });
  }

  // יצירת cart_items חדש עם המבנה הפשוט
  await db.schema.createTable("cart_items", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.integer("quantity").defaultTo(1).checkPositive();
  });
  console.log("✅ Created new simplified 'cart_items' table");

  const hasPurchases = await db.schema.hasTable("purchases");
  if (!hasPurchases) {
    await db.schema.createTable("purchases", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("product_id")
        .unsigned()
        .references("id")
        .inTable("products")
        .onDelete("CASCADE");
      table.integer("quantity").notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  console.log("✅ All tables created successfully!");
}

test().catch((err) => {
  console.error("Error:", err);
  db.destroy();
});
