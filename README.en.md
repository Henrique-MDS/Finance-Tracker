# 💰 Finance Tracker

🌐 **English** | [Português](README.md)

A complete web application for **personal finance management**, focused on organizing income and expenses, tracking your balance, analyzing your finances through charts and generating reports.

The project was built as a **full stack** application, using React and TypeScript on the frontend and Supabase/PostgreSQL as the backend and database. Its development applied concepts of **authentication, authorization, database modeling, CRUD operations, SQL functions, data validation, state management, data visualization, security and production deployment**.

## 🚀 Features

* 🔐 Authentication and user management
* 🔑 Multi-factor authentication (MFA/TOTP)
* 💰 Create, edit and delete income and expenses
* 🏷️ Category management
* 📊 Financial dashboard
* 📈 Charts to analyze income, expenses and balance
* 📅 Date range filters
* 💵 Balance calculation and tracking
* 🎯 Financial goals management
* 🔄 Recurring transactions
* ⚙️ Automatic generation of recurring transactions
* 📋 Financial reports
* 📥 Data/report export
* 👤 User profile
* 🖼️ Avatar upload and management
* 🌐 Interface available in Portuguese and English (saved per user)
* 📱 Responsive interface
* ✅ Form validation
* 🔒 Per-user data access control

## 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **Tailwind CSS**
* **Shadcn/UI**
* **Radix UI**
* **Lucide React**
* **Recharts**
* **date-fns**

### Backend and Database

* **Supabase**
* **PostgreSQL**
* **Supabase Auth**
* **Supabase Storage**
* **PostgreSQL Functions / RPC**
* **PL/pgSQL**
* **Row Level Security (RLS)**

### Libraries and tools

* **jsPDF**
* **html2canvas**
* **react-to-print**
* **react-hot-toast**
* **ESLint**
* **Git / GitHub**
* **Vercel**

## 🧠 Concepts and skills applied

### Frontend

The interface was built with **React and TypeScript**, working with:

* Componentization
* Hooks (`useState`, `useEffect`, etc.)
* Props and TypeScript interfaces
* Reusable components
* Controlled forms
* Data validation
* Conditional rendering
* State management
* Protected routes
* Date handling
* Internationalization (i18n)
* Responsiveness
* Interface design
* Accessibility
* Visual feedback for operations
* Loading and error state handling

### TypeScript

The project uses TypeScript to make the code safer and more predictable through:

* Typed components
* Custom interfaces and types
* Typed state
* Typed API responses
* Typed functions
* Handling of optional and null values
* Data validation and conversion
* Types provided by Supabase

### Database

The application uses PostgreSQL through Supabase, which required knowledge of:

* Relational modeling
* Table creation
* Primary and foreign keys
* Relationships between entities
* Constraints
* Data types
* Indexes
* SQL queries
* `JOIN`
* `GROUP BY`
* Aggregations
* Subqueries
* `INSERT`, `UPDATE`, `DELETE` and `SELECT`
* PostgreSQL functions
* PL/pgSQL
* Procedures and RPCs
* Handling `NULL` values
* Referential integrity

### Security

Security concepts were applied to ensure users can only access their own data:

* Supabase Auth
* Session-based authentication
* Protected routes
* MFA using TOTP
* Row Level Security (RLS)
* PostgreSQL access policies
* Records linked to the authenticated user
* Permission control
* Data validation on frontend and backend

### Supabase

Supabase was used as the main backend infrastructure, involving:

* Supabase Authentication
* Session management
* MFA/TOTP
* PostgreSQL
* RPCs
* Storage
* Row Level Security
* Queries through the Supabase Client
* Integration between frontend and database

### Data visualization

To turn financial data into useful information, the following concepts were used:

* Data aggregation
* Time series processing
* Grouping by period
* Income and expense calculation
* Balance calculation
* Bar charts
* Pie charts
* Financial indicators
* Date filters

The **Recharts** library was used to build the visualization components.

### Recurring transactions

One of the most complex features of the application is the management of **recurring transactions**, involving:

* Frequency definition
* Date validation
* Execution day control
* Daily, weekly, monthly and yearly frequencies
* Next execution calculation
* Start and end period validation
* Automatic transaction generation
* Prevention of duplicate executions
* Integration between business rules and the database

### Reports

The system also provides features to analyze and export financial information, involving:

* Report-specific SQL queries
* Data processing
* Filtering by period
* Grouping information
* Chart generation
* PDF export
* Capturing interface elements with `html2canvas`
* Document generation with `jsPDF`

## 🏗️ Architecture

The application follows an architecture based on separation of concerns:

```text
Frontend
│
├── React
├── TypeScript
├── React Router
├── Tailwind CSS
├── Shadcn/UI
│
├── Components
├── Pages
├── Hooks
├── Utils
└── Services
        │
        ▼
    Supabase Client
        │
        ├── Authentication
        ├── Storage
        │
        ▼
    PostgreSQL
        │
        ├── Tables
        ├── Relationships
        ├── RLS Policies
        └── Functions / RPC
```

This structure separates the **interface**, **business rules**, **data access** and **persistence layer**.

## 📚 Main skills developed

Building this project involved hands-on experience with:

* Modern frontend development
* Full stack development
* React
* TypeScript
* PostgreSQL
* SQL
* PL/pgSQL
* Supabase
* Authentication
* MFA/TOTP
* Web application security
* RLS
* APIs
* CRUD
* Data modeling
* Componentization
* State management
* Forms and validation
* Date handling
* Internationalization
* Data visualization
* Report generation
* File export
* Git and GitHub
* Deployment
* Vercel
* Debugging and problem solving

## ▶️ Running the project

The application code is in the [`frontend`](frontend) folder. Quick start:

```bash
git clone https://github.com/<your-username>/Finance-Tracker.git
cd Finance-Tracker/frontend
npm install
cp .env.example .env   # fill in your Supabase project credentials
npm run dev
```

Requirements: Node.js 20+ and a Supabase project. Detailed instructions (environment variables, available scripts, project structure) are in the [frontend README](frontend/README.md) (in Portuguese).

## 🎯 Project goal

Finance Tracker was built not only as a personal finance application, but also as a hands-on project to consolidate knowledge of **modern web development, application architecture, databases, security and software engineering**.

The project covered everything from building the interface and user experience to implementing business rules, data persistence, authentication, security and deploying the application to production.
