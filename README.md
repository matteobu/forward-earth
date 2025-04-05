# Forward Earth: Carbon Usage Tracking System

## 📊 Project Overview

This project provides a complete solution for tracking and managing carbon usage data across a cluster of companies. It features a REST web service that exposes CRUD functionality to a database storing carbon usage data for customers.

### Key Technologies

- **Frontend**: React with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: Supabase (PostgreSQL)

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

Create an `.env.local` file in the root directory with the following configuration:

```
# Supabase Configuration
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_KEY="YOUR_ANON_SUPABASE_KEY"

# JWT Configuration
JWT_SECRET="YOUR_JWT_SECRET_KEY" // generate a random alphanumeric string
JWT_EXPIRATION=60m  # JWT token expiration time (1 hour)

```
