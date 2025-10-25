import { db } from "./db_conn";

async function test() {
  // 1️⃣ USERS TABLE
  const hasUsers = await db.schema.hasTable("users");
  if (!hasUsers) {
    await db.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username", 50).notNullable().unique();
      table.string("email", 100).notNullable().unique();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }
  // 2️⃣ PRODUCTS TABLE
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

  // 3️⃣ REVIEWS TABLE
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

  // 4️⃣ CARTS TABLE
  const hasCarts = await db.schema.hasTable("carts");
  if (!hasCarts) {
    await db.schema.createTable("carts", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("status", 20).defaultTo("active");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 5️⃣ CART_ITEMS TABLE
  const hasCartItems = await db.schema.hasTable("cart_items");
  if (!hasCartItems) {
    await db.schema.createTable("cart_items", (table) => {
      table.increments("id").primary();
      table
        .integer("cart_id")
        .unsigned()
        .references("id")
        .inTable("carts")
        .onDelete("CASCADE");
      table
        .integer("product_id")
        .unsigned()
        .references("id")
        .inTable("products")
        .onDelete("CASCADE");
      table.integer("quantity").defaultTo(1).checkPositive();
    });
  }

  console.log("✅ All tables created successfully!");
}

test().catch((err) => {
  console.error("Error:", err);
  db.destroy();
});
