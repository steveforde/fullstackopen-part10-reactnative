import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities"; // Imported pagination utility

// Establish a basic link connection point to the GraphQL endpoint
const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_APOLLO_URI,
});

// ==========================================
// CENTRALIZED CACHE WITH TYPE POLICIES
// ==========================================
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: relayStylePagination(),
      },
    },
    Repository: {
      fields: {
        reviews: {
          // Explicit read/merge strategy to force arrays to stitch together manually
          keyArgs: ["id"],
          merge(existing, incoming, { args }) {
            const existingEdges = existing ? existing.edges : [];
            const incomingEdges = incoming ? incoming.edges : [];

            // If we have an "after" cursor, append the incoming items to the existing items
            const edges = args?.after
              ? [...existingEdges, ...incomingEdges]
              : incomingEdges;

            return {
              ...incoming,
              edges,
            };
          },
        },
      },
    },
  },
});

/**
 * CLIENT FACTORY CONFIGURATOR (createApolloClient)
 * WHY IT'S DESIGNED AS A FUNCTION: Instead of exporting a static client instance directly,
 * this file exports a factory method function. This allows `App.js` to initialize the client
 * at runtime while explicitly injecting our active `authStorage` engine class instance dependency.
 *
 * @param {Object} authStorage - The local storage manager instance supplied by the app root.
 */
const createApolloClient = (authStorage) => {
  // DYNAMIC HEADER REQUEST INTERCEPTOR (MIDDLEWARE)
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await authStorage.getAccessToken();

      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      };
    } catch (e) {
      console.log("Error reading token for Apollo context headers:", e);
      return { headers };
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache, // Wired up the configured cache here
  });
};

export default createApolloClient;
