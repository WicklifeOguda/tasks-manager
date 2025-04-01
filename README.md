# Wicky Task Manager

A simple full-stack task management app built with Next.js, TypeScript, GraphQL (Apollo Server & Client), Sequelize, and PostgreSQL. Users can create, update, delete, and view their tasks on the dashboard. These requires creation of account and login.

## Features

User Authentication (Session-based using secure cookies)

Task Management (CRUD operations)

GraphQL API (Apollo Server & Client)

Database Support (PostgreSQL with Sequelize ORM)

TypeScript backend and Next.js frontend(App Router)

## Getting Started

Clone the repository

```bash
git clone https://github.com/WicklifeOguda/tasks-manager.git
cd tasks-manager
```

## Install Dependencies

Change to respective project

```bash
cd backend
npm install

and

cd frontend
npm install
```

## Set up environment variables

Create a .env file in the root of each project (frontend and backend) and add

```bash
#backend/.env
DB_NAME=task_manager
DB_USER=user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL=postgres://user:password@localhost:5432/task_manager

# Sever Port
PORT=5000

# AUTH RELATED VARS
SESSION_SECRET=your_secret_key

#frontend/.env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:500/graphql

```

## Run backend server

```bash
cd backend
npm run dev

```

## Start the Next.js frontend

```bash
cd frontend
npm run dev

```

# API Documentation

Graphql Schema Examples

```graphql
type Task {
  id: ID!
  title: String!
  description: String
  status: String! # one of ["pending","in-progress", "completed"]
  user: User!
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
  tasks: [Task!]!
}
```

Sample Query

```graphql
type Query {
  users: [User!]!
  user(id: ID!): User
  tasks: [Task!]!
  task(id: ID!): Task
  loggedInUser: User
}
```

Sample Mutation

```graphql
type Mutation {
  createUser(name: String!, email: String!, password: String!): User!
  login(email: String!, password: String!): User!
  logout: Boolean!
  createTask(title: String!, description: String, status: TaskStatus!): Task!
  updateTask(
    id: ID!
    title: String
    description: String
    status: TaskStatus
  ): Task!
  deleteTask(id: ID!): Boolean!
}
```

Example Queries and Mutations

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    name
    email
  }
}

query LoggedInUser {
  loggedInUser {
    id
    email
    name
  }
}

mutation CreateTask($title: String!, $status: String!) {
  createTask(title: $title, status: $status) {
    id
    title
    description
    status
    user {
      id
      name
    }
  }
}
```

## Deployment URL
[https://tasks-manager-five.vercel.app]
