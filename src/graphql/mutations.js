import { gql } from "@apollo/client";

/**
 * GRAPHQL AUTHENTICATION MUTATION (AUTHENTICATE)
 * WHY IT EXISTS: Unlike Queries (which are purely for reading data), Mutations are used
 * to modify server-side data or execute state-changing transactions (like creating a
 * login session).
 * * HOW IT WORKS:
 * 1. It declares an entry parameter variable `$credentials` of type `AuthenticateInput!`.
 * The exclamation point (!) specifies that this parameter object is strictly required.
 * 2. It sends those values to the backend server's `authenticate` controller method logic.
 * 3. Upon verifying the matching username and password data, the server yields an individual,
 * signed JSON Web Token (JWT) string mapped to the `accessToken` field key.
 */
export const AUTHENTICATE = gql`
  mutation Authenticate($credentials: AuthenticateInput!) {
    authenticate(credentials: $credentials) {
      accessToken
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($review: CreateReviewInput!) {
    createReview(review: $review) {
      id
      repositoryId
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      username
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;
