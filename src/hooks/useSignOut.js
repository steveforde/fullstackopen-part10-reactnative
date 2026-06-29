import { useApolloClient } from "@apollo/client/react";
import useAuthStorage from "./useAuthStorage";

/**
 * REUSABLE SIGN-OUT DE-AUTHENTICATION HOOK (useSignOut)
 */
const useSignOut = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient(); // Now being used down on line 18!

  const signOut = async () => {
    // 1. Remove the token from local device storage
    await authStorage.removeAccessToken();

    // 2. Clear the cache completely and re-execute active queries (like the 'me' query)
    await apolloClient.resetStore();
  };

  return signOut;
};

export default useSignOut;
