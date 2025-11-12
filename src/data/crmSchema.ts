/**
 * CRM (Customer Relationship Management) Schema
 * Salesforce-inspired database for managing leads, accounts, contacts, and sales pipeline
 */

export const CRM_SCHEMA = `// CRM System Database Schema
// Comprehensive customer relationship management solution

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Account Management
model Account {
  id          Int            @id @default(autoincrement())
  name        String
  industry    String?
  website     String?
  phone       String?
  email       String?
  employees   Int?
  revenue     Decimal?
  type        AccountType    @default(PROSPECT)
  status      AccountStatus  @default(ACTIVE)
  ownerId     Int
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  // Relations
  owner       User           @relation(fields: [ownerId], references: [id])
  contacts    Contact[]
  opportunities Opportunity[]
  activities  Activity[]
  addresses   Address[]
}

enum AccountType {
  PROSPECT
  CUSTOMER
  PARTNER
  RESELLER
  COMPETITOR
}

enum AccountStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

// Lead Management
model Lead {
  id          Int         @id @default(autoincrement())
  firstName   String
  lastName    String
  email       String      @unique
  phone       String?
  company     String?
  title       String?
  industry    String?
  status      LeadStatus  @default(NEW)
  source      LeadSource  @default(WEBSITE)
  rating      LeadRating  @default(COLD)
  ownerId     Int
  convertedAccountId Int?
  convertedAt DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  owner       User        @relation(fields: [ownerId], references: [id])
  activities  Activity[]
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  UNQUALIFIED
  CONVERTED
  LOST
}

enum LeadSource {
  WEBSITE
  REFERRAL
  CAMPAIGN
  SOCIAL_MEDIA
  EVENT
  COLD_CALL
  OTHER
}

enum LeadRating {
  HOT
  WARM
  COLD
}

// Contact Management
model Contact {
  id          Int           @id @default(autoincrement())
  firstName   String
  lastName    String
  email       String        @unique
  phone       String?
  mobile      String?
  title       String?
  department  String?
  accountId   Int
  isPrimary   Boolean       @default(false)
  status      ContactStatus @default(ACTIVE)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  account     Account       @relation(fields: [accountId], references: [id])
  activities  Activity[]
}

enum ContactStatus {
  ACTIVE
  INACTIVE
  BOUNCED
}

// Opportunity/Deal Management
model Opportunity {
  id          Int               @id @default(autoincrement())
  name        String
  accountId   Int
  amount      Decimal
  stage       OpportunityStage  @default(PROSPECTING)
  probability Int               @default(0)
  closeDate   DateTime
  ownerId     Int
  description String?
  type        OpportunityType   @default(NEW_BUSINESS)
  status      OpportunityStatus @default(OPEN)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  // Relations
  account     Account           @relation(fields: [accountId], references: [id])
  owner       User              @relation(fields: [ownerId], references: [id])
  activities  Activity[]
  products    OpportunityProduct[]
}

enum OpportunityStage {
  PROSPECTING
  QUALIFICATION
  NEEDS_ANALYSIS
  VALUE_PROPOSITION
  PROPOSAL
  NEGOTIATION
  CLOSED_WON
  CLOSED_LOST
}

enum OpportunityType {
  NEW_BUSINESS
  EXISTING_BUSINESS
  RENEWAL
}

enum OpportunityStatus {
  OPEN
  WON
  LOST
}

// Product Catalog
model Product {
  id          Int         @id @default(autoincrement())
  name        String
  code        String      @unique
  description String?
  category    String?
  price       Decimal
  cost        Decimal?
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  opportunities OpportunityProduct[]
}

model OpportunityProduct {
  id             Int         @id @default(autoincrement())
  opportunityId  Int
  productId      Int
  quantity       Int         @default(1)
  unitPrice      Decimal
  discount       Decimal?    @default(0)
  total          Decimal
  
  // Relations
  opportunity    Opportunity @relation(fields: [opportunityId], references: [id])
  product        Product     @relation(fields: [productId], references: [id])
}

// Activity Tracking
model Activity {
  id          Int          @id @default(autoincrement())
  subject     String
  type        ActivityType
  status      ActivityStatus @default(PLANNED)
  priority    Priority     @default(MEDIUM)
  description String?
  dueDate     DateTime?
  completedAt DateTime?
  ownerId     Int
  accountId   Int?
  contactId   Int?
  leadId      Int?
  opportunityId Int?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  owner       User         @relation(fields: [ownerId], references: [id])
  account     Account?     @relation(fields: [accountId], references: [id])
  contact     Contact?     @relation(fields: [contactId], references: [id])
  lead        Lead?        @relation(fields: [leadId], references: [id])
  opportunity Opportunity? @relation(fields: [opportunityId], references: [id])
}

enum ActivityType {
  CALL
  EMAIL
  MEETING
  TASK
  DEMO
  PRESENTATION
}

enum ActivityStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

// User Management
model User {
  id          Int           @id @default(autoincrement())
  email       String        @unique
  firstName   String
  lastName    String
  phone       String?
  role        UserRole      @default(SALES_REP)
  isActive    Boolean       @default(true)
  managerId   Int?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  manager     User?         @relation("UserManagement", fields: [managerId], references: [id])
  reports     User[]        @relation("UserManagement")
  accounts    Account[]
  leads       Lead[]
  opportunities Opportunity[]
  activities  Activity[]
}

enum UserRole {
  ADMIN
  SALES_MANAGER
  SALES_REP
  MARKETING
  SUPPORT
}

// Address
model Address {
  id        Int      @id @default(autoincrement())
  accountId Int
  street    String
  city      String
  state     String
  zipCode   String
  country   String
  type      AddressType @default(BILLING)
  createdAt DateTime @default(now())
  
  // Relations
  account   Account  @relation(fields: [accountId], references: [id])
}

enum AddressType {
  BILLING
  SHIPPING
  OFFICE
}
`;

export const CRM_SCHEMA_NAME = "CRM - Customer Relationship Management";
export const CRM_SCHEMA_DESCRIPTION = "Salesforce-inspired CRM system for managing leads, accounts, contacts, opportunities, and sales pipeline with complete activity tracking.";

export const CRM_STATS = {
  models: 11,
  enums: 14,
  relations: 22
};

