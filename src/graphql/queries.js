import { gql } from "@apollo/client";

/**
 * 1. GET ALL REPOSITORIES QUERY (GET_REPOSITORIES)
 * WHY IT'S DESIGNED THIS WAY: The backend server implements a cursor-based pagination pattern
 * standard in GraphQL schemas. Instead of returning a plain array of items, it nests nodes
 * inside a structure called 'edges'.
 * * HOW IT WORKS: It asks the server to traverse database entries and pluck fields out of the
 * nested "node" property for every individual repository entry matching the search list grid feed.
 */
export const GET_REPOSITORIES = gql`
  query GetRepositories {
    repositories {
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
 * 2. GET CURRENT LOGGED-IN USER QUERY (GET_CURRENT_USER)
 * WHY IT EXISTS: Used by AppBar to implement authentication-state UI switching.
 * * HOW IT WORKS: It checks the incoming HTTP request payload header's bearer token. If the
 * token matches a valid open user session, the server populates the "me" schema endpoint object
 * block with database identity values. If unauthenticated, it safely returns "null".
 */
export const GET_CURRENT_USER = gql`
  query getCurrentUser {
    me {
      id
      username
    }
  }
`;

/**
 * 3. GET SINGLE REPOSITORY RECORD DETAILS QUERY (GET_REPOSITORY)
 * WHY IT EXISTS: Powering Exercise 5.1, this target query fetches profile values for a single selection.
 * * HOW IT WORKS: It declares a strictly required dynamic identification argument string (`$id: ID!`).
 * It passes this filter down to the server-side lookup resolver to fetch one matching entry,
 * adding the essential `url` string property needed to launch our native external browser linking layer.
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
    }
  }
`;
