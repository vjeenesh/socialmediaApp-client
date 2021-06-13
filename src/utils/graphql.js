import { gql } from "@apollo/client";

export const GET_POSTS_QUERY = gql`
  {
    getPosts {
      id
      username
      body
      likeCount
      commentCount
      createdAt
      comments {
        id
        body
        username
      }
      likes {
        id
        username
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      comments {
        id
        body
        username
      }
      likes {
        id
        username
      }
      likeCount
      commentCount
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      email
      token
    }
  }
`;
