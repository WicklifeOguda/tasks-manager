import { gql } from "apollo-server-express";

export const typeDefs = gql`
  # User Type
  type User {
    id: ID!
    name: String!
    email: String!
    password: String! # is not be returned in queries
    tasks: [Task!]!
  }

  # Task Type
  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    user: User!
  }


  # Queries
  type Query {
    users: [User!]!
    user(id: ID!): User
    tasks: [Task!]!
    task(id: ID!): Task
    loggedInUser: User
  }

  # Mutations
  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): User!
    logout: Boolean!
    createTask(title: String!, description: String, status: String!): Task!
    updateTask(id: ID!, title: String, description: String, status: String): Task!
    deleteTask(id: ID!): Boolean!
  }
`;
