/**
 * DMS (Document Management System) Schema
 * Enterprise document management with folders, permissions, versions, and workflows
 */

export const DMS_SCHEMA = `// Document Management System Database Schema
// Secure document storage, organization, and collaboration platform

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Document Management
model Document {
  id          Int            @id @default(autoincrement())
  name        String
  description String?
  fileName    String
  fileSize    Int
  mimeType    String
  folderId    Int?
  ownerId     Int
  status      DocumentStatus @default(DRAFT)
  currentVersionId Int?
  checkoutBy  Int?
  checkoutAt  DateTime?
  tags        String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  // Relations
  folder      Folder?        @relation(fields: [folderId], references: [id])
  owner       User           @relation("DocumentOwner", fields: [ownerId], references: [id])
  checkedOutBy User?         @relation("DocumentCheckout", fields: [checkoutBy], references: [id])
  versions    DocumentVersion[]
  permissions DocumentPermission[]
  workflows   WorkflowInstance[]
  comments    Comment[]
  activities  AuditLog[]
  metadata    DocumentMetadata[]
}

enum DocumentStatus {
  DRAFT
  IN_REVIEW
  APPROVED
  PUBLISHED
  ARCHIVED
  DELETED
}

// Folder/Directory Structure
model Folder {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  parentId    Int?
  ownerId     Int
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  parent      Folder?  @relation("FolderHierarchy", fields: [parentId], references: [id])
  children    Folder[] @relation("FolderHierarchy")
  owner       User     @relation(fields: [ownerId], references: [id])
  documents   Document[]
  permissions FolderPermission[]
}

// Document Version Control
model DocumentVersion {
  id          Int      @id @default(autoincrement())
  documentId  Int
  versionNumber Int
  fileName    String
  fileSize    Int
  fileUrl     String
  checksum    String
  comment     String?
  createdBy   Int
  createdAt   DateTime @default(now())
  
  // Relations
  document    Document @relation(fields: [documentId], references: [id])
  creator     User     @relation(fields: [createdBy], references: [id])
}

// Permission Management
model DocumentPermission {
  id          Int                @id @default(autoincrement())
  documentId  Int
  userId      Int?
  groupId     Int?
  permission  PermissionLevel
  grantedBy   Int
  grantedAt   DateTime           @default(now())
  expiresAt   DateTime?
  
  // Relations
  document    Document           @relation(fields: [documentId], references: [id])
  user        User?              @relation("UserDocumentPermissions", fields: [userId], references: [id])
  group       UserGroup?         @relation(fields: [groupId], references: [id])
  grantor     User               @relation("PermissionGrantor", fields: [grantedBy], references: [id])
}

model FolderPermission {
  id          Int                @id @default(autoincrement())
  folderId    Int
  userId      Int?
  groupId     Int?
  permission  PermissionLevel
  grantedBy   Int
  grantedAt   DateTime           @default(now())
  expiresAt   DateTime?
  
  // Relations
  folder      Folder             @relation(fields: [folderId], references: [id])
  user        User?              @relation("UserFolderPermissions", fields: [userId], references: [id])
  group       UserGroup?         @relation(fields: [groupId], references: [id])
  grantor     User               @relation("FolderPermissionGrantor", fields: [grantedBy], references: [id])
}

enum PermissionLevel {
  VIEW
  COMMENT
  EDIT
  MANAGE
  FULL_CONTROL
}

// Workflow Management
model WorkflowTemplate {
  id          Int          @id @default(autoincrement())
  name        String
  description String?
  type        WorkflowType
  createdBy   Int
  isActive    Boolean      @default(true)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  creator     User         @relation(fields: [createdBy], references: [id])
  steps       WorkflowStep[]
  instances   WorkflowInstance[]
}

enum WorkflowType {
  APPROVAL
  REVIEW
  SIGNATURE
  PUBLICATION
  CUSTOM
}

model WorkflowStep {
  id          Int              @id @default(autoincrement())
  templateId  Int
  stepNumber  Int
  name        String
  description String?
  assignedTo  Int?
  groupId     Int?
  action      WorkflowAction
  dueInDays   Int?
  
  // Relations
  template    WorkflowTemplate @relation(fields: [templateId], references: [id])
  assignee    User?            @relation("WorkflowStepAssignee", fields: [assignedTo], references: [id])
  group       UserGroup?       @relation(fields: [groupId], references: [id])
  executions  WorkflowStepExecution[]
}

enum WorkflowAction {
  APPROVE
  REJECT
  REVIEW
  SIGN
  ACKNOWLEDGE
  CUSTOM
}

model WorkflowInstance {
  id          Int              @id @default(autoincrement())
  templateId  Int
  documentId  Int
  initiatedBy Int
  status      WorkflowStatus   @default(IN_PROGRESS)
  currentStep Int              @default(1)
  startedAt   DateTime         @default(now())
  completedAt DateTime?
  
  // Relations
  template    WorkflowTemplate @relation(fields: [templateId], references: [id])
  document    Document         @relation(fields: [documentId], references: [id])
  initiator   User             @relation(fields: [initiatedBy], references: [id])
  executions  WorkflowStepExecution[]
}

enum WorkflowStatus {
  IN_PROGRESS
  COMPLETED
  CANCELLED
  FAILED
}

model WorkflowStepExecution {
  id          Int              @id @default(autoincrement())
  instanceId  Int
  stepId      Int
  assignedTo  Int
  status      ExecutionStatus  @default(PENDING)
  action      WorkflowAction
  comment     String?
  executedAt  DateTime?
  createdAt   DateTime         @default(now())
  
  // Relations
  instance    WorkflowInstance @relation(fields: [instanceId], references: [id])
  step        WorkflowStep     @relation(fields: [stepId], references: [id])
  executor    User             @relation(fields: [assignedTo], references: [id])
}

enum ExecutionStatus {
  PENDING
  IN_PROGRESS
  APPROVED
  REJECTED
  COMPLETED
  SKIPPED
}

// Comment/Collaboration
model Comment {
  id          Int      @id @default(autoincrement())
  documentId  Int
  userId      Int
  parentId    Int?
  content     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  document    Document @relation(fields: [documentId], references: [id])
  author      User     @relation(fields: [userId], references: [id])
  parent      Comment? @relation("CommentThread", fields: [parentId], references: [id])
  replies     Comment[] @relation("CommentThread")
}

// Document Metadata
model DocumentMetadata {
  id          Int      @id @default(autoincrement())
  documentId  Int
  key         String
  value       String
  createdAt   DateTime @default(now())
  
  // Relations
  document    Document @relation(fields: [documentId], references: [id])
}

// Audit Log
model AuditLog {
  id          Int        @id @default(autoincrement())
  documentId  Int?
  userId      Int
  action      AuditAction
  details     String?
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime   @default(now())
  
  // Relations
  document    Document?  @relation(fields: [documentId], references: [id])
  user        User       @relation(fields: [userId], references: [id])
}

enum AuditAction {
  CREATED
  VIEWED
  DOWNLOADED
  EDITED
  DELETED
  SHARED
  PERMISSION_CHANGED
  CHECKED_OUT
  CHECKED_IN
  VERSION_CREATED
  WORKFLOW_STARTED
  WORKFLOW_COMPLETED
  COMMENT_ADDED
}

// User Management
model User {
  id          Int        @id @default(autoincrement())
  email       String     @unique
  firstName   String
  lastName    String
  username    String     @unique
  department  String?
  title       String?
  phone       String?
  role        UserRole   @default(USER)
  isActive    Boolean    @default(true)
  lastLogin   DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relations
  ownedDocuments Document[] @relation("DocumentOwner")
  checkedOutDocuments Document[] @relation("DocumentCheckout")
  ownedFolders Folder[]
  documentPermissions DocumentPermission[] @relation("UserDocumentPermissions")
  folderPermissions FolderPermission[] @relation("UserFolderPermissions")
  grantedDocPermissions DocumentPermission[] @relation("PermissionGrantor")
  grantedFolderPermissions FolderPermission[] @relation("FolderPermissionGrantor")
  versions    DocumentVersion[]
  workflowTemplates WorkflowTemplate[]
  assignedSteps WorkflowStep[] @relation("WorkflowStepAssignee")
  initiatedWorkflows WorkflowInstance[]
  stepExecutions WorkflowStepExecution[]
  comments    Comment[]
  auditLogs   AuditLog[]
  groupMemberships UserGroupMember[]
}

enum UserRole {
  ADMIN
  MANAGER
  USER
  GUEST
}

// User Groups
model UserGroup {
  id          Int        @id @default(autoincrement())
  name        String     @unique
  description String?
  createdAt   DateTime   @default(now())
  
  // Relations
  members     UserGroupMember[]
  documentPermissions DocumentPermission[]
  folderPermissions FolderPermission[]
  workflowSteps WorkflowStep[]
}

model UserGroupMember {
  id          Int       @id @default(autoincrement())
  groupId     Int
  userId      Int
  addedAt     DateTime  @default(now())
  
  // Relations
  group       UserGroup @relation(fields: [groupId], references: [id])
  user        User      @relation(fields: [userId], references: [id])
}
`;

export const DMS_SCHEMA_NAME = "DMS - Document Management System";
export const DMS_SCHEMA_DESCRIPTION = "Enterprise document management platform with version control, permissions, workflows, collaboration tools, and comprehensive audit trails.";

export const DMS_STATS = {
  models: 15,
  enums: 8,
  relations: 35
};

