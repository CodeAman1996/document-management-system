# Document Management System (NestJS + Role-Based Auth + Ingestion Microservice)

A robust, scalable document management system built using **NestJS**, supporting:

- Secure file uploads (local and ready for AWS S3)
- Role-based authentication with JWT & Guards
- CRUD operations on documents
- Microservice-based ingestion trigger (Python backend compatible)
- Production-ready structure with DTOs, validation, testing, and modularity

---

## Features

| Feature                | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| Document Upload        | Upload files (currently stored locally, pluggable to S3)            |
| Role-Based Access      | Admin, Editor, Viewer roles with route protection using guards      |
| Document CRUD          | Create, Read, Update, Delete documents                              |
| Testing                | Unit and E2E test cases with Jest                                   |
| Ingestion Microservice | RabbitMQ-based ingestion trigger + status management                |
| JWT Auth               | Login-based secure JWT auth with role injected via payload          |
| Custom Decorators      | `@Roles()` and `@SkipAuthGuard()` for access control                |
| Modular & Maintainable | Clean folder structure with helpers, services, guards, interceptors |

---

## Entity Relationship

### Document ⟶ User

- A `User` can have **multiple Documents**.
- A `Document` always belongs to **exactly one User**.
- This relationship is enforced using a `@ManyToOne` and `@OneToMany` mapping via TypeORM.
- Only the owner of a document (based on `ownerId`) can access, update, or delete it — unless the user is an Admin.

````ts
// user.entity.ts
@OneToMany(() => Document, (document) => document.owner)
documents: Document[];

// document.entity.ts
@ManyToOne(() => User, (user) => user.documents, { eager: true })
@JoinColumn({ name: 'ownerId' })
owner: User;


## Folder Structure

src/
├── auth/ # Login, JWT, Guards, Role Decorators
├── common/
│ ├── decorators/ # @Roles(), @SkipAuthGuard()
│ ├── guards/ # JwtAuthGuard, RolesGuard
│ ├── interceptors/ # FileValidationInterceptor, UploadInterceptor
├── documents/ # Document Controller, Service, Entity, DTOs
│ └── tests/ # Unit test cases
├── ingestion/ # Microservice integration (Trigger + Status)
├── users/ # Users module (Admin, Editor, Viewer)
├── helpers/ # Multer file config and reusable utils
├── main.ts # App bootstrap with Microservice connection
├── app.module.ts

---

## Role-Based Access Control (RBAC)

| Role   | Access                                             |
| ------ | -------------------------------------------------- |
| Admin  | Full access to all document APIs and user creation |
| Editor | Can update and read any document                   |
| Viewer | Can read a document by ID only                     |

Implemented using:

- Custom `@Roles('admin')` decorator
- `RolesGuard` to enforce role access from JWT payload
- `JwtAuthGuard` for auth checks

---

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-org/document-management-system.git
cd document-management-system

# 2. Install dependencies
npm install

# Dev server
npm run start:dev

# Production build
npm run build
npm run start:prod


# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
````

# PostgreSQL Configuration

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_postgres_username  
POSTGRES_PASSWORD=your_postgres_password  
POSTGRES_DB=documentdb

# JWT Configuration

JWT_SECRET=your_super_secure_secret
JWT_EXPIRES_IN=1d
