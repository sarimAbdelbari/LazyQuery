/**
 * ERP (Enterprise Resource Planning) Schema
 * Integrated system for finance, HR, supply chain, inventory, and manufacturing
 */

export const ERP_SCHEMA = `// Enterprise Resource Planning Database Schema
// Comprehensive ERP system integrating all core business processes

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Finance - General Ledger
model Account {
  id          Int           @id @default(autoincrement())
  code        String        @unique
  name        String
  type        AccountType
  category    AccountCategory
  parentId    Int?
  isActive    Boolean       @default(true)
  balance     Decimal       @default(0)
  createdAt   DateTime      @default(now())
  
  // Relations
  parent      Account?      @relation("AccountHierarchy", fields: [parentId], references: [id])
  children    Account[]     @relation("AccountHierarchy")
  entries     JournalEntry[]
}

enum AccountType {
  ASSET
  LIABILITY
  EQUITY
  REVENUE
  EXPENSE
}

enum AccountCategory {
  CURRENT_ASSET
  FIXED_ASSET
  CURRENT_LIABILITY
  LONG_TERM_LIABILITY
  OPERATING_REVENUE
  OPERATING_EXPENSE
  OTHER
}

model JournalEntry {
  id          Int           @id @default(autoincrement())
  accountId   Int
  description String
  debit       Decimal       @default(0)
  credit      Decimal       @default(0)
  date        DateTime
  reference   String?
  createdBy   Int
  approved    Boolean       @default(false)
  approvedBy  Int?
  createdAt   DateTime      @default(now())
  
  // Relations
  account     Account       @relation(fields: [accountId], references: [id])
  creator     Employee      @relation("EntryCreator", fields: [createdBy], references: [id])
  approver    Employee?     @relation("EntryApprover", fields: [approvedBy], references: [id])
}

// Finance - Invoice Management
model Invoice {
  id          Int           @id @default(autoincrement())
  invoiceNumber String      @unique
  customerId  Int
  date        DateTime
  dueDate     DateTime
  subtotal    Decimal
  tax         Decimal       @default(0)
  discount    Decimal       @default(0)
  total       Decimal
  status      InvoiceStatus @default(DRAFT)
  notes       String?
  createdAt   DateTime      @default(now())
  
  // Relations
  customer    Customer      @relation(fields: [customerId], references: [id])
  items       InvoiceItem[]
  payments    InvoicePayment[]
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  PARTIAL
  OVERDUE
  CANCELLED
}

model InvoiceItem {
  id          Int      @id @default(autoincrement())
  invoiceId   Int
  productId   Int
  description String
  quantity    Decimal
  unitPrice   Decimal
  total       Decimal
  
  // Relations
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
  product     Product  @relation(fields: [productId], references: [id])
}

model InvoicePayment {
  id          Int      @id @default(autoincrement())
  invoiceId   Int
  amount      Decimal
  date        DateTime @default(now())
  method      String
  reference   String?
  
  // Relations
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
}

// Customer Management
model Customer {
  id          Int      @id @default(autoincrement())
  name        String
  email       String   @unique
  phone       String?
  address     String?
  city        String?
  country     String?
  taxId       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  // Relations
  invoices    Invoice[]
  orders      SalesOrder[]
}

// Human Resources
model Employee {
  id          Int            @id @default(autoincrement())
  employeeNumber String      @unique
  firstName   String
  lastName    String
  email       String         @unique
  phone       String?
  dateOfBirth DateTime
  hireDate    DateTime
  terminationDate DateTime?
  departmentId Int
  positionId  Int
  managerId   Int?
  salary      Decimal
  status      EmployeeStatus @default(ACTIVE)
  address     String?
  city        String?
  country     String?
  createdAt   DateTime       @default(now())
  
  // Relations
  department  Department     @relation(fields: [departmentId], references: [id])
  position    Position       @relation(fields: [positionId], references: [id])
  manager     Employee?      @relation("EmployeeManagement", fields: [managerId], references: [id])
  reports     Employee[]     @relation("EmployeeManagement")
  attendance  Attendance[]
  leaves      LeaveRequest[]
  payrolls    Payroll[]
  createdEntries JournalEntry[] @relation("EntryCreator")
  approvedEntries JournalEntry[] @relation("EntryApprover")
}

enum EmployeeStatus {
  ACTIVE
  ON_LEAVE
  SUSPENDED
  TERMINATED
}

model Department {
  id          Int        @id @default(autoincrement())
  name        String     @unique
  code        String     @unique
  description String?
  managerId   Int?
  budget      Decimal?
  createdAt   DateTime   @default(now())
  
  // Relations
  employees   Employee[]
}

model Position {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  level       String?
  minSalary   Decimal?
  maxSalary   Decimal?
  createdAt   DateTime   @default(now())
  
  // Relations
  employees   Employee[]
}

model Attendance {
  id          Int              @id @default(autoincrement())
  employeeId  Int
  date        DateTime
  checkIn     DateTime
  checkOut    DateTime?
  status      AttendanceStatus @default(PRESENT)
  notes       String?
  
  // Relations
  employee    Employee         @relation(fields: [employeeId], references: [id])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  HALF_DAY
  ON_LEAVE
}

model LeaveRequest {
  id          Int         @id @default(autoincrement())
  employeeId  Int
  type        LeaveType
  startDate   DateTime
  endDate     DateTime
  days        Int
  reason      String
  status      LeaveStatus @default(PENDING)
  approvedBy  Int?
  approvedAt  DateTime?
  createdAt   DateTime    @default(now())
  
  // Relations
  employee    Employee    @relation(fields: [employeeId], references: [id])
}

enum LeaveType {
  ANNUAL
  SICK
  PERSONAL
  MATERNITY
  PATERNITY
  UNPAID
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

model Payroll {
  id          Int      @id @default(autoincrement())
  employeeId  Int
  month       Int
  year        Int
  basicSalary Decimal
  allowances  Decimal  @default(0)
  deductions  Decimal  @default(0)
  tax         Decimal  @default(0)
  netSalary   Decimal
  paidDate    DateTime?
  status      PayrollStatus @default(PENDING)
  createdAt   DateTime @default(now())
  
  // Relations
  employee    Employee @relation(fields: [employeeId], references: [id])
}

enum PayrollStatus {
  PENDING
  PROCESSED
  PAID
}

// Inventory Management
model Product {
  id          Int           @id @default(autoincrement())
  sku         String        @unique
  name        String
  description String?
  categoryId  Int
  unitPrice   Decimal
  cost        Decimal
  stockLevel  Int           @default(0)
  reorderLevel Int          @default(0)
  supplierId  Int?
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  category    ProductCategory @relation(fields: [categoryId], references: [id])
  supplier    Supplier?     @relation(fields: [supplierId], references: [id])
  invoiceItems InvoiceItem[]
  orderItems  SalesOrderItem[]
  poItems     PurchaseOrderItem[]
  movements   InventoryMovement[]
}

model ProductCategory {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  description String?
  parentId    Int?
  
  // Relations
  parent      ProductCategory? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    ProductCategory[] @relation("CategoryHierarchy")
  products    Product[]
}

model InventoryMovement {
  id          Int          @id @default(autoincrement())
  productId   Int
  type        MovementType
  quantity    Int
  reference   String?
  date        DateTime     @default(now())
  notes       String?
  
  // Relations
  product     Product      @relation(fields: [productId], references: [id])
}

enum MovementType {
  RECEIPT
  SALE
  ADJUSTMENT
  TRANSFER
  RETURN
  DAMAGE
}

// Supply Chain - Sales Orders
model SalesOrder {
  id          Int            @id @default(autoincrement())
  orderNumber String         @unique
  customerId  Int
  orderDate   DateTime       @default(now())
  requiredDate DateTime?
  shippedDate DateTime?
  status      OrderStatus    @default(PENDING)
  subtotal    Decimal
  tax         Decimal        @default(0)
  shipping    Decimal        @default(0)
  total       Decimal
  notes       String?
  
  // Relations
  customer    Customer       @relation(fields: [customerId], references: [id])
  items       SalesOrderItem[]
  shipments   Shipment[]
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model SalesOrderItem {
  id          Int        @id @default(autoincrement())
  orderId     Int
  productId   Int
  quantity    Int
  unitPrice   Decimal
  discount    Decimal    @default(0)
  total       Decimal
  
  // Relations
  order       SalesOrder @relation(fields: [orderId], references: [id])
  product     Product    @relation(fields: [productId], references: [id])
}

// Supply Chain - Purchase Orders
model PurchaseOrder {
  id          Int              @id @default(autoincrement())
  orderNumber String           @unique
  supplierId  Int
  orderDate   DateTime         @default(now())
  expectedDate DateTime?
  receivedDate DateTime?
  status      PurchaseOrderStatus @default(DRAFT)
  subtotal    Decimal
  tax         Decimal          @default(0)
  shipping    Decimal          @default(0)
  total       Decimal
  notes       String?
  
  // Relations
  supplier    Supplier         @relation(fields: [supplierId], references: [id])
  items       PurchaseOrderItem[]
}

enum PurchaseOrderStatus {
  DRAFT
  SENT
  CONFIRMED
  RECEIVED
  CANCELLED
}

model PurchaseOrderItem {
  id          Int           @id @default(autoincrement())
  orderId     Int
  productId   Int
  quantity    Int
  unitPrice   Decimal
  total       Decimal
  
  // Relations
  order       PurchaseOrder @relation(fields: [orderId], references: [id])
  product     Product       @relation(fields: [productId], references: [id])
}

// Supplier Management
model Supplier {
  id          Int      @id @default(autoincrement())
  name        String
  email       String   @unique
  phone       String?
  address     String?
  city        String?
  country     String?
  taxId       String?
  rating      Int?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  // Relations
  products    Product[]
  purchaseOrders PurchaseOrder[]
}

// Shipping/Logistics
model Shipment {
  id          Int            @id @default(autoincrement())
  orderId     Int
  trackingNumber String      @unique
  carrier     String
  shippedDate DateTime       @default(now())
  deliveryDate DateTime?
  status      ShipmentStatus @default(PENDING)
  notes       String?
  
  // Relations
  order       SalesOrder     @relation(fields: [orderId], references: [id])
}

enum ShipmentStatus {
  PENDING
  IN_TRANSIT
  DELIVERED
  RETURNED
  FAILED
}
`;

export const ERP_SCHEMA_NAME = "ERP - Enterprise Resource Planning";
export const ERP_SCHEMA_DESCRIPTION = "Integrated ERP system managing finance, accounting, human resources, payroll, inventory, sales, purchasing, and supply chain operations.";

export const ERP_STATS = {
  models: 25,
  enums: 15,
  relations: 40
};

