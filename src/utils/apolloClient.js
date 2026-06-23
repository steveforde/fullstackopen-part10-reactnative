import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.EXPO_PUBLIC_APOLLO_URI,
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
