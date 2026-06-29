import { useMutation, useApolloClient } from "@apollo/client/react";
import { AUTHENTICATE } from "../graphql/mutations";
import useAuthStorage from "./useAuthStorage";

/**
 * CUSTOM SIGN-IN MUTATION ORCHESTRATOR HOOK (useSignIn)
 * WHY IT EXISTS: This is the operational engine behind user login flows. Instead of littering
 * components with token storage operations, network execution states, and cache eviction tasks,
 * this hook groups the entire authentication workflow into a single, clean callable function array.
 * * HOW IT WORKS: It coordinates a sequence of events across three separate layers:
 * the network API layer (useMutation), the device storage layer (useAuthStorage),
 * and the local app caching container layer (useApolloClient).
 */
const useSignIn = () => {
  const authStorage = useAuthStorage(); // Context utility to persist token strings locally on device
  const apolloClient = useApolloClient(); // Direct access instance to modify Apollo's in-memory storage blocks
  const [mutate, result] = useMutation(AUTHENTICATE);

  /**
   * AUTHENTICATION EVENT COORDINATOR
   * WHY async/await: Network queries and storage access procedures are asynchronous events.
   * Each asynchronous step must finish successfully before moving onto the next dependent task line.
   */
  const signIn = async ({ username, password }) => {
    // STEP 1: FIRE NETWORK MUTATION
    // Passes user inputs directly down into the GraphQL mutation parameters
    const { data } = await mutate({
      variables: { credentials: { username, password } },
    });

    // STEP 2: SESSION SECURITY VERIFICATION
    // Safeguard check ensuring an access token was generated successfully by the server backend
    if (data?.authenticate?.accessToken) {
      // A. PERSIST SECURE TOKEN
      // Saves the raw JWT token securely onto the physical device using your storage helper class
      await authStorage.setAccessToken(data.authenticate.accessToken);

      // TERMINAL LOG DIAGNOSTIC
      console.log("Successfully stored token:", data.authenticate.accessToken);

      // B. EVICT AND RESET CACHE STORE
      // CRUCIAL: Instructs Apollo Client to wipe all loaded cache memory clean and instantly
      // re-fire all active queries (like GET_CURRENT_USER). This guarantees the UI automatically
      // flips to the authenticated layout view the moment the token changes.
      await apolloClient.resetStore();
    }

    return data;
  };

  // Exposes standard tuple hook array syntax signature matching useMutation behaviors directly
  return [signIn, result];
};

export default useSignIn;
