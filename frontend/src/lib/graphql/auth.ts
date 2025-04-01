import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const CURRENT_USER = gql`
query CurrentUser{
  loggedInUser{
    id
    name
    email
  }
}
`;

export const LOGOUT_USER = gql`
mutation LogoutUser{
  logout
}
`;