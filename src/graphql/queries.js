import { gql } from "@apollo/client";

/**
 * 1. GET ALL REPOSITORIES QUERY (GET_REPOSITORIES)
 * WHY IT'S DESIGNED THIS WAY: The backend server implements a cursor-based pagination pattern.
 * Instead of returning a plain array of items, it nests nodes inside a structure called 'edges'.
 * UPDATE: Added variable definitions ($orderBy and $orderDirection) so the list updates dynamically
 * when changing the Picker component.
 */
export const GET_REPOSITORIES = gql`
  query GetRepositories(
    $orderBy: AllRepositoriesOrderBy
    $orderDirection: OrderDirection
    $searchKeyword: String
  ) {
    repositories(
      orderBy: $orderBy
      orderDirection: $orderDirection
      searchKeyword: $searchKeyword
    ) {
      edges {
        node {
          id
          fullName
          description
          language
          forksCount
          stargazersCount
          ratingAverage
          reviewCount
          ownerAvatarUrl
        }
      }
    }
  }
`;

/**
 * 2. GET SINGLE REPOSITORY RECORD DETAILS WITH REVIEWS (GET_REPOSITORY)
 * WHY IT EXISTS: Powering Exercise 5.1 and 5.2, this target query fetches profile values for a single selection,
 * including its nested reviews collection array.
 */
export const GET_REPOSITORY = gql`
  query GetRepository($id: ID!) {
    repository(id: $id) {
      id
      fullName
      description
      language
      forksCount
      stargazersCount
      ratingAverage
      reviewCount
      ownerAvatarUrl
      url
      reviews {
        edges {
          node {
            id
            text
            rating
            createdAt
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;

/**
 * 3. GET CURRENT LOGGED-IN USER QUERY (GET_CURRENT_USER)
 * WHY IT EXISTS: Used by AppBar to implement authentication-state UI switching.
 * UPDATE: Added a conditional includeReviews argument using the GraphQL @include directive
 * to safely request user reviews without overhead elsewhere.
 */
export const GET_CURRENT_USER = gql`
  query getCurrentUser($includeReviews: Boolean = false) {
    me {
      id
      username
      reviews @include(if: $includeReviews) {
        edges {
          node {
            id
            text
            rating
            createdAt
            repository {
              fullName
              id
            }
          }
        }
      }
    }
  }
`;
