/**
 * PMS (Property Management System) Schema
 * Comprehensive system for managing properties, units, leases, tenants, and maintenance
 */

export const PMS_SCHEMA = `// Property Management System Database Schema
// Complete solution for real estate and property management

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Property Management
model Property {
  id          Int            @id @default(autoincrement())
  name        String
  address     String
  city        String
  state       String
  zipCode     String
  country     String
  type        PropertyType
  status      PropertyStatus @default(ACTIVE)
  yearBuilt   Int?
  totalUnits  Int
  ownerId     Int
  managerId   Int
  description String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  // Relations
  owner       PropertyOwner  @relation(fields: [ownerId], references: [id])
  manager     User           @relation(fields: [managerId], references: [id])
  units       Unit[]
  amenities   PropertyAmenity[]
  documents   Document[]
  expenses    Expense[]
}

enum PropertyType {
  RESIDENTIAL
  COMMERCIAL
  INDUSTRIAL
  MIXED_USE
  LAND
}

enum PropertyStatus {
  ACTIVE
  INACTIVE
  UNDER_CONSTRUCTION
  SOLD
}

// Unit Management
model Unit {
  id          Int        @id @default(autoincrement())
  propertyId  Int
  unitNumber  String
  floor       Int?
  bedrooms    Int
  bathrooms   Decimal
  sqft        Int
  type        UnitType
  status      UnitStatus @default(VACANT)
  monthlyRent Decimal
  description String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relations
  property    Property   @relation(fields: [propertyId], references: [id])
  leases      Lease[]
  maintenanceRequests MaintenanceRequest[]
  inspections Inspection[]
}

enum UnitType {
  STUDIO
  ONE_BEDROOM
  TWO_BEDROOM
  THREE_BEDROOM
  PENTHOUSE
  OFFICE
  RETAIL
  WAREHOUSE
}

enum UnitStatus {
  VACANT
  OCCUPIED
  MAINTENANCE
  RESERVED
}

// Tenant Management
model Tenant {
  id          Int          @id @default(autoincrement())
  firstName   String
  lastName    String
  email       String       @unique
  phone       String
  dateOfBirth DateTime
  ssn         String?
  emergencyContact String?
  emergencyPhone String?
  status      TenantStatus @default(ACTIVE)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  leases      Lease[]
  payments    Payment[]
  maintenanceRequests MaintenanceRequest[]
  documents   Document[]
}

enum TenantStatus {
  ACTIVE
  INACTIVE
  BLACKLISTED
}

// Lease Management
model Lease {
  id          Int         @id @default(autoincrement())
  unitId      Int
  tenantId    Int
  startDate   DateTime
  endDate     DateTime
  monthlyRent Decimal
  securityDeposit Decimal
  status      LeaseStatus @default(ACTIVE)
  paymentDay  Int         @default(1)
  terms       String?
  signedAt    DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  unit        Unit        @relation(fields: [unitId], references: [id])
  tenant      Tenant      @relation(fields: [tenantId], references: [id])
  payments    Payment[]
  violations  LeaseViolation[]
}

enum LeaseStatus {
  DRAFT
  ACTIVE
  EXPIRED
  TERMINATED
  RENEWED
}

// Payment Management
model Payment {
  id          Int           @id @default(autoincrement())
  leaseId     Int
  tenantId    Int
  amount      Decimal
  dueDate     DateTime
  paidDate    DateTime?
  type        PaymentType   @default(RENT)
  method      PaymentMethod?
  status      PaymentStatus @default(PENDING)
  late        Boolean       @default(false)
  lateFee     Decimal?      @default(0)
  reference   String?
  notes       String?
  createdAt   DateTime      @default(now())
  
  // Relations
  lease       Lease         @relation(fields: [leaseId], references: [id])
  tenant      Tenant        @relation(fields: [tenantId], references: [id])
}

enum PaymentType {
  RENT
  SECURITY_DEPOSIT
  LATE_FEE
  UTILITIES
  PARKING
  PET_FEE
  OTHER
}

enum PaymentMethod {
  CASH
  CHECK
  CREDIT_CARD
  DEBIT_CARD
  BANK_TRANSFER
  ONLINE
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIAL
  OVERDUE
  CANCELLED
}

// Maintenance Management
model MaintenanceRequest {
  id          Int                  @id @default(autoincrement())
  unitId      Int
  tenantId    Int?
  title       String
  description String
  category    MaintenanceCategory
  priority    MaintenancePriority  @default(MEDIUM)
  status      MaintenanceStatus    @default(OPEN)
  assignedTo  Int?
  reportedAt  DateTime             @default(now())
  scheduledAt DateTime?
  completedAt DateTime?
  cost        Decimal?
  notes       String?
  
  // Relations
  unit        Unit                 @relation(fields: [unitId], references: [id])
  tenant      Tenant?              @relation(fields: [tenantId], references: [id])
  assignee    User?                @relation(fields: [assignedTo], references: [id])
}

enum MaintenanceCategory {
  PLUMBING
  ELECTRICAL
  HVAC
  APPLIANCE
  STRUCTURAL
  CLEANING
  LANDSCAPING
  PEST_CONTROL
  SECURITY
  OTHER
}

enum MaintenancePriority {
  LOW
  MEDIUM
  HIGH
  EMERGENCY
}

enum MaintenanceStatus {
  OPEN
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

// Inspection Management
model Inspection {
  id          Int              @id @default(autoincrement())
  unitId      Int
  type        InspectionType
  scheduledAt DateTime
  completedAt DateTime?
  inspectorId Int
  status      InspectionStatus @default(SCHEDULED)
  notes       String?
  passed      Boolean?
  createdAt   DateTime         @default(now())
  
  // Relations
  unit        Unit             @relation(fields: [unitId], references: [id])
  inspector   User             @relation(fields: [inspectorId], references: [id])
}

enum InspectionType {
  MOVE_IN
  MOVE_OUT
  ROUTINE
  ANNUAL
  MAINTENANCE
  SAFETY
}

enum InspectionStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// Property Owner Management
model PropertyOwner {
  id          Int        @id @default(autoincrement())
  name        String
  email       String     @unique
  phone       String
  type        OwnerType  @default(INDIVIDUAL)
  taxId       String?
  address     String
  city        String
  state       String
  zipCode     String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relations
  properties  Property[]
  expenses    Expense[]
}

enum OwnerType {
  INDIVIDUAL
  COMPANY
  TRUST
  LLC
}

// Expense Management
model Expense {
  id          Int           @id @default(autoincrement())
  propertyId  Int
  ownerId     Int
  category    ExpenseCategory
  amount      Decimal
  description String
  date        DateTime
  vendor      String?
  receipt     String?
  createdAt   DateTime      @default(now())
  
  // Relations
  property    Property      @relation(fields: [propertyId], references: [id])
  owner       PropertyOwner @relation(fields: [ownerId], references: [id])
}

enum ExpenseCategory {
  MAINTENANCE
  REPAIRS
  UTILITIES
  INSURANCE
  PROPERTY_TAX
  HOA_FEES
  MANAGEMENT_FEES
  MARKETING
  LEGAL
  OTHER
}

// Document Management
model Document {
  id          Int          @id @default(autoincrement())
  propertyId  Int?
  tenantId    Int?
  name        String
  type        DocumentType
  fileUrl     String
  fileSize    Int
  uploadedBy  Int
  createdAt   DateTime     @default(now())
  
  // Relations
  property    Property?    @relation(fields: [propertyId], references: [id])
  tenant      Tenant?      @relation(fields: [tenantId], references: [id])
  uploader    User         @relation(fields: [uploadedBy], references: [id])
}

enum DocumentType {
  LEASE_AGREEMENT
  INSURANCE_POLICY
  INSPECTION_REPORT
  INVOICE
  RECEIPT
  PHOTO
  ID_VERIFICATION
  BACKGROUND_CHECK
  OTHER
}

// Amenity Management
model PropertyAmenity {
  id          Int      @id @default(autoincrement())
  propertyId  Int
  name        String
  description String?
  isAvailable Boolean  @default(true)
  
  // Relations
  property    Property @relation(fields: [propertyId], references: [id])
}

// Lease Violation Tracking
model LeaseViolation {
  id          Int        @id @default(autoincrement())
  leaseId     Int
  type        ViolationType
  description String
  date        DateTime   @default(now())
  resolved    Boolean    @default(false)
  resolvedAt  DateTime?
  
  // Relations
  lease       Lease      @relation(fields: [leaseId], references: [id])
}

enum ViolationType {
  LATE_PAYMENT
  NOISE_COMPLAINT
  UNAUTHORIZED_PET
  UNAUTHORIZED_OCCUPANT
  PROPERTY_DAMAGE
  PARKING_VIOLATION
  SMOKING
  OTHER
}

// User/Staff Management
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  firstName   String
  lastName    String
  phone       String?
  role        UserRole @default(STAFF)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  properties  Property[]
  maintenanceRequests MaintenanceRequest[]
  inspections Inspection[]
  documents   Document[]
}

enum UserRole {
  ADMIN
  PROPERTY_MANAGER
  MAINTENANCE_STAFF
  INSPECTOR
  STAFF
}
`;

export const PMS_SCHEMA_NAME = "PMS - Property Management System";
export const PMS_SCHEMA_DESCRIPTION = "Complete property management solution for handling properties, units, leases, tenants, maintenance, and financial operations.";

export const PMS_STATS = {
  models: 14,
  enums: 17,
  relations: 28
};

