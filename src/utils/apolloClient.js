import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Establish a basic link connection point to the GraphQL endpoint
const httpLink = new HttpLink({
  // WHY: Pulls the network URI out of your system environment configuration (.env file)
  // so that endpoint addresses aren't hardcoded into your production builds.
  uri: process.env.EXPO_PUBLIC_APOLLO_URI,
});

/**
 * CLIENT FACTORY CONFIGURATOR (createApolloClient)
 * WHY IT'S DESIGNED AS A FUNCTION: Instead of exporting a static client instance directly,
 * this file exports a factory method function. This allows `App.js` to initialize the client
 * at runtime while explicitly injecting our active `authStorage` engine class instance dependency.
 * * @param {Object} authStorage - The local storage manager instance supplied by the app root.
 */
const createApolloClient = (authStorage) => {
  // DYNAMIC HEADER REQUEST INTERCEPTOR (MIDDLEWARE)
  // WHY: To complete authenticated actions, the server requires an access token inside the
  // HTTP Request headers. Instead of manually attaching headers to every query or mutation
  // across individual files, this middleware automates the process globally.
  const authLink = setContext(async (_, { headers }) => {
    try {
      // 1. Asynchronously read the token out of the secure storage engine device file
      const accessToken = await authStorage.getAccessToken();

      // 2. Return a mutated configuration headers map state
      return {
        headers: {
          ...headers, // Retain existing headers (like content-type or cross-origin keys)
          // If a token exists, inject it as a standard standard Authorization Bearer string token format
          authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      };
    } catch (e) {
      console.log("Error reading token for Apollo context headers:", e);
      return { headers }; // Graceful error fallback state: returns unchanged headers to prevent application crashes
    }
  });

  return new ApolloClient({
    // THE LINK CHAIN LINK ENGINE
    // WHY `.concat()`: Apollo processes link operations sequentially.
    // 1. First, `authLink` intercepts the outbound call asynchronously and appends security headers.
    // 2. Then, the modified request rolls forward into `httpLink`, which transmits the final payload over the network.
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(), // Automatic internal normalized runtime caching database layer
  });
};

export default createApolloClient;
