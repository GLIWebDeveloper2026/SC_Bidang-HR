# KerjaKink Apps

This repository contains the source code for the Competition Project, featuring a full-stack application with a Node.js backend and a React frontend.

## 🚀 Tech Stack

### Frontend
- **React 19**
- **TypeScript 5.7**
- **Vite 6**
- **Material UI (MUI) 7**
- **React Router 7**, **React Query 5**, **React Hook Form + Zod**

### Backend
- **Node.js** with **Express 5**
- **Supabase** (Server & SSR & JS SDK)
- **Dotenv** & **CORS**

## 📂 Project Structure

```text
.
├── backend/          # Node.js/Express backend application
└── frontend/         # React/Vite admin dashboard frontend
```

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd project-lomba-gi
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Configure environment variables:
Ensure you have a `.env` file in the `backend` directory configured for your database/Supabase.

Start the backend server:
```bash
node server.js
# or
node index.js
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

## 📄 License

This project is licensed under the ISC / MIT License.