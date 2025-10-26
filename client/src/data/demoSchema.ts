/**
 * Demo Schema
 * Example Prisma schema to showcase the visualizer capabilities
 */

export const DEMO_SCHEMA = `// E-Commerce Database Schema Example
// This is a demonstration of LazyQuery's visualization capabilities

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Management
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      UserRole @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  orders    Order[]
  reviews   Review[]
  cart      Cart?
  addresses Address[]
}

enum UserRole {
  ADMIN
  CUSTOMER
  VENDOR
}

// Product Catalog
model Category {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  description String?
  slug        String    @unique
  createdAt   DateTime  @default(now())
  
  // Relations
  products    Product[]
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Decimal
  stock       Int      @default(0)
  categoryId  Int
  status      ProductStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  category    Category @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  reviews     Review[]
  cartItems   CartItem[]
}

enum ProductStatus {
  ACTIVE
  INACTIVE
  OUT_OF_STOCK
}

// Shopping Cart
model Cart {
  id        Int        @id @default(autoincrement())
  userId    Int        @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  // Relations
  user      User       @relation(fields: [userId], references: [id])
  items     CartItem[]
}

model CartItem {
  id        Int      @id @default(autoincrement())
  cartId    Int
  productId Int
  quantity  Int      @default(1)
  addedAt   DateTime @default(now())
  
  // Relations
  cart      Cart     @relation(fields: [cartId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}

// Order Management
model Order {
  id          Int         @id @default(autoincrement())
  orderNumber String      @unique
  userId      Int
  status      OrderStatus @default(PENDING)
  total       Decimal
  addressId   Int
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  user        User        @relation(fields: [userId], references: [id])
  address     Address     @relation(fields: [addressId], references: [id])
  items       OrderItem[]
  payment     Payment?
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Decimal
  
  // Relations
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

// Payment
model Payment {
  id            Int           @id @default(autoincrement())
  orderId       Int           @unique
  amount        Decimal
  method        PaymentMethod
  status        PaymentStatus @default(PENDING)
  transactionId String?       @unique
  paidAt        DateTime?
  createdAt     DateTime      @default(now())
  
  // Relations
  order         Order         @relation(fields: [orderId], references: [id])
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PAYPAL
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

// User Address
model Address {
  id         Int      @id @default(autoincrement())
  userId     Int
  street     String
  city       String
  state      String
  zipCode    String
  country    String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
  
  // Relations
  user       User     @relation(fields: [userId], references: [id])
  orders     Order[]
}

// Product Reviews
model Review {
  id        Int      @id @default(autoincrement())
  productId Int
  userId    Int
  rating    Int
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  product   Product  @relation(fields: [productId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}
`;

export const DEMO_SCHEMA_NAME = "E-Commerce Demo";
export const DEMO_SCHEMA_DESCRIPTION = "A complete e-commerce database schema showcasing users, products, orders, payments, and reviews with proper relationships.";

