# Task Management System

Hi! 👋 My name is **Nomin**, and I built this **Task Management System** following a **modular NX monorepo** approach using **Angular + NestJS + TailwindCSS + TypeScript**.

This system is secure and role-based, allowing users to manage tasks according to their **roles** and **organization hierarchy**. Below, I’ll walk you through how I structured, implemented, and secured this project.

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Nomin7711/task-mgnt-workspace.git
cd task-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure .env

```bash
JWT_SECRET=Qwerty123!
JWT_EXPIRES_IN=3600
BCRYPT_SALT_ROUNDS=10
DB_TYPE=sqlite
```

### 4. Run Backend & Frontend

Backend (NestJS API):

````bash
nx serve api
Frontend (Angular Dashboard):
```bash
nx serve dashboard
````

### Architecture Overview

### NX Monorepo Layout

apps/
├─ api/ → NestJS backend
├─ dashboard/ → Angular frontend

libs/
├─ data/ → Shared TypeScript interfaces & DTOs
├─ auth/ → Reusable RBAC logic, decorators, and guards

- Rationale: NX allows modularity, code sharing, and consistent dependency management.

- Shared Libraries:

- data: ensures consistent types between backend and frontend

- auth: centralizes RBAC logic for secure and maintainable access control

### Data Model Explanation

Core Entities

User → belongs to an organization, assigned a role

Organization → 2-level hierarchy (parent → child)

Role → Owner, Admin, Viewer

Task → belongs to a user/org, has title, description, status

Permissions → define allowed actions (create/read/update/delete, manage users/orgs, read logs)

### Example ERD

```bash
User ---belongs to---> Organization
Task ---owned by---> User
Role ---assigned to---> User
Permissions ---assigned to---> Role
```

Each entity is strongly typed using TypeScript DTOs, making the backend robust and consistent.

### Access Control Implementation

Roles & Permissions

- Roles: Owner (full), Admin (limited), Viewer (read-only)

- Permissions: Each action like task:create, task:read is mapped to roles

- Organization Scope: Users can only access tasks within their org hierarchy

### Decorators & Guards

- Custom decorators mark endpoints with required permissions

- Guards check JWT and permissions before executing endpoint

Example: @Permissions('task:create') ensures only allowed users can create tasks

### JWT Integration

- JWT stores user ID and role

- Middleware validates token on every request

- Guards extract role/permissions from JWT to enforce access control

### Permissions Table

| ID  | Permission  | Level |
| --- | ----------- | ----- |
| 1   | task:create | 1     |
| 2   | task:read   | 1     |
| 3   | task:update | 1     |
| 4   | task:delete | 1     |
| 5   | user:manage | 1     |
| 6   | org:manage  | 1     |
| 7   | log:read    | 1     |
| 8   | audit:read  | 1     |
| 9   | task:create | 2     |
| 10  | task:read   | 2     |
| 11  | task:update | 2     |
| 12  | user:manage | 2     |
| 13  | log:read    | 2     |
| 14  | task:read   | 3     |

### Roles & Levels:

Owner: Full access (Level 1)

Admin: Limited access (Level 2)

Viewer: Read-only access (Level 3)

### API Documentation

| Method | Endpoint   | Description                         |
| ------ | ---------- | ----------------------------------- |
| POST   | /tasks     | Create task                         |
| GET    | /tasks     | List accessible tasks               |
| PUT    | /tasks/:id | Edit task                           |
| DELETE | /tasks/:id | Delete task                         |
| GET    | /audit-log | View access logs (Owner/Admin only) |

## Sample Request:

```bash
POST /tasks
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Finish Report",
  "description": "Complete by EOD",
  "status": "pending"
}
```

## Sample Response:

{
"id": 1,
"title": "Finish Report",
"description": "Complete by EOD",
"status": "pending",
"ownerId": 5
}

### Future Considerations

Advanced role delegation: Support temporary or conditional permissions

Production-ready security: JWT refresh tokens, CSRF protection, RBAC caching

Scaling permission checks: Optimize with caching or precomputed role-permission maps

### Summary

I implemented this Task Management System in a modular NX monorepo with full role-based access control, JWT authentication, and task management features. My backend solution enforces security through decorators, guards, and scoped access, making it scalable and maintainable for real-world use.
