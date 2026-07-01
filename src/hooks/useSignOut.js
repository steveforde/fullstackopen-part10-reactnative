import { useApolloClient } from "@apollo/client/react";
import useAuthStorage from "./useAuthStorage";
import { useNavigate } from "react-router-native";

/**
 * REUSABLE SIGN-OUT DE-AUTHENTICATION HOOK (useSignOut)
 */
const useSignOut = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const navigate = useNavigate();

  const signOut = async () => {
    // 1. Instantly strip the token from your async storage container
    await authStorage.removeAccessToken();

    // 2. Redirect the user to the safe public index root path immediately
    navigate("/", { replace: true });

    try {
      // 3. Clear the cache and force ALL active queries (like the AppBar 'me' query) to re-evaluate
      await apolloClient.resetStore();
    } catch (error) {
      // Catching the silent unauthenticated query error prevents a white-screen freeze
      console.log(
        "Expected refetch cleanup error handled safely:",
        error.message,
      );
    }
  };

  return signOut;
};

export default useSignOut;
