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
    // WHY: Ensures the top navigation bar clears the native hardware status bar notch area (time, battery, etc.)
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    flexDirection: "row",
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 20, // Clean spacing layout engine config between navigation links
  },
  tabText: {
    color: theme.colors.appBarText,
    fontWeight: theme.fontWeights.bold,
  },
});

/**
 * GLOBAL NAVIGATION APPLICATION BAR (AppBar)
 * WHY IT EXISTS: Serves as the top header layout navigation hub across your entire application.
 * * HOW IT WORKS: It establishes an active authentication query subscription listener to Apollo Client.
 * If a session token exists in your local storage engine, the server returns user credentials,
 * prompting the UI to switch between showing a "Sign in" link or showing the authenticated "Create a review"
 * and "Sign out" action options.
 */
const AppBar = () => {
  // Query hook listening continuously for changes to the logged-in user state session
  const { data } = useQuery(GET_CURRENT_USER);
  const signOut = useSignOut();

  // CONDITIONAL AUTHENTICATION LOGIC
  // WHY: The GraphQL endpoint returns a field 'me' which evaluates to null if an invalid/empty
  // Authorization header token is sent, and returns user data if authorized successfully.
  const isAuthenticated = data && data.me !== null;

  return (
    <View style={styles.container}>
      {/* ScrollView horizontal: Crucial layout for supporting small mobile devices when 
          adding multiple tab buttons, preventing text wrap collisions. */}
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        {/* Main Dashboard Feed Link */}
        <Link to="/">
          <Text style={styles.tabText} fontSize="subheading">
            Repositories
          </Text>
        </Link>

        {/* AUTHENTICATION ROUTING TOGGLE SWITCH
            WHY: Swapping out the view controls prevents an authenticated user from accessing 
            the sign-in screen, and opens up access to premium authenticated user flows like reviewing repositories.
        */}
        {isAuthenticated ? (
          <>
            {/* Create a review is a navigation path destination, wrapped cleanly in a Link wrapper */}
            <Link to="/create-review">
              <Text style={styles.tabText} fontSize="subheading">
                Create a review
              </Text>
            </Link>

            {/* Sign Out is an action trigger, so we hook it into a clean, unstyled Pressable callback */}
            <Pressable onPress={signOut}>
              <Text style={styles.tabText} fontSize="subheading">
                Sign out
              </Text>
            </Pressable>
          </>
        ) : (
          // Sign In is a navigation destination path route, so we wrap it in a Link component
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
