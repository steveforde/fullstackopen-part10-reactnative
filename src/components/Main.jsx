import { StyleSheet, View } from "react-native";
import { Route, Routes, Navigate } from "react-router-native";
import RepositoryList from "./RepositoryList";
import AppBar from "./AppBar";
import SignIn from "./SignIn";
import SingleRepository from "./SingleRepository";
import CreateReview from "./CreateReview"; // Imported review form layer
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flex: 1, // Crucial: Spreads the root view container context out to fill the entire device viewport screen height
  },
});

/**
 * APPLICATION ROOT VIEW ROUTING HUB (Main)
 * WHY IT EXISTS: This is the baseline foundation structural framework layout container for your app.
 * Every page shares the top persistent persistent global navigation strip header (<AppBar />),
 * while the screen estate directly underneath swap contents dynamically based on the routing configuration match.
 */
const Main = () => {
  return (
    <View style={styles.container}>
      {/* Top Navigation Strip: Renders globally and persistently on every view screen layout */}
      <AppBar />

      {/* ROUTING CONTROLLER MATRIX */}
      <Routes>
        {/* Main Dashboard view listing tracked software repository metrics profiles */}
        <Route path="/" element={<RepositoryList />} />

        {/* DYNAMIC URL ROUTE
            WHY: The syntax colon syntax identifier (":id") registers a placeholder variable path parameter token slot. 
            When navigating to paths like `/repository/jaredpalmer.formik`, the router intercepts the variable 
            and mounts <SingleRepository />, allowing child views to harvest that string value using useParams().
        */}
        <Route path="/repository/:id" element={<SingleRepository />} />

        {/* REVIEWS CREATION ROUTE
            WHY IT EXISTS: Maps the user interaction form view path. When an authorized user hits 
            the tab bar item link, the router intercepts the navigation match state and mounts the 
            review inputs structure framework cleanly right here.
        */}
        <Route path="/create-review" element={<CreateReview />} />

        {/* User Session Form Authentication Submission View Screen */}
        <Route path="/signin" element={<SignIn />} />

        {/* FALLBACK / WILDCARD ROUTE CATCHER
            WHY: If the user inputs a broken/malformed deep link path url matching none of the targets above, 
            the path "*" catches the request and safely triggers an instant view redirection back to the safe root dashboard.
        */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;
