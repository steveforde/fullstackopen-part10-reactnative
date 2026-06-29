import { View, StyleSheet } from "react-native";
import { useParams } from "react-router-native";
import RepositoryItem from "./RepositoryList/RepositoryItem";
import useRepository from "../hooks/useRepository";
import Text from "./Text";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e1e4e8",
    flex: 1, // Spreads out to ensure the single item's background fills the rest of the window screen height
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});

/**
 * SINGLE REPOSITORY DETAIL VIEW
 * WHY IT EXISTS: Dedicated screen context designed to show full metrics and actions for a
 * single repository choice, matching the view requirements of Exercise 5.1.
 * * HOW IT WORKS: It grabs the unique parameter path token directly out of the URL link via
 * React Router, automatically feeds it into an isolated custom Apollo network hook,
 * and controls standard loading states gracefully before mounting the reused presentational card.
 */
const SingleRepository = () => {
  // ROUTE PARAMETER HARVESTING
  // WHY: Main.jsx specifies the path as "/repository/:id". The useParams() hook extracts
  // whatever string string filled that ":id" slot (e.g., "jaredpalmer.formik") so we can fetch it.
  const { id } = useParams();

  // Custom single-item data subscription hook fetching unique GraphQL node metadata fields
  const { repository, loading } = useRepository(id);

  // NETWORK CONTEXT GUARD CLAUSE
  // WHY: Since fetching data from the Apollo Server is an asynchronous network event operation,
  // we must halt rendering lines that depend on "repository" to avoid throwing an "undefined" reference exception error.
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading repository details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* COMPONENT REUSE IN ACTION:
        We pass item={repository} data down exactly like the dashboard feed list does, 
        but explicitly pass showGitHubButton={true} to force our reused component layout 
        to render the blue external browser linkage action bar button.
      */}
      <RepositoryItem item={repository} showGitHubButton={true} />
    </View>
  );
};

export default SingleRepository;
