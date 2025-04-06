# Forward Earth: Carbon Usage Tracking System

## 📊 Project Overview

This project provides a complete solution for tracking and managing carbon usage data across a cluster of companies. It features a REST web service that exposes CRUD functionality to a database storing carbon usage data for customers.

### Key Technologies

- **Frontend**: React with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: Supabase (PostgreSQL)

### ✨ Features

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
   npm run install:all
   ```

### Environment Setup

1. Create an `.env` file in the root directory with the following configuration and the info provided:

2. Generate a secure random secret for your JWT_SECRET

```bash
openssl rand -base64 32
```

3. Change the value in the env file

```
# Supabase Configuration
SUPABASE_URL=you-supabase-url
SUPABASE_KEY=your-anon-supabase-key

# JWT Configuration
JWT_SECRET=your-random-secret
JWT_EXPIRATION=60m
```

### Running the Application

1. Run the application:
   ```bash
   npm run start:dev
   ```

### Folder Structure

```​
forward-earth/                           # Main project directory
│
├── carbon-usage-api/                    # Backend NestJS application
│   ├── dist/                            # Compiled output
│   ├── node_modules/                    # External dependencies
│   ├── src/                             # Source code for the API
│   │   ├── activity-types/              # Activity types module
│   │   ├── auth/                        # Authentication module
│   │   ├── companies/                   # Companies module
│   │   ├── consumption/                 # Consumption tracking module
│   │   ├── production/                  # Production module
│   │   ├── products/                    # Products module
│   │   ├── supabase/                    # Supabase database integration
│   │   ├── units/                       # Units of measurement module
│   │   ├── users/                       # User management module
│   │   ├── app.module.ts                # Main application module
│   │   └── main.ts                      # Application entry point
│   ├── test/                            # Test files
│   ├── .env                             # Environment variables
│   ├── .env.template                    # Template for environment variables
│   ├── .gitignore                       # Git ignore rules
│   ├── .prettierrc                      # Prettier configuration
│   ├── eslint.config.mjs                # ESLint configuration
│   ├── nest-cli.json                    # NestJS CLI configuration
│   ├── package-lock.json                # Dependency lock file
│   ├── package.json                     # Project metadata and dependencies
│   ├── tsconfig.build.json              # TypeScript build configuration
│   └── tsconfig.json                    # TypeScript configuration
│
└── carbon-usage-client/                 # Frontend React application (Vite)
    ├── node_modules/                    # External dependencies
    ├── public/                          # Static assets and public files
    ├── src/                             # Source code for the client application
    │   ├── components/                  # React UI components
    │   │   ├── company/                 # Company related components
    │   │   ├── consumption/             # Consumption tracking components
    │   │   ├── main-page/               # Main page components
    │   │   ├── production/              # Production related components
    │   │   ├── products-catalogue/      # Product catalog components
    │   │   ├── AuthRedirect.tsx         # Auth redirect handler
    │   │   ├── Dashboard.tsx            # Main dashboard view
    │   │   ├── LoginForm.tsx            # User login component
    │   │   ├── ProtectedRoute.tsx       # Route protection component
    │   │   └── Sidebar.tsx              # Navigation sidebar
    │   ├── contexts/                    # React context providers
    │   ├── hooks/                       # Custom React hooks
    │   ├── interfaces/                  # TypeScript interfaces and types
    │   ├── services/                    # API service integration
    │   ├── styles/                      # CSS and styling
    │   ├── utils/                       # Utility functions
    │   ├── App.css                      # Main application styles
    │   ├── App.tsx                      # Main application component
    │   ├── index.css                    # Global CSS styles
    │   ├── main.tsx                     # Application entry point
    │   └── vite-env.d.ts                # Vite environment type declarations
```
