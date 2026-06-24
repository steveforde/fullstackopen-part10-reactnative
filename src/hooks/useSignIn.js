import { useMutation, useApolloClient } from "@apollo/client/react";
import { AUTHENTICATE } from "../graphql/mutations";
import useAuthStorage from "./useAuthStorage";

const useSignIn = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient(); // Access the Apollo Client instance
  const [mutate, result] = useMutation(AUTHENTICATE);

  const signIn = async ({ username, password }) => {
    const { data } = await mutate({
      variables: { credentials: { username, password } },
    });

    if (data?.authenticate?.accessToken) {
      // 1. Save token to device storage
      await authStorage.setAccessToken(data.authenticate.accessToken);

      // VERIFY IN TERMINAL
      console.log("Successfully stored token:", data.authenticate.accessToken);

      // 2. Clear cache and re-fire active queries
      await apolloClient.resetStore();
    }

    return data;
  };

  return [signIn, result];
};

export default useSignIn;
