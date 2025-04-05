# Forward Earth: Carbon Usage Tracking System

## 📊 Project Overview

This project provides a complete solution for tracking and managing carbon usage data across a cluster of companies. It features a REST web service that exposes CRUD functionality to a database storing carbon usage data for customers.

### Key Technologies

- **Frontend**: React with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: Supabase (PostgreSQL)

## ✨ Features

- User authentication for 5 companies
- CO2 emissions tracking per activity
- Consumption data management with filtering/sorting
- Product and production catalogues
- Company-specific dashboards and reports

## 🚀 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/matteobu/forward-earth.git
   cd forward-earth
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Frontend

```bash
cd carbon-usage-client
npm run start:dev
```

#### Backend

```bash
cd carbon-usage-api
npm run start:dev
```

### Environment Setup

Create an `.env.local` file in the root directory with the following configuration and the info provided:

```
# Supabase Configuration
SUPABASE_URL=https://qsnqbrrnsqbtpcbhjsiz.supabase.co
SUPABASE_KEY=your-anon-supabase-key
psw for the anon key: #R9!W*#Z0M

# JWT Configuration
JWT_SECRET=your-random-secret
JWT_EXPIRATION=60m

```

```​
forward-earth/
├── carbon-usage-api/              # NestJS backend
│   ├── src/
│   │   ├── auth/                  # Authentication (JWT)
│   │   ├── users/                 # User management
│   │   ├── consumption/           # Consumption-related logic
│   │   ├── activity-type/         # Activity types & categories
│   │   ├── units/                 # Measurement units
│   │   ├── supabase/              # Supabase integration logic
│   │   └── main.ts                # Application entry point
│   └── .env                       # Environment variables for backend

├── carbon-usage-client/          # React frontend
│   ├── src/
│   │   ├── components/            # Shared UI components (tables, charts, etc.)
│   │   ├── pages/                 # App views (dashboard, login, etc.)
│   │   ├── services/              # API integration services
│   │   ├── store/                 # State management (e.g., Zustand or Redux)
│   │   ├── utils/                 # Utility functions and helpers
│   │   └── App.tsx               # Main app component
│   └── .env.local                # Environment variables for frontend

└── README.md                     # Project documentation
```

​

## 🔑 Authentication

The system comes with 5 test accounts, each associated with a different company in the production cluster:

| User        | Email              | Company Association |
| ----------- | ------------------ | ------------------- |
| Bruno Bruno | "bruno@test.com"   | Company 1           |
| Matteo      | "test@test.com"    | Company 2           |
| Bob Johnson | "bob@example.com"  | Company 3           |
| Jane Smith  | "jane@example.com" | Company 4           |
| Andrea      | "andrea@test.com"  | Company 5           |

## 📋 Project Tasks Breakdown

### You can see the tasks/issues in this [Backlog](https://github.com/users/matteobu/projects/2).

It took 5 days for the whole project to be carried out.

### The project has been split in 6 main Steps:

- **Backend Setup & Core Functionality**
  - NestJS setup;
  - Access points: auth, activity type, units, consumption, users and supabase.
- **Frontend Setup & Core Functionality**
  - ReactJS Typescript Setup
  - Components: login form, dashboard, sidebar, main and consumption.
- **API Integration & State Management**
  - Services setup
- **Documentation & Notes**
- **Optional Features**
  - Auth JWT, pagination, filtering and sorting.

## 🕹️ How and Why

### The Company Cluster Concept

The application is built around a collaborative production model, where a tightly-knit cluster of five companies, all located within the same geographical area, work together across the different stages of a shared production chain. Each company specializes in a specific step of the manufacturing process, contributing its expertise to the creation of a final, high-quality product.

This model is particularly characteristic of certain regions in northern Italy, such as Veneto or Emilia-Romagna, where local industrial districts thrive on a decentralized yet highly integrated production system. In these districts, small to medium-sized enterprises (SMEs) operate independently but are deeply interconnected through longstanding relationships, shared standards, and mutual trust.

### Navigation

Upon successful login, users are directed to the dashboard.

### Dashboard Overview

- Total CO2 Emissions
- Data Quality Score
- Top Two Categories by Emissions
- Emissions by Category
- Monthly Emissions Trend
- Top five consumptions

### Consumption List

In the consumption list the user can visualize all the consumptions related to the Company.

Features:

- Table with **Consumption Data** with specific columns: Activity, Amount, Date, CO2 Impact, Actions
- The table supports the following feature: Filtering, Pagination, Sorting and two actions (Delete, Edit)
- Filtering by: Date Range, Activity Type, Amount Range, CO2 Impact Range.
- **Actions** (upon confirmation): Delete to remove an entry, Edit to change activity type, amount or date.

### Insert Consumption

In the "insert Consumption" section the user can add a new consumption to the list

Features:

- Possible to choose between six categories, each category has a specific activity type
- Preview of CO2 emission after choosing the Activity Type, Amount, Date
- Save consumption or Cancel
- Preview of how many trees must be planted to compensate the emissions

### Products Catalogue

Explore the five representative products that form the backbone of the collaborative production chain. Each product highlights a different stage managed by one of the five partner companies.

### Production list

View a hypothetical list of all production activities carried out by the company, including product types, timelines, and partner involvement across the chain.

### Company

Get an overview of the company’s identity, role in the production chain, and its relationships within the cluster network.

### Logout

Log out from the application and end your session.

## 🧩 Pain Points Encountered

- Initial NestJS and Supabase backend setup complexity
- Maintaining consistent flow and state across frontend views

## 🛠️ Possible Improvements

- Give the user with admin role the authorization to add new activity  type, unit and products.
- Refactor tables into reusable components to reduce redundancy
- Add Sign up to create a user
- Add languages

