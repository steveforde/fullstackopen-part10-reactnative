import { ApolloProvider } from "@apollo/client/react"; // Ensure /react is included
import { StatusBar } from "expo-status-bar";
import { NativeRouter } from "react-router-native";

import Main from "./src/components/Main";
import createApolloClient from "./src/utils/apolloClient";
import AuthStorage from "./src/utils/authStorage";
import AuthStorageContext from "./src/contexts/AuthStorageContext";

// 1. Initialize the storage and apollo client
const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () => {
  return (
    <>
      <StatusBar style="light" />
      <NativeRouter>
        <ApolloProvider client={apolloClient}>
          {/* 2. Pass authStorage into the provider value */}
          <AuthStorageContext.Provider value={authStorage}>
            <Main />
          </AuthStorageContext.Provider>
        </ApolloProvider>
      </NativeRouter>
    </>
  );
};

export default App;
