import { ApolloProvider } from "@apollo/client/react";
import { StatusBar } from "expo-status-bar";
import { NativeRouter } from "react-router-native";

import Main from "./src/components/Main";
import createApolloClient from "./src/utils/apolloClient";
import AuthStorage from "./src/utils/authStorage";
import AuthStorageContext from "./src/contexts/AuthStorageContext";

// 1. HARDWARE STORAGE & NETWORK INGESTION FACTORIES
// WHY: We instantiate these singletons globally outside the App component lifecycle loop.
// This prevents them from re-initializing unexpectedly if the root App component re-renders.
// We then explicitly pass the storage instance into the Apollo Client creator so the network
// layer has immediate access to our security token middleware hooks.
const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

/**
 * APPLICATION ENTRY POINT ORCHESTRATOR (App)
 * WHY IT EXISTS: This is the entry point layout of your entire software architecture.
 * It sets up the context provider tree layer-by-layer, wrapping your component tree
 * with the capabilities needed to handle data fetching, navigation routing, and authentication tracking.
 */
const App = () => {
  return (
    <>
      {/* Native device status bar styling (time, wifi, battery indicators) configured to light text color contrast */}
      <StatusBar style="light" />

      {/* THE CAPABILITY PROVIDER NESTING MATRIX:
        Each provider injects specific capabilities downwards through the entire component tree.
      */}
      <NativeRouter>
        {/* PROVIDER 1: APOLLO NETWORK CONTEXT
            Grants every child element the ability to fire GraphQL useQuery/useMutation hooks 
            and links them directly to our central client-side network caching engine.
        */}
        <ApolloProvider client={apolloClient}>
          {/* PROVIDER 2: AUTH STORAGE DEPENDENCY INJECTION
              WHY: Injects our device storage engine instance down into the React context tree. 
              Any child view or custom hook (like useSignIn or useSignOut) can now immediately 
              call useAuthStorage() to interact with AsyncStorage safely without prop-drilling.
          */}
          <AuthStorageContext.Provider value={authStorage}>
            {/* The primary visual baseline structure container frame layout */}
            <Main />
          </AuthStorageContext.Provider>
        </ApolloProvider>
      </NativeRouter>
    </>
  );
};

export default App;
