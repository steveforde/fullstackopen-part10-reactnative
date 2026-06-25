import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-native";
import Constants from "expo-constants";
import theme from "../theme";
import Text from "./Text";
import { GET_CURRENT_USER } from "../graphql/queries";
import useSignOut from "../hooks/useSignOut";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar, // Fixed: matching your theme.js definition
    flexDirection: "row",
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 20,
  },
  tabText: {
    color: theme.colors.appBarText, // Cleaner: using your theme's text color
    fontWeight: theme.fontWeights.bold,
  },
});

const AppBar = () => {
  const { data } = useQuery(GET_CURRENT_USER);
  const signOut = useSignOut();

  // If data.me exists, the user is authenticated
  const isAuthenticated = data && data.me !== null;

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <Link to="/">
          <Text style={styles.tabText} fontSize="subheading">
            Repositories
          </Text>
        </Link>

        {isAuthenticated ? (
          <Pressable onPress={signOut}>
            <Text style={styles.tabText} fontSize="subheading">
              Sign out
            </Text>
          </Pressable>
        ) : (
          <Link to="/signin">
            <Text style={styles.tabText} fontSize="subheading">
              Sign in
            </Text>
          </Link>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;
