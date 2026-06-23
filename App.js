import { NativeRouter } from "react-router-native";
import { StatusBar } from "expo-status-bar";
import { ApolloProvider } from "@apollo/client/react"; // 👈 Force the direct React entry point

import Main from "./src/components/Main";
import createApolloClient from "./src/utils/apolloClient";

// 👇 THESE WILL PRINT IN YOUR TERMINAL THE MOMENT YOU SAVE
console.log("--- CHECKING IMPORTS ---");
console.log("NativeRouter is:", typeof NativeRouter);
console.log("StatusBar is:", typeof StatusBar);
console.log("ApolloProvider is:", typeof ApolloProvider);
console.log("Main Component is:", typeof Main);
console.log("createApolloClient is:", typeof createApolloClient);
console.log("------------------------");

const apolloClient = createApolloClient();

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <NativeRouter>
        <StatusBar style="light" />
        <Main />
      </NativeRouter>
    </ApolloProvider>
  );
};

export default App;
