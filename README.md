# Task Management System

A secure **Task Management System** with **role-based access control (RBAC)**, built in a modular NX monorepo. This system allows users to manage tasks securely, ensuring only authorized users can access and modify data based on their roles and organizational hierarchy.

---

## 🏗 NX Monorepo Structure

apps/
├─ api/ → NestJS backend
├─ dashboard/ → Angular frontend
libs/
├─ data/ → Shared TypeScript interfaces & DTOs
├─ auth/ → Reusable RBAC logic and decorators

---

## 🧩 Core Features

### Backend (NestJS + TypeORM + SQLite/PostgreSQL)

**Data Models**

- Users
- Organizations (2-level hierarchy)
- Roles: Owner, Admin, Viewer
- Permissions
- Tasks (resource)

**Access Control Logic**

- Decorators & guards for access checks
- Ownership & org-level access enforcement
- Role inheritance logic
- Task visibility scoped to role
- Basic audit logging (console/file)

**API Endpoints**

- `POST /tasks` – Create task (with permission check)
- `GET /tasks` – List accessible tasks (scoped to role/org)
- `PUT /tasks/:id` – Edit task (if permitted)
- `DELETE /tasks/:id` – Delete task (if permitted)
- `GET /audit-log` – View access logs (Owner/Admin only)

**Authentication**

- JWT-based authentication
- Login endpoint with token
- Token verification middleware/guard in all endpoints

---

### Frontend (Angular + TailwindCSS)

**Task Management Dashboard**

- Create/Edit/Delete tasks
- Sort, filter, and categorize (e.g., Work, Personal)
- Drag-and-drop for reordering/status changes
- Responsive design (mobile → desktop)

**Authentication UI**

- Login UI authenticating against backend
- Store JWT and attach it to all API requests

**State Management**

- Any preferred Angular state management solution (NgRx, Akita, or service-based)

**Bonus Features**

- Task completion visualization (bar chart)
- Dark/light mode toggle
- Keyboard shortcuts for task actions

---

## 📊 System Stats (Example Badges)

![Total Tasks](https://img.shields.io/badge/Total%20Tasks-128-blue)  
![Completed Tasks](https://img.shields.io/badge/Completed-92-green)  
![Pending Tasks](https://img.shields.io/badge/Pending-36-yellow)  
![Total Users](https://img.shields.io/badge/Users-25-orange)  
![Active Organizations](https://img.shields.io/badge/Organizations-5-purple)

---

## 🧪 Testing Strategy

- **Backend**: Jest tests for RBAC logic, authentication, and API endpoints
- **Frontend**: Jest/Karma tests for components and state logic

---

## ⚙️ Setup Instructions

### Backend

```bash
cd apps/api
cp .env.example .env
npm install
npm run start:dev
```

Frond end
cd apps/dashboard
npm install
npm start

.env file
JWT_SECRET=Qwerty123!
JWT_EXPIRES_IN=3600
BCRYPT_SALT_ROUNDS=10
DB_TYPE=sqlite
Architecture Overview

NX Monorepo to separate backend, frontend, and shared libraries

libs/data contains shared DTOs/interfaces

libs/auth contains RBAC decorators and guards

Modular structure ensures reusability and scalability

Data Model & ERD

Users: id, name, email, password, role, organization

Organizations: id, name, parentOrganizationId

Roles: Owner → Admin → Viewer

Tasks: id, title, description, category, status, ownerId, organizationId

Permissions: CRUD per resource per role

ERD Diagram (example)
Users --< Tasks
Organizations --< Users
Roles --< Permissions
Access Control

Role-based access control using decorators & guards

Role inheritance: Owner > Admin > Viewer

Task visibility scoped to organization and role

JWT authentication integrated with RBAC guards
API Documentation (Sample)

Create Task
POST /tasks
Body:

{
"title": "Finish Report",
"category": "Work",
"priority": "High"
}
Headers: Authorization: Bearer <token>

Get Tasks
GET /tasks
Returns tasks visible to the logged-in user based on role/org

Update Task
PUT /tasks/:id
Body: Updated task details (requires permission)

Delete Task
DELETE /tasks/:id
Deletes task (requires permission)

Audit Logs
GET /audit-log
Accessible by Owner/Admin only
Future Considerations

Advanced role delegation

Production-ready security: JWT refresh tokens, CSRF protection, RBAC caching

Scaling permission checks efficiently

🎨 Frontend Features

Task CRUD operations

Drag-and-drop reordering

Sort and filter by category or status

Responsive UI with dark/light mode toggle

Optional chart visualization for task completion

📄 License

MIT License

---

If you want, I can also **add screenshots and diagram placeholders** directly in this README so it looks **professional for GitHub**.

Do you want me to do that next?
