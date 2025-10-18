# Task Management System

Hi! 👋 My name is **Nomin**, and I built this **Task Management System** following a **modular NX monorepo** approach using **Angular + NestJS + TailwindCSS + TypeScript**.

This system is secure and role-based, allowing users to manage tasks according to their **roles** and **organization hierarchy**. Below, I’ll walk you through how I structured, implemented, and secured this project.

---

## Setup Instructions

### 1. Clone Repository

````bash
git clone https://github.com/Nomin7711/task-mgnt-workspace.git
cd task-management-system

### 2. Install Dependencies
```bash
npm install

### 3. Configure .env
```bash
JWT_SECRET=Qwerty123!
JWT_EXPIRES_IN=3600
BCRYPT_SALT_ROUNDS=10
DB_TYPE=sqlite

### 4. Run Backend & Frontend
Backend (NestJS API):
```bash
nx serve api
Frontend (Angular Dashboard):
```bash
nx serve dashboard
````
