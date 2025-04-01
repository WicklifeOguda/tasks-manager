import { gql } from "@apollo/client";

// Fetch all tasks (for a given user)
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
    }
  }
`;

// Create a task
export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!, $status: String!) {
    createTask(title: $title, description: $description, status:$status) {
      id
      title
      description
      status
    }
  }
`;

// Update a task
export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String!, $description: String!, $status: String!) {
    updateTask(id: $id, title: $title, description: $description, status: $status) {
      id
      title
      description
      status
    }
  }
`;

// Get a task by id
export const GET_TASK = gql`
  query GetTask($id:ID!){
    task(id:$id){
      id
      title
      description
      status
    }
  }
`;

// Delete a task
export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;
